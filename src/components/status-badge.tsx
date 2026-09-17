import type { ReactElement, SVGProps } from "react";
import { label } from "@/lib/plants";

/**
 * Known plant status keys. The component prop stays `string` for
 * backward compatibility. This type only powers the internal
 * config lookup and its type-safe fallback.
 */
type StatusKey =
  | "healthy"
  | "growing"
  | "needs_water"
  | "sick"
  | "pest_infestation"
  | "damaged"
  | "sunburned"
  | "dormant";

type StatusTone = {
  /** Background, text, and ring classes for the pill. */
  container: string;

  /** Icon color, kept slightly more saturated than the text. */
  icon: string;

  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
};

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

const LeafIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M5 20c8 0 14-6 14-14V5h-1C10 5 4 11 4 19v1h1Z" />
    <path d="M9 15c2-3 5-5 9-6" />
  </IconBase>
);

const SproutIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M12 21V10" />
    <path d="M12 10c0-4 3-6 7-6 0 4-3 6-7 6Z" />
    <path d="M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
  </IconBase>
);

const DropletIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />
  </IconBase>
);

const AlertCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4.5" />
    <path d="M12 15.5h.01" />
  </IconBase>
);

const BugIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <rect x="7" y="8" width="10" height="10" rx="4" />
    <path d="M9 8V6a3 3 0 1 1 6 0v2" />
    <path d="M12 8v10" />
    <path d="M4 12h3M17 12h3" />
    <path d="M5.5 7l2 2M18.5 7l-2 2M5.5 18l2-2M18.5 18l-2-2" />
  </IconBase>
);

const TriangleAlertIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10.5v4" />
    <path d="M12 17.5h.01" />
  </IconBase>
);

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </IconBase>
);

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </IconBase>
);

const CircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
  </IconBase>
);

/**
 * Status design tokens. Each entry is a self-contained visual
 * treatment rather than a single flat class string.
 */
const STATUS_TONES: Record<StatusKey, StatusTone> = {
  healthy: {
    container:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    icon: "text-emerald-500",
    Icon: LeafIcon,
  },
  growing: {
    container: "bg-lime-50 text-lime-700 ring-lime-600/20",
    icon: "text-lime-500",
    Icon: SproutIcon,
  },
  needs_water: {
    container: "bg-sky-50 text-sky-700 ring-sky-600/20",
    icon: "text-sky-500",
    Icon: DropletIcon,
  },
  sick: {
    container: "bg-amber-50 text-amber-800 ring-amber-600/20",
    icon: "text-amber-500",
    Icon: AlertCircleIcon,
  },
  pest_infestation: {
    container: "bg-red-50 text-red-700 ring-red-600/20",
    icon: "text-red-500",
    Icon: BugIcon,
  },
  damaged: {
    container:
      "bg-orange-50 text-orange-700 ring-orange-600/20",
    icon: "text-orange-500",
    Icon: TriangleAlertIcon,
  },
  sunburned: {
    container:
      "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
    icon: "text-yellow-500",
    Icon: SunIcon,
  },
  dormant: {
    container:
      "bg-stone-100 text-stone-600 ring-stone-400/30",
    icon: "text-stone-400",
    Icon: MoonIcon,
  },
};

/** Neutral treatment for any unknown status. */
const FALLBACK_TONE: StatusTone = {
  container: "bg-stone-100 text-stone-600 ring-stone-400/30",
  icon: "text-stone-400",
  Icon: CircleIcon,
};

function isKnownStatus(status: string): status is StatusKey {
  return Object.prototype.hasOwnProperty.call(STATUS_TONES, status);
}

export function StatusBadge({ status }: { status: string }) {
  const tone = isKnownStatus(status)
    ? STATUS_TONES[status]
    : FALLBACK_TONE;

  const { Icon } = tone;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none ring-1 ring-inset ${tone.container}`}
    >
      <Icon className={`h-3 w-3 shrink-0 ${tone.icon}`} />
      {label(status)}
    </span>
  );
}