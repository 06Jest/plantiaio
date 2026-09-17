"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group } from "three";

/* ------------------------------------------------------------------------
 * Status styling - each status maps to a coherent set of visual + motion
 * parameters instead of just a leaf color, so the plant's condition reads
 * clearly (fullness, color, curl, sway, lift) without looking cartoonish.
 * ---------------------------------------------------------------------- */

type StatusStyle = {
  leaf: string; // base leaf hue
  accent?: string; // secondary tint used for disease / burn / blotch effects
  accentAmount: number; // 0..1 baseline strength of the accent blend
  tipBurn: number; // 0..1 extra accent concentrated at leaf tips/edges
  blotch: number; // 0..1 amount of scattered discoloration
  desaturate: number; // 0..1 pull toward a muted neutral tone
  glow: string; // ambient backdrop tint
  sway: number; // overall motion multiplier
  lift: number; // radians added to leaf rise (+up / -droop)
  curlBoost: number; // multiplier on leaf curl/fold (wilting, curling edges)
  scale: number; // leaf size multiplier
  fullness: number; // 0..1 fraction of leaves kept (rest "not grown yet" / dropped)
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  healthy: {
    leaf: "#3f9a63",
    accentAmount: 0,
    tipBurn: 0,
    blotch: 0,
    desaturate: 0,
    glow: "#d7f4df",
    sway: 0.55,
    lift: 0.02,
    curlBoost: 1,
    scale: 1.05,
    fullness: 1,
  },
  growing: {
    leaf: "#79c151",
    accentAmount: 0,
    tipBurn: 0,
    blotch: 0,
    desaturate: 0,
    glow: "#e9f8c9",
    sway: 0.8,
    lift: 0.16,
    curlBoost: 0.88,
    scale: 1,
    fullness: 1,
  },
  needs_water: {
    leaf: "#7fa79f",
    accentAmount: 0,
    tipBurn: 0,
    blotch: 0,
    desaturate: 0.35,
    glow: "#d6eeee",
    sway: 0.22,
    lift: -0.1,
    curlBoost: 1.12,
    scale: 0.97,
    fullness: 1,
  },
  sick: {
    leaf: "#b7a23c",
    accent: "#e4cf6a",
    accentAmount: 0.35,
    tipBurn: 0.1,
    blotch: 0.28,
    desaturate: 0.1,
    glow: "#fbf1ba",
    sway: 0.16,
    lift: -0.06,
    curlBoost: 1.12,
    scale: 0.94,
    fullness: 0.9,
  },
  pest_infestation: {
    leaf: "#8d8a45",
    accent: "#5f3f22",
    accentAmount: 0.3,
    tipBurn: 0.05,
    blotch: 0.5,
    desaturate: 0.05,
    glow: "#f7dfbb",
    sway: 0.12,
    lift: -0.08,
    curlBoost: 1.08,
    scale: 0.93,
    fullness: 0.82,
  },
  damaged: {
    leaf: "#8a5c3d",
    accent: "#4f3221",
    accentAmount: 0.55,
    tipBurn: 0.2,
    blotch: 0.22,
    desaturate: 0.05,
    glow: "#f7d6c4",
    sway: 0.07,
    lift: -0.2,
    curlBoost: 1.45,
    scale: 0.85,
    fullness: 0.68,
  },
  sunburned: {
    leaf: "#c98d3c",
    accent: "#7c4a1f",
    accentAmount: 0.25,
    tipBurn: 0.55,
    blotch: 0.12,
    desaturate: 0,
    glow: "#fae4a8",
    sway: 0.14,
    lift: -0.02,
    curlBoost: 1.18,
    scale: 0.97,
    fullness: 0.92,
  },
  dormant: {
    leaf: "#8a7c68",
    accentAmount: 0,
    tipBurn: 0,
    blotch: 0,
    desaturate: 0.5,
    glow: "#e9e2da",
    sway: 0.05,
    lift: -0.14,
    curlBoost: 1.22,
    scale: 0.78,
    fullness: 0.55,
  },
};

const DEFAULT_STYLE = STATUS_STYLES.growing;

const GOLDEN_ANGLE = 2.399963; // ~137.5deg - natural spiral phyllotaxis
const LEAF_COUNT = 11;

const deg = (degrees: number) => (degrees * Math.PI) / 180;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function shadeColor(hex: string, amount: number): string {
  const color = new THREE.Color(hex);
  if (amount >= 0) color.lerp(new THREE.Color("#ffffff"), amount);
  else color.lerp(new THREE.Color("#1a1608"), -amount);
  return `#${color.getHexString()}`;
}

function mixColor(base: THREE.Color, target: THREE.Color, amount: number) {
  return base.clone().lerp(target, clamp01(amount));
}

// Deterministic pseudo-random noise (no Math.random) so geometry is stable
// across re-renders and hydration.
function hashNoise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453123;
  return n - Math.floor(n);
}

/* ------------------------------------------------------------------------
 * Tapered tube geometry - replaces THREE.TubeGeometry with a version whose
 * radius eases from a start to an end value along the curve, giving the
 * stem and branches natural, organic thickness instead of rigid pipes.
 * ---------------------------------------------------------------------- */

function createTaperedTube(
  curve: THREE.CatmullRomCurve3,
  options: { segments?: number; radialSegments?: number; radiusStart: number; radiusEnd: number }
): THREE.BufferGeometry {
  const { segments = 16, radialSegments = 6, radiusStart, radiusEnd } = options;
  const frames = curve.computeFrenetFrames(segments, false);
  const points = curve.getSpacedPoints(segments);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t);
    const point = points[i];
    const normal = frames.normals[i];
    const binormal = frames.binormals[i];

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2;
      const sin = Math.sin(angle);
      const cos = -Math.cos(angle);

      const nx = cos * normal.x + sin * binormal.x;
      const ny = cos * normal.y + sin * binormal.y;
      const nz = cos * normal.z + sin * binormal.z;

      positions.push(point.x + radius * nx, point.y + radius * ny, point.z + radius * nz);
      normals.push(nx, ny, nz);
      uvs.push(t, j / radialSegments);
    }
  }

  const ring = radialSegments + 1;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * ring + j;
      const b = a + ring;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingSphere();
  return geometry;
}

function createStemCurve(points: Array<[number, number, number]>) {
  return new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
}

/* ------------------------------------------------------------------------
 * Leaf blueprints and geometry
 * ---------------------------------------------------------------------- */

type LeafBlueprint = {
  id: number;
  azimuth: number;
  height: number;
  outward: number;
  rise: number;
  lean: number;
  spin: number;
  length: number;
  width: number;
  curl: number;
  fold: number;
  skew: number;
  taperPeak: number;
  tone: number;
  phase: number;
  swayScale: number;
};

function buildLeafBlueprints(count: number): LeafBlueprint[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(1, count - 1);
    const length = 0.92 - t * 0.34 + Math.sin(i * 1.3) * 0.045;
    return {
      id: i,
      azimuth: i * GOLDEN_ANGLE,
      height: 0.48 + t * 1.05 + Math.sin(i * 1.7) * 0.05,
      outward: 0.06 + (1 - t) * 0.05 + Math.sin(i * 2.9) * 0.015,
      rise: deg(22 + t * 44 + Math.sin(i * 2.3) * 7),
      lean: Math.sin(i * 1.6) * 0.24,
      spin: Math.sin(i * 3.1) * 0.32,
      length,
      width: length * (0.34 + Math.cos(i * 1.9) * 0.045),
      curl: 0.15 + Math.sin(i * 2.7) * 0.045,
      fold: 0.22 + Math.cos(i * 1.1) * 0.035,
      skew: Math.sin(i * 4.2) * 0.6,
      taperPeak: 0.34 + Math.sin(i * 2.1) * 0.08,
      tone: Math.sin(i * 2.1) * 0.08,
      phase: i * 1.87 + Math.sin(i * 5.3) * 2,
      swayScale: 0.75 + Math.sin(i * 3.7) * 0.25,
    };
  });
}

/**
 * Builds a tapered, curled leaf blade by reshaping a subdivided plane, then
 * bakes the final per-vertex color (base tone + midrib highlight + any
 * status accent/blotch/tip-burn) directly into the geometry so the mesh can
 * use a plain white material and read the color straight off the surface.
 */
function createLeafGeometry(
  blueprint: Pick<LeafBlueprint, "id" | "length" | "width" | "curl" | "fold" | "skew" | "taperPeak" | "tone">,
  style: StatusStyle
): THREE.BufferGeometry {
  const { id, curl, fold, skew, taperPeak, tone } = blueprint;
  const length = blueprint.length * style.scale;
  const width = blueprint.width * style.scale;
  const widthSegments = 6;
  const heightSegments = 8;
  const geometry = new THREE.PlaneGeometry(width, length, widthSegments, heightSegments);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 3);

  const baseColor = new THREE.Color(shadeColor(style.leaf, tone));
  const desatColor = style.desaturate > 0 ? baseColor.clone().lerp(new THREE.Color("#8f8a78"), style.desaturate) : baseColor;
  const accentColor = style.accent ? new THREE.Color(style.accent) : null;

  const curlAmt = curl * style.curlBoost;
  const foldAmt = fold * style.curlBoost;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const t = clamp01(y / length + 0.5);

    const profile =
      t < taperPeak
        ? Math.sin(clamp01(t / taperPeak) * (Math.PI / 2))
        : Math.sin(clamp01((1 - t) / (1 - taperPeak)) * (Math.PI / 2));

    const xNorm = width > 0 ? x / (width / 2) : 0;
    const newX = x * profile + skew * t * t * width * 0.18;
    const midribBump = (1 - Math.min(1, Math.abs(xNorm) * 2.6)) * 0.012 * profile;
    const newZ = Math.sin(t * Math.PI * 0.85) * curlAmt - foldAmt * profile * xNorm * xNorm + midribBump;

    position.setXYZ(i, newX, t * length, newZ);

    const centerFade = 1 - Math.min(1, Math.abs(xNorm));
    let vertexColor = desatColor.clone().lerp(new THREE.Color("#ffffff"), centerFade * 0.16);

    if (accentColor && style.accentAmount > 0) {
      const blotchNoise = style.blotch > 0 ? hashNoise(id * 3.1 + Math.round(x * 8), Math.round(y * 8), id) : 0;
      const blotchMask = style.blotch > 0 ? clamp01((blotchNoise - (1 - style.blotch)) * 3) : 0;
      const tipMask = style.tipBurn > 0 ? clamp01((t - 0.5) * 2) * (0.4 + Math.abs(xNorm) * 0.6) * style.tipBurn : 0;
      const accentMix = clamp01(style.accentAmount * 0.6 + blotchMask + tipMask);
      vertexColor = mixColor(vertexColor, accentColor, accentMix);
    }

    colors[i * 3] = vertexColor.r;
    colors[i * 3 + 1] = vertexColor.g;
    colors[i * 3 + 2] = vertexColor.b;
  }

  position.needsUpdate = true;
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function Leaf({
  geometry,
  blueprint,
  style,
  stemColor,
  swayRef,
}: {
  geometry: THREE.BufferGeometry;
  blueprint: LeafBlueprint;
  style: StatusStyle;
  stemColor: string;
  swayRef: (node: Group | null) => void;
}) {
  return (
    <group rotation={[0, blueprint.azimuth, 0]} position={[0, blueprint.height, 0]}>
      <group ref={swayRef} rotation={[blueprint.lean, 0, blueprint.rise + style.lift]}>
        <mesh position={[blueprint.outward / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.015, 0.006, blueprint.outward, 5]} />
          <meshStandardMaterial color={stemColor} roughness={0.6} metalness={0.02} />
        </mesh>
        <group position={[blueprint.outward, 0, 0]}>
          <mesh geometry={geometry} rotation={[0, blueprint.spin, 0]} castShadow receiveShadow>
            <meshStandardMaterial vertexColors color="#ffffff" side={THREE.DoubleSide} roughness={0.52} metalness={0.03} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Stem({ geometry, color }: { geometry: THREE.BufferGeometry; color: string }) {
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.02} />
    </mesh>
  );
}

/* ------------------------------------------------------------------------
 * Pot, soil and ground contact shading
 * ---------------------------------------------------------------------- */

function createGlazedPotGeometry(topRadius: number, bottomRadius: number, height: number, radialSegments = 32) {
  const geometry = new THREE.CylinderGeometry(topRadius, bottomRadius, height, radialSegments, 1, false);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 3);
  const top = new THREE.Color("#efe6d6");
  const bottom = new THREE.Color("#c9b89a");
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const t = clamp01(y / height + 0.5);
    const speckle = (hashNoise(position.getX(i) * 6, position.getZ(i) * 6, 3) - 0.5) * 0.05;
    const color = bottom.clone().lerp(top, t);
    color.offsetHSL(0, 0, speckle);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function createSoilGeometry(radius: number, segments = 28) {
  const geometry = new THREE.CircleGeometry(radius, segments);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 3);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const bump = hashNoise(x * 9, y * 9, 7);
    position.setZ(i, (bump - 0.5) * 0.02);
    const shade = 0.85 + (bump - 0.5) * 0.3;
    colors[i * 3] = 0.16 * shade;
    colors[i * 3 + 1] = 0.11 * shade;
    colors[i * 3 + 2] = 0.08 * shade;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createGroundAO(radius: number, segments = 48) {
  const geometry = new THREE.CircleGeometry(radius, segments);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 4);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const dist = Math.sqrt(x * x + y * y) / radius;
    const alpha = Math.pow(1 - clamp01(dist), 1.6) * 0.35;
    colors[i * 4] = 0.06;
    colors[i * 4 + 1] = 0.05;
    colors[i * 4 + 2] = 0.03;
    colors[i * 4 + 3] = alpha;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
  return geometry;
}

function PotAndSoil() {
  const potGeometry = useMemo(() => createGlazedPotGeometry(0.8, 0.6, 0.92), []);
  const soilGeometry = useMemo(() => createSoilGeometry(0.7), []);
  const aoGeometry = useMemo(() => createGroundAO(1.6), []);

  useEffect(() => {
    return () => {
      potGeometry.dispose();
      soilGeometry.dispose();
      aoGeometry.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group>
      <mesh geometry={potGeometry} position={[0, -0.54, 0]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.82, 0.045, 10, 28]} />
        <meshStandardMaterial color="#d8c9ac" roughness={0.35} metalness={0.06} />
      </mesh>
      <mesh geometry={soilGeometry} position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <mesh geometry={aoGeometry} position={[0, -1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial vertexColors transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.1, 32]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------------
 * Plant model - assembles pot, tapered stem/branches and leaves, and drives
 * the per-leaf sway animation.
 * ---------------------------------------------------------------------- */

function PlantModel({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STYLE;
  const structureRef = useRef<Group>(null);
  const leafSwayRefs = useRef<Map<number, Group>>(new Map());
  const reducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    const handleChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
    };
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const leafBlueprints = useMemo(() => buildLeafBlueprints(LEAF_COUNT), []);
  const visibleCount = Math.max(3, Math.round(LEAF_COUNT * style.fullness));
  const activeLeaves = useMemo(() => leafBlueprints.slice(0, visibleCount), [leafBlueprints, visibleCount]);

  const leafGeometries = useMemo(() => activeLeaves.map((leaf) => createLeafGeometry(leaf, style)), [activeLeaves, style]);

  useEffect(() => {
    return () => {
      leafGeometries.forEach((geometry) => geometry.dispose());
    };
  }, [leafGeometries]);

  const stemGeometry = useMemo(
    () =>
      createTaperedTube(
        createStemCurve([
          [0, 0, 0],
          [0.05, 0.42, 0.02],
          [-0.04, 0.88, -0.03],
          [0.02, 1.3, 0.02],
          [0.05, 1.55, 0.05],
        ]),
        { segments: 24, radialSegments: 7, radiusStart: 0.058, radiusEnd: 0.02 }
      ),
    []
  );

  const branchGeometries = useMemo(() => {
    const defs: Array<{ points: Array<[number, number, number]>; radiusStart: number; radiusEnd: number }> = [
      {
        points: [
          [0.01, 0.5, 0.01],
          [0.24, 0.66, 0.13],
          [0.42, 0.78, 0.26],
          [0.55, 0.92, 0.36],
        ],
        radiusStart: 0.026,
        radiusEnd: 0.008,
      },
      {
        points: [
          [-0.02, 0.78, -0.01],
          [-0.24, 0.94, -0.15],
          [-0.4, 1.06, -0.27],
          [-0.5, 1.22, -0.36],
        ],
        radiusStart: 0.024,
        radiusEnd: 0.007,
      },
      {
        points: [
          [0.02, 1.05, 0.02],
          [0.18, 1.2, 0.2],
          [0.28, 1.34, 0.32],
          [0.34, 1.5, 0.42],
        ],
        radiusStart: 0.02,
        radiusEnd: 0.006,
      },
    ];
    return defs.map((def) =>
      createTaperedTube(createStemCurve(def.points), {
        segments: 12,
        radialSegments: 6,
        radiusStart: def.radiusStart,
        radiusEnd: def.radiusEnd,
      })
    );
  }, []);

  useEffect(() => {
    return () => {
      stemGeometry.dispose();
      branchGeometries.forEach((geometry) => geometry.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stemColor = useMemo(() => shadeColor(style.leaf, -0.45), [style.leaf]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const motionOn = !reducedMotion.current;

    if (structureRef.current) {
      const amp = motionOn ? 0.03 * style.sway : 0;
      structureRef.current.rotation.z = Math.sin(t * 0.6) * amp;
      structureRef.current.rotation.x = Math.sin(t * 0.45 + 1.1) * amp * 0.5;
    }

    activeLeaves.forEach((leaf) => {
      const node = leafSwayRefs.current.get(leaf.id);
      if (!node) return;
      const amp = motionOn ? 0.06 * style.sway * leaf.swayScale : 0;
      const swayZ = Math.sin(t * 1.1 + leaf.phase) * amp;
      const swayX = Math.sin(t * 0.8 + leaf.phase * 1.3) * amp * 0.55;
      node.rotation.z = leaf.rise + style.lift + swayZ;
      node.rotation.x = leaf.lean + swayX;
    });
  });

  return (
    <group>
      <PotAndSoil />
      <group ref={structureRef}>
        <Stem geometry={stemGeometry} color={stemColor} />
        {branchGeometries.map((geometry, index) => (
          <Stem key={index} geometry={geometry} color={stemColor} />
        ))}
      </group>
      {activeLeaves.map((leaf, index) => (
        <Leaf
          key={leaf.id}
          geometry={leafGeometries[index]}
          blueprint={leaf}
          style={style}
          stemColor={stemColor}
          swayRef={(node) => {
            if (node) leafSwayRefs.current.set(leaf.id, node);
            else leafSwayRefs.current.delete(leaf.id);
          }}
        />
      ))}
    </group>
  );
}

export function PlantVisual({ status, className = "" }: { status: string; className?: string }) {
  const style = STATUS_STYLES[status] ?? DEFAULT_STYLE;

  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: `radial-gradient(circle at 50% 32%, ${style.glow}, #f8faf8 72%)` }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.9, 5.7], fov: 35 }}
        dpr={[1, 1.5]}
        onCreated={({ camera }) => camera.lookAt(0, 0.55, 0)}
      >
        <ambientLight intensity={0.55} color={style.glow} />
        <hemisphereLight color={style.glow} groundColor="#4b4336" intensity={0.42} />
        <directionalLight
          position={[3, 5, 3]}
          intensity={1.55}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
          shadow-camera-left={-2.2}
          shadow-camera-right={2.2}
          shadow-camera-top={2.5}
          shadow-camera-bottom={-2.5}
          shadow-camera-near={0.5}
          shadow-camera-far={9}
        />
        <directionalLight position={[-3.5, 2.2, -2.5]} intensity={0.5} color="#eef3ff" />
        <PlantModel status={status} />
      </Canvas>
    </div>
  );
}