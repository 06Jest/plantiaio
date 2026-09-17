// data/plant-guides.ts
//
// Static plant-care knowledge base. Content lives here, fully separated
// from presentation (components/plant-guide/*). No network or AI calls
// are made anywhere in this file or its consumers.
//
// To add a guide: append a new PlantGuide object to PLANT_GUIDES and add
// its slug to any other guide's relatedSlugs where relevant.

import type {
  GuideCategory,
  GuideCategoryInfo,
  PlantGuide,
} from "./plant-guide-types";

export const CATEGORIES: GuideCategoryInfo[] = [
  { id: "watering", label: "Watering" },
  { id: "lighting", label: "Lighting" },
  { id: "soil", label: "Soil & Drainage" },
  { id: "fertilizing", label: "Fertilizing" },
  { id: "climate", label: "Temperature & Humidity" },
  { id: "repotting", label: "Repotting" },
  { id: "pruning", label: "Pruning" },
  { id: "propagation", label: "Propagation" },
  { id: "pests", label: "Pests" },
  { id: "diseases", label: "Diseases" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "plant-types", label: "Plant Types" },
];

const CATEGORY_LABELS: Record<GuideCategory, string> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.label }),
  {} as Record<GuideCategory, string>
);

export const PLANT_GUIDES: PlantGuide[] = [
  {
    slug: "watering",
    title: "Watering Your Houseplants",
    description:
      "How to figure out when and how much to water, and why \u2018once a week\u2019 isn\u2019t a real rule.",
    category: "watering",
    categoryLabel: CATEGORY_LABELS.watering,
    readingTime: "7 min read",
    keywords: [
      "water",
      "watering schedule",
      "overwatering",
      "underwatering",
      "soil moisture",
      "drainage",
    ],
    sections: [
      {
        id: "how-watering-works",
        heading: "How watering actually works",
        paragraphs: [
          "Plants don't drink on a calendar. They use water at a rate that depends on how much light they're getting, the temperature and humidity around them, how big their root system is, and what kind of soil they're planted in. A snake plant in a dim corner and a pothos in a bright window can go through water at completely different rates even if they're the same size.",
          "Because of this, the healthiest approach is to check the plant rather than the calendar. A fixed \u2018water every Sunday\u2019 schedule works by accident some weeks and causes problems other weeks.",
        ],
        bulletsTitle: "What changes how fast a plant uses water",
        bullets: [
          "Light level \u2014 more light usually means faster water use",
          "Temperature \u2014 warmer air speeds up evaporation and growth",
          "Humidity \u2014 dry air pulls moisture out of soil and leaves faster",
          "Pot size and material \u2014 terracotta dries faster than plastic or glazed ceramic",
          "Root density \u2014 a root-bound plant can dry out much faster than one with room to spare",
        ],
      },
      {
        id: "when-to-water",
        heading: "When to water",
        paragraphs: [
          "The most reliable method is a simple finger test: push a finger about two inches into the soil. If it feels dry at that depth, it's usually time to water. If it's still damp, wait and check again in a few days.",
          "For a more precise check, a moisture meter can help, especially for larger pots where the top inch dries out long before the root zone does. As a general (not universal) pattern, plants that prefer to dry out between waterings \u2014 many succulents and some tropicals \u2014 should feel dry a couple inches down before you water again, while plants that like consistent moisture, like ferns, prefer the soil to stay lightly damp.",
        ],
        bulletsTitle: "Quick ways to check",
        bullets: [
          "Finger test 1-2 inches into the soil",
          "Lift the pot \u2014 noticeably lighter usually means dry",
          "Watch the leaves \u2014 some plants (like peace lilies) droop slightly when thirsty, then perk back up after watering",
          "Use a moisture meter for larger or deeper pots",
        ],
      },
      {
        id: "over-under-watering",
        heading: "Overwatering vs. underwatering",
        paragraphs: [
          "Overwatering is less about how much water you give and more about how often the roots sit in wet soil. Roots need oxygen, and soil that stays saturated for too long suffocates them, which can lead to root rot even if you're \u2018only\u2019 watering once a week.",
          "Underwatering tends to show up as crispy, dry leaf edges, soil that pulls away from the pot sides, and slow or stalled growth. It's usually easier to fix than overwatering, since a good soak brings most plants back quickly.",
        ],
        bulletsTitle: "Signs to watch for",
        bullets: [
          "Overwatering: yellowing leaves that feel soft or mushy, a sour or swampy smell from the soil, mold on the surface, gnats hovering around the pot",
          "Underwatering: dry, crispy leaf edges, drooping that improves quickly after watering, soil pulling away from the pot",
        ],
      },
      {
        id: "drainage-and-mistakes",
        heading: "Drainage and common mistakes",
        paragraphs: [
          "Good drainage matters as much as watering frequency. A pot without a drainage hole makes it very easy to overwater, because excess water has nowhere to go and just sits at the bottom of the root zone.",
          "If you're using a decorative pot without holes, it's usually safer to keep the plant in a plastic nursery pot with drainage and set that inside the decorative one, rather than planting directly into it.",
        ],
        bulletsTitle: "Common mistakes",
        bullets: [
          "Watering on a fixed schedule regardless of conditions",
          "Letting a pot sit in a saucer full of runoff water",
          "Small, frequent sips instead of a thorough soak that reaches the whole root ball",
          "Using a pot with no drainage hole",
          "Assuming all houseplants want the same watering routine",
        ],
      },
    ],
    relatedSlugs: ["soil-and-drainage", "yellow-leaves", "drooping-leaves"],
  },

  {
    slug: "lighting",
    title: "Understanding Light for Houseplants",
    description:
      "The difference between direct, bright indirect, and low light, and how to tell what your space actually offers.",
    category: "lighting",
    categoryLabel: CATEGORY_LABELS.lighting,
    readingTime: "6 min read",
    keywords: [
      "light",
      "sunlight",
      "indirect light",
      "low light",
      "window direction",
      "grow lights",
    ],
    sections: [
      {
        id: "light-types",
        heading: "Direct, indirect, and low light",
        paragraphs: [
          "\u2018Direct light\u2019 means unfiltered sun hitting the leaves \u2014 typically a few hours in a south- or west-facing window. \u2018Bright indirect light\u2019 means the room is well lit but the sun's rays aren't landing straight on the plant, often because of a sheer curtain, a bit of distance from the window, or an east-facing exposure. \u2018Low light\u2019 means the space is usable for reading but has no strong natural brightness.",
          "Most popular houseplants marketed as \u2018easy\u2019 \u2014 pothos, philodendron, many ferns \u2014 are adapted to bright indirect light, not direct sun. A smaller group, like succulents, cacti, and many flowering plants, genuinely want direct sun to thrive.",
        ],
        bulletsTitle: "Rough window guide (Northern Hemisphere)",
        bullets: [
          "South-facing: the brightest, most direct light through the day",
          "West-facing: strong direct light in the afternoon",
          "East-facing: gentle direct light in the morning, indirect the rest of the day",
          "North-facing: the softest, most indirect light, no direct sun",
        ],
      },
      {
        id: "signs-too-much-light",
        heading: "Signs a plant is getting too much light",
        paragraphs: [
          "Too much direct sun, especially for a plant adapted to indirect light, tends to show up as pale, bleached, or crispy patches on the leaves facing the window \u2014 often called leaf scorch or sunburn.",
          "This can happen even to sun-loving plants if they're moved outdoors or to a brighter window too abruptly, since leaves need time to build up tolerance.",
        ],
        bulletsTitle: "Signs to watch for",
        bullets: [
          "Pale, faded, or bleached patches on sun-facing leaves",
          "Brown, crispy spots that look papery rather than soft",
          "Leaves curling or drooping away from the light source in the middle of the day",
        ],
      },
      {
        id: "signs-too-little-light",
        heading: "Signs a plant isn't getting enough light",
        paragraphs: [
          "Insufficient light usually shows up gradually: smaller new leaves, longer gaps between leaves along the stem (called legginess), leaning hard toward the nearest window, and slower overall growth.",
          "Variegated plants often respond to low light by producing more solid green leaves, since green tissue is more efficient at photosynthesis \u2014 it's the plant prioritizing survival over pattern.",
        ],
        bulletsTitle: "Signs to watch for",
        bullets: [
          "Leggy, stretched-out growth with long gaps between leaves",
          "New leaves noticeably smaller than older ones",
          "Strong leaning toward the light source",
          "Loss of variegation on patterned varieties",
          "Very slow or stalled growth even in the growing season",
        ],
      },
      {
        id: "acclimation-and-grow-lights",
        heading: "Light acclimation and grow lights",
        paragraphs: [
          "Plants adjust to a light level over time, so any sudden change \u2014 moving from a dim corner to a sunny sill, or taking a houseplant outside for summer \u2014 should happen gradually over one to two weeks to avoid shock or scorch.",
          "If natural light is limited, a basic full-spectrum LED grow light run for 10-14 hours a day can substitute for or supplement a window, especially for plants that want brighter conditions than a room naturally provides.",
        ],
        bulletsTitle: "Quick reference",
        bullets: [
          "Move plants into brighter light gradually, not all at once",
          "Rotate pots occasionally so growth doesn't lean one direction",
          "Grow lights are measured by output and distance, not just wattage",
          "Low light doesn't mean no light \u2014 true no-light spaces can't sustain any plant long-term",
        ],
      },
    ],
    relatedSlugs: ["indoor-plant-types", "slow-growth", "yellow-leaves"],
  },

  {
    slug: "soil-and-drainage",
    title: "Soil and Drainage Basics",
    description:
      "What potting mix actually needs to do, and how to choose or build one for different kinds of plants.",
    category: "soil",
    categoryLabel: CATEGORY_LABELS.soil,
    readingTime: "6 min read",
    keywords: ["potting mix", "soil", "drainage", "perlite", "aeration", "root rot"],
    sections: [
      {
        id: "what-soil-needs-to-do",
        heading: "What a good potting mix needs to do",
        paragraphs: [
          "Potting mix has two competing jobs: hold enough water and nutrients for roots to use, while also letting excess water drain away and air reach the roots. Garden soil generally fails both jobs in a pot \u2014 it compacts, drains poorly, and can carry pests or pathogens \u2014 which is why houseplants are grown in soilless or lightly soil-based mixes instead.",
          "There's no single \u2018best\u2019 mix for every plant. A cactus and a peace lily want very different balances of drainage versus water retention.",
        ],
        bulletsTitle: "Common ingredients and what they do",
        bullets: [
          "Perlite \u2014 lightweight volcanic mineral that improves drainage and aeration",
          "Bark (orchid or fir bark) \u2014 chunky material that creates air pockets, common for aroids and epiphytes",
          "Coco coir or peat \u2014 holds moisture and nutrients",
          "Sand (coarse) \u2014 adds weight and drainage, common in cactus mixes",
          "Compost or worm castings \u2014 adds organic matter and nutrients",
        ],
      },
      {
        id: "matching-mix-to-plant",
        heading: "Matching soil to plant type",
        paragraphs: [
          "As a general pattern, succulents and cacti want a fast-draining mix \u2014 often a base potting soil cut with extra perlite or coarse sand so water moves through quickly. Many popular aroids (monstera, philodendron, pothos) do well in a chunkier mix with bark and perlite that mimics the loose, airy material they'd root into in the wild.",
          "Plants that like consistent moisture, like ferns or peace lilies, generally want a mix with more water-retentive material, such as coco coir or a bit of compost, while still draining freely rather than staying soggy.",
        ],
        bulletsTitle: "General starting points (adjust by species)",
        bullets: [
          "Succulents/cacti: potting soil + extra perlite or coarse sand for fast drainage",
          "Aroids (pothos, philodendron, monstera): potting soil + bark + perlite for a chunky, airy mix",
          "Ferns/moisture-lovers: potting soil + coco coir, slightly more water-retentive",
          "Orchids: bark-based mix, not standard potting soil at all",
        ],
      },
      {
        id: "drainage-and-root-rot",
        heading: "Drainage and preventing root rot",
        paragraphs: [
          "Drainage isn't just about the soil \u2014 the pot matters too. A pot with a drainage hole lets excess water escape instead of pooling at the bottom, which is one of the simplest ways to prevent root rot regardless of how careful you are with watering.",
          "A layer of gravel at the bottom of a pot doesn't actually improve drainage the way many people assume \u2014 it can raise the water table inside the pot instead. Choosing the right mix and a pot with a real drainage hole matters more.",
        ],
        bulletsTitle: "Signs your setup may not be draining well",
        bullets: [
          "Water sits on the surface for a long time after watering",
          "Soil stays wet for many days even in a well-lit, warm spot",
          "A sour or swampy smell",
          "Soil looks compacted or has stopped absorbing water easily",
        ],
      },
    ],
    relatedSlugs: ["watering", "repotting", "common-diseases"],
  },

  {
    slug: "fertilizing",
    title: "Fertilizing Houseplants",
    description:
      "What N-P-K actually means, how often to feed, and how to avoid fertilizer burn.",
    category: "fertilizing",
    categoryLabel: CATEGORY_LABELS.fertilizing,
    readingTime: "6 min read",
    keywords: ["fertilizer", "npk", "nutrients", "fertilizer burn", "nutrient deficiency"],
    sections: [
      {
        id: "npk-explained",
        heading: "N-P-K and other nutrients, briefly",
        paragraphs: [
          "Fertilizer labels show three numbers, like 10-10-10, representing the percentage of nitrogen (N), phosphorus (P), and potassium (K) by weight. Nitrogen generally supports leafy, green growth; phosphorus supports roots and flowering; potassium supports overall plant function and stress tolerance. Plants also need smaller amounts of micronutrients like iron, magnesium, and calcium.",
          "A balanced, general-purpose houseplant fertilizer with roughly equal N-P-K numbers works for most foliage plants. Flowering or fruiting plants sometimes benefit from a formula with relatively more phosphorus during bloom season.",
        ],
        bulletsTitle: "Fertilizer formats",
        bullets: [
          "Liquid fertilizer \u2014 diluted in water, fast-acting, easy to control the dose",
          "Slow-release granules or spikes \u2014 feed gradually over weeks to months",
          "Organic options (compost, worm castings, fish emulsion) \u2014 gentler, lower risk of burn, slower acting",
        ],
      },
      {
        id: "when-to-fertilize",
        heading: "When to fertilize (and when not to)",
        paragraphs: [
          "Most houseplants grow actively in spring and summer and slow down in fall and winter. Fertilizing during the active growing season, roughly every 2-4 weeks depending on the product, supports that growth. Fertilizing during dormancy generally doesn't help and can build up salts in soil the plant isn't using quickly.",
          "Avoid fertilizing a plant that's stressed, recently repotted, very dry, or freshly propagated \u2014 fertilizer works with water and active roots, and applying it to a struggling or newly disturbed plant can add stress rather than help.",
        ],
        bulletsTitle: "When to hold off",
        bullets: [
          "During winter dormancy for most houseplants",
          "Right after repotting \u2014 wait several weeks",
          "On bone-dry soil \u2014 water first, then fertilize on your next watering",
          "On a plant that's actively wilting, pest-stressed, or diseased",
        ],
      },
      {
        id: "fertilizer-burn-and-deficiency",
        heading: "Fertilizer burn and nutrient deficiency",
        paragraphs: [
          "Fertilizer burn happens when too much fertilizer builds up mineral salts in the soil, drawing water out of roots rather than letting them absorb it. It commonly shows as brown, crispy leaf edges or tips, sometimes with a yellow halo, and it tends to affect multiple leaves at once rather than just older or just newer growth.",
          "Nutrient deficiency looks different depending on the missing nutrient \u2014 for example, nitrogen deficiency often shows as overall pale, yellowing older leaves, while iron deficiency (common in high-pH soil) shows as yellowing between the veins on new leaves while the veins stay green.",
        ],
        bulletsTitle: "Quick reference",
        bullets: [
          "Fertilizer burn: crispy brown tips/edges, often with several leaves affected at once, white crust sometimes visible on soil surface",
          "Nitrogen deficiency: overall pale, yellowing older leaves, slowed growth",
          "Iron deficiency: yellowing between veins on new leaves, veins stay green",
          "If in doubt, flush soil with plain water and hold off feeding for a few weeks",
        ],
      },
    ],
    relatedSlugs: ["watering", "yellow-leaves", "soil-and-drainage"],
  },

  {
    slug: "temperature-and-humidity",
    title: "Temperature and Humidity for Houseplants",
    description:
      "Comfortable ranges for most houseplants, common humidity myths, and how to avoid heat and cold stress.",
    category: "climate",
    categoryLabel: CATEGORY_LABELS.climate,
    readingTime: "6 min read",
    keywords: [
      "temperature",
      "humidity",
      "cold stress",
      "heat stress",
      "humidifier",
      "air circulation",
    ],
    sections: [
      {
        id: "temperature-ranges",
        heading: "Comfortable temperature ranges",
        paragraphs: [
          "Most common houseplants, which originate from tropical or subtropical regions, are comfortable in roughly the same range people are \u2014 about 65-80\u00b0F (18-27\u00b0C) during the day, with a slightly cooler night acceptable. Sudden swings are usually more stressful than a stable temperature at the edge of that range.",
          "Cold drafts from a winter window or an air conditioning vent, and hot drafts from a heating vent or a sunny windowsill in summer, can stress plants even when the general room temperature seems fine.",
        ],
        bulletsTitle: "Common trouble spots",
        bullets: [
          "Windowsills in winter \u2014 can be 10-20\u00b0F colder right at the glass",
          "Air conditioning or heating vents pointed directly at foliage",
          "Exterior doors that open frequently in cold or hot weather",
          "Unheated porches, garages, or sunrooms in shoulder seasons",
        ],
      },
      {
        id: "cold-and-heat-stress",
        heading: "Cold stress and heat stress",
        paragraphs: [
          "Cold stress in tropical houseplants can show up as dark, water-soaked-looking patches, drooping, or leaf drop, sometimes appearing a day or two after the cold exposure rather than immediately. Some plants, like certain succulents from temperate climates, tolerate cold much better than tropical foliage plants.",
          "Heat stress often looks like wilting even when the soil is moist, since the plant is losing water through its leaves faster than the roots can replace it. Crispy leaf edges combined with high heat exposure (rather than dry soil) point toward heat stress rather than underwatering.",
        ],
        bulletsTitle: "Signs to watch for",
        bullets: [
          "Cold stress: dark or water-soaked patches, sudden leaf drop, mushy stems in severe cases",
          "Heat stress: wilting despite moist soil, scorched patches on the side facing a heat source",
          "Both can look similar to watering issues \u2014 check the plant's recent environment, not just the soil",
        ],
      },
      {
        id: "humidity-basics-and-myths",
        heading: "Humidity basics and myths",
        paragraphs: [
          "Humidity refers to how much moisture is in the air, and many popular houseplants (aroids, ferns, calatheas) come from humid tropical environments where indoor air, especially in winter with heating running, tends to be much drier. Low humidity can contribute to crispy leaf edges and slower growth in humidity-loving species.",
          "A commonly repeated myth is that misting leaves meaningfully raises humidity \u2014 in practice, misting raises humidity for only a few minutes and doesn't have a lasting effect. Grouping plants together, using a humidifier, or a pebble tray with water below (not touching) the pot base are generally more effective.",
        ],
        bulletsTitle: "More reliable ways to raise humidity",
        bullets: [
          "A humidifier in the room, especially in dry winter months",
          "Grouping plants together to create a shared moisture zone",
          "A pebble tray with water level kept below the pot base",
          "Avoiding placement right next to heating vents or drafty windows",
        ],
      },
      {
        id: "air-circulation",
        heading: "Air circulation and fungal problems",
        paragraphs: [
          "High humidity without airflow can encourage fungal issues like powdery mildew or leaf spot, especially if leaves stay damp for long periods. A small fan on low, or simply avoiding overcrowding plants, helps leaves dry between waterings and reduces fungal risk.",
          "The goal isn't maximum humidity everywhere \u2014 it's matching humidity-loving plants with humid, well-ventilated spots, rather than assuming more humidity is always better for every species.",
        ],
        bulletsTitle: "Quick reference",
        bullets: [
          "Watch for temperature swings near windows, vents, and doors",
          "Tropical foliage plants generally want higher humidity than succulents or cacti",
          "Misting alone won't meaningfully raise humidity",
          "Pair higher humidity with some air movement to avoid fungal problems",
        ],
      },
    ],
    relatedSlugs: ["common-diseases", "brown-leaf-tips", "indoor-plant-types"],
  },

  {
    slug: "repotting",
    title: "Repotting Houseplants",
    description:
      "How to tell a plant needs a new pot, how to choose the right size, and how to repot without causing shock.",
    category: "repotting",
    categoryLabel: CATEGORY_LABELS.repotting,
    readingTime: "7 min read",
    keywords: ["repotting", "root bound", "pot size", "transplant shock", "container"],
    sections: [
      {
        id: "when-to-repot",
        heading: "When to repot",
        paragraphs: [
          "Plants generally need repotting every one to two years, but the better signal is the plant itself rather than a fixed timeline. Roots growing out of the drainage holes, soil that dries out unusually fast, or a plant that's clearly outgrown its pot visually are all signs it's time.",
          "It's best to repot during active growth (typically spring or early summer) when the plant can recover quickly, rather than during dormancy in winter.",
        ],
        bulletsTitle: "Signs it's time to repot",
        bullets: [
          "Roots visible circling the surface or growing out of drainage holes",
          "Water runs straight through without being absorbed",
          "The plant dries out much faster than it used to",
          "Growth has stalled despite otherwise good care",
          "The pot feels tight or the plant is top-heavy and tips over easily",
        ],
      },
      {
        id: "root-bound-and-pot-choice",
        heading: "Root-bound plants and choosing a pot",
        paragraphs: [
          "A root-bound plant has roots that have filled the pot and started circling around its edges, sometimes forming a dense mat. Left too long, this restricts water and nutrient uptake even if the potting mix itself is fine.",
          "When sizing up, choose a pot roughly one to two inches larger in diameter than the current one, not a dramatically bigger pot. An oversized pot holds more soil than the roots can use, which stays wet longer and raises the risk of root rot.",
        ],
        bulletsTitle: "Choosing a pot",
        bullets: [
          "Go up one to two inches in diameter, not a dramatic jump",
          "Make sure it has a drainage hole",
          "Terracotta dries faster than plastic or glazed ceramic \u2014 useful for plants prone to overwatering",
          "Match new soil type to the plant, not just the old pot's leftover mix",
        ],
      },
      {
        id: "repotting-steps",
        heading: "Repotting steps",
        paragraphs: [
          "Water the plant a day or two before repotting \u2014 slightly moist soil holds together and slides out of the pot more easily than bone-dry soil.",
          "Gently loosen the root ball, teasing apart any tightly circling roots so they're encouraged to grow outward into the new soil rather than continuing to circle.",
        ],
        bulletsTitle: "Step by step",
        bullets: [
          "Water the plant a day or two beforehand",
          "Gently remove the plant, tipping the pot rather than pulling on the stem",
          "Loosen circling roots and trim any that are clearly dead, mushy, or rotten",
          "Add fresh mix to the bottom of the new pot, center the plant, and fill in around the sides",
          "Water thoroughly after repotting to help the soil settle around the roots",
        ],
      },
      {
        id: "aftercare-and-shock",
        heading: "Repotting shock and aftercare",
        paragraphs: [
          "Some drooping or minor leaf loss after repotting is normal and usually temporary \u2014 the plant is adjusting to disturbed roots. This is different from ongoing decline, which suggests a problem with the repot itself, like damaged roots or a mix that's too dense.",
          "Keep the plant out of direct sun and hold off on fertilizing for several weeks after repotting, giving the roots time to settle into the new soil before asking them to take up extra nutrients.",
        ],
        bulletsTitle: "Aftercare quick reference",
        bullets: [
          "Keep out of direct sun for a week or two",
          "Hold off on fertilizer for 3-4 weeks",
          "Some temporary drooping is normal; ongoing decline is not",
          "Resume normal watering checks rather than watering on a fixed schedule",
        ],
      },
    ],
    relatedSlugs: ["soil-and-drainage", "propagation", "drooping-leaves"],
  },

  {
    slug: "pruning",
    title: "Pruning and Routine Maintenance",
    description:
      "Why and when to prune, how to make clean cuts, and simple upkeep that keeps plants healthy.",
    category: "pruning",
    categoryLabel: CATEGORY_LABELS.pruning,
    readingTime: "5 min read",
    keywords: ["pruning", "deadheading", "sterilizing tools", "cleaning leaves", "staking"],
    sections: [
      {
        id: "why-prune",
        heading: "Why prune",
        paragraphs: [
          "Pruning removes damaged, dead, or overgrown growth, which redirects the plant's energy toward healthier parts and can encourage fuller, bushier growth. It's also a basic hygiene step \u2014 removing dead or dying tissue reduces the chance of pests or fungal issues taking hold.",
          "Pruning is generally most effective during active growth in spring and summer, when the plant can recover and push new growth quickly. Light maintenance pruning (removing a clearly dead leaf) can happen any time.",
        ],
        bulletsTitle: "Common reasons to prune",
        bullets: [
          "Remove dead, yellowing, or damaged leaves",
          "Control size or shape",
          "Encourage bushier, fuller growth by cutting back leggy stems",
          "Remove spent flowers (deadheading) to redirect energy",
          "Remove diseased or pest-affected growth to slow spread",
        ],
      },
      {
        id: "how-to-cut",
        heading: "Where and how to cut",
        paragraphs: [
          "Cut just above a node (the point where a leaf or stem attaches) using clean, sharp scissors or pruning shears. Cutting above a node, rather than mid-stem, encourages new growth from that point rather than leaving a dead stub.",
          "Sterilizing tools between plants, especially if a plant has shown any sign of disease, helps avoid spreading pathogens. A quick wipe with rubbing alcohol between cuts is usually enough.",
        ],
        bulletsTitle: "Good pruning habits",
        bullets: [
          "Cut just above a node with clean, sharp tools",
          "Sterilize blades between plants, especially if disease is suspected",
          "Remove no more than about a third of the plant at once to avoid excess stress",
          "Cut at an angle for stems, to help shed water and reduce rot risk on the cut",
        ],
      },
      {
        id: "routine-maintenance",
        heading: "Routine maintenance beyond pruning",
        paragraphs: [
          "Dust on leaves blocks light and can slow photosynthesis over time, so wiping large leaves with a damp cloth every few weeks is a simple way to support the plant, especially indoors where leaves don't get rinsed by rain.",
          "Climbing or vining plants often benefit from a support \u2014 a moss pole, trellis, or stake \u2014 both to encourage larger, more mature leaf growth (in some aroids) and to keep the plant looking tidy rather than sprawling.",
        ],
        bulletsTitle: "Simple upkeep habits",
        bullets: [
          "Wipe dust off broad leaves every few weeks",
          "Rotate the pot occasionally for even growth",
          "Stake or support vining and top-heavy plants as they grow",
          "Remove yellowing or dead leaves promptly rather than letting them sit",
        ],
      },
    ],
    relatedSlugs: ["propagation", "indoor-plant-types", "common-diseases"],
  },

  {
    slug: "propagation",
    title: "Propagating Houseplants",
    description:
      "How to grow new plants from cuttings, division, or seed, and why some cuttings fail to root.",
    category: "propagation",
    categoryLabel: CATEGORY_LABELS.propagation,
    readingTime: "7 min read",
    keywords: ["propagation", "cuttings", "water propagation", "division", "rooting"],
    sections: [
      {
        id: "propagation-methods",
        heading: "Common propagation methods",
        paragraphs: [
          "Stem cuttings \u2014 a section of stem with at least one node, often with a leaf attached \u2014 are the most common method for vining and many upright houseplants, since the node contains the tissue that can grow new roots. Leaf cuttings work for a smaller group of plants, notably succulents and some begonias, where a single leaf can regenerate an entire new plant.",
          "Division involves splitting an established plant with multiple crowns or offsets (like many ferns, snake plants, or peace lilies) into separate plants, each with its own roots. Seed propagation is slower and less predictable for many houseplant species, but is standard for herbs and vegetables.",
        ],
        bulletsTitle: "Which method fits which plant",
        bullets: [
          "Stem cuttings: pothos, philodendron, monstera, tradescantia, and most vining plants",
          "Leaf cuttings: succulents, some begonias, some peperomias",
          "Division: snake plants, peace lilies, ferns, many clumping plants",
          "Seed: herbs, vegetables, and many flowering annuals",
        ],
      },
      {
        id: "water-vs-soil",
        heading: "Water propagation vs. soil propagation",
        paragraphs: [
          "Water propagation lets you watch roots develop, which is satisfying and makes it easy to tell when a cutting has rooted, but water-grown roots are somewhat different in structure from soil-grown roots and need a gradual transition when finally potted in soil.",
          "Soil propagation skips that transition but makes it harder to check progress without disturbing the cutting. Some growers use a light, well-draining mix and simply give a gentle tug after a few weeks to feel for resistance, which suggests roots have formed.",
        ],
        bulletsTitle: "Basic setup either way",
        bullets: [
          "Use a clean, sharp tool to take the cutting just below a node",
          "Remove lower leaves that would sit in water or soil",
          "Bright, indirect light \u2014 not direct sun, which stresses a cutting with no roots yet",
          "Keep water fresh (change every few days) or soil lightly moist, not soggy",
        ],
      },
      {
        id: "rooting-problems",
        heading: "Common rooting problems",
        paragraphs: [
          "Cuttings that rot before rooting are often sitting in too much water or too-wet soil without enough air exchange \u2014 changing water regularly or using a well-draining mix helps. Cuttings that simply sit without rooting for a long time may lack a node, be getting too little light, or may just need more time, since some species root much more slowly than others.",
          "Not every cutting will succeed, even with good technique \u2014 some species are simply harder to propagate than others, and a percentage of cuttings failing is normal rather than a sign of doing something fundamentally wrong.",
        ],
        bulletsTitle: "Troubleshooting checklist",
        bullets: [
          "Confirm the cutting includes at least one node",
          "Check that it's not sitting in direct sun while rootless",
          "Watch for mushy, rotting stem tissue \u2014 remove and try a fresh cutting if this happens",
          "Be patient \u2014 some species take many weeks to show roots",
        ],
      },
      {
        id: "aftercare",
        heading: "Propagation aftercare",
        paragraphs: [
          "Once roots are a couple of inches long, a cutting is usually ready to pot up in soil (or to stay in soil if that's how it was propagated). Keep the new plant out of direct sun for a week or two and hold off on fertilizer until it shows signs of active new growth.",
          "Newly potted cuttings benefit from the same gentle, gradual approach as a freshly repotted plant \u2014 stable conditions and patience matter more than intervention.",
        ],
        bulletsTitle: "Quick reference",
        bullets: [
          "Pot up once roots are a couple of inches long",
          "Use a light, well-draining mix",
          "Avoid direct sun and fertilizer for the first couple of weeks",
          "Expect some adjustment time \u2014 minor drooping is normal",
        ],
      },
    ],
    relatedSlugs: ["repotting", "pruning", "soil-and-drainage"],
  },

  {
    slug: "common-pests",
    title: "Common Houseplant Pests",
    description:
      "How to recognize aphids, mealybugs, spider mites, fungus gnats, scale, and thrips, and cautious steps for treatment.",
    category: "pests",
    categoryLabel: CATEGORY_LABELS.pests,
    readingTime: "8 min read",
    keywords: [
      "pests",
      "aphids",
      "mealybugs",
      "spider mites",
      "fungus gnats",
      "scale",
      "thrips",
    ],
    sections: [
      {
        id: "identification",
        heading: "Identifying common pests",
        paragraphs: [
          "Most houseplant pest problems fall into a handful of common categories, and correctly identifying which one you're dealing with matters, since treatment approaches differ. A magnifying glass or your phone camera's zoom can help spot small pests on the undersides of leaves and along stems, which is where many hide.",
          "Catching an infestation early, before it spreads to other plants, makes treatment much easier \u2014 so it's worth periodically checking new plants and generally inspecting leaves (especially undersides) during routine watering.",
        ],
        bulletsTitle: "What to look for, by pest",
        bullets: [
          "Aphids: small, pear-shaped insects, often green or black, clustered on new growth and buds",
          "Mealybugs: white, cottony clusters, often in leaf joints and along stems",
          "Spider mites: tiny specks, fine webbing, stippled or speckled leaves \u2014 a magnifying glass helps confirm",
          "Scale: small, brown or tan bumps that look like part of the stem, don't move",
          "Fungus gnats: small flies hovering near soil, larvae live in the top layer of soil",
          "Thrips: tiny, slender insects; leaves show silvery streaks or dark speckling",
        ],
      },
      {
        id: "isolation-and-inspection",
        heading: "Isolation and inspection",
        paragraphs: [
          "If you spot a pest problem, isolating the affected plant away from others reduces the chance of it spreading, since many houseplant pests move readily between nearby plants, especially if leaves are touching.",
          "It's worth checking neighboring plants closely too, since an infestation is often caught on one plant after it's already started on others nearby.",
        ],
        bulletsTitle: "First steps",
        bullets: [
          "Move the affected plant away from others",
          "Inspect the undersides of leaves and stem joints closely",
          "Check nearby plants for early signs",
          "Remove heavily infested leaves if only a few are affected",
        ],
      },
      {
        id: "treatment-approaches",
        heading: "General treatment approaches",
        paragraphs: [
          "For light infestations, physically removing pests \u2014 wiping leaves with a damp cloth, rinsing the plant in the shower, or dabbing mealybugs and scale with a cotton swab dipped in rubbing alcohol \u2014 can be enough on its own or as a first step before other treatment.",
          "Insecticidal soap or horticultural neem oil are commonly used, relatively low-risk options for many houseplant pests, but always follow the product label for dilution, application, and safety precautions, and check that a specific product is appropriate for the plant you're treating, since sensitivity varies by species. Local regulations on pesticide use can also vary, so check what applies in your area for anything beyond basic soap or neem treatments.",
        ],
        bulletsTitle: "General approach",
        bullets: [
          "Start with physical removal for light infestations",
          "Insecticidal soap or neem oil are common next steps \u2014 always follow label instructions",
          "Repeat treatment as directed, since a single application often doesn't catch every life stage",
          "Isolate treated plants until you've confirmed the pests are gone",
          "For fungus gnats specifically, letting the soil surface dry out more between waterings disrupts their breeding cycle",
        ],
      },
      {
        id: "prevention",
        heading: "Prevention",
        paragraphs: [
          "Most infestations arrive on a new plant, so inspecting new arrivals closely \u2014 and optionally keeping them separate from your existing collection for a week or two \u2014 reduces the risk of introducing pests to your whole collection.",
          "Generally healthy plants (appropriate light, water, and not chronically stressed) also tend to be somewhat more resistant to pest pressure than stressed ones, though no amount of good care makes a plant completely immune.",
        ],
        bulletsTitle: "Prevention habits",
        bullets: [
          "Inspect new plants before placing them near others",
          "Consider a short quarantine period for new arrivals",
          "Check plants periodically, not just when something looks wrong",
          "Avoid overwatering, which attracts fungus gnats specifically",
        ],
      },
    ],
    relatedSlugs: ["common-diseases", "yellow-leaves", "watering"],
  },

  {
    slug: "common-diseases",
    title: "Common Plant Diseases and Problems",
    description: "Recognizing root rot, powdery mildew, and leaf spot, and what tends to cause them.",
    category: "diseases",
    categoryLabel: CATEGORY_LABELS.diseases,
    readingTime: "7 min read",
    keywords: ["root rot", "powdery mildew", "leaf spot", "fungal disease", "plant disease"],
    sections: [
      {
        id: "root-rot",
        heading: "Root rot",
        paragraphs: [
          "Root rot develops when roots sit in overly wet, poorly draining soil for extended periods, cutting off their oxygen supply and allowing rot-causing fungi or bacteria to take hold. It's one of the most common causes of houseplant decline and death.",
          "Above the soil, root rot often looks confusingly similar to underwatering \u2014 wilting, yellowing, and stunted growth \u2014 because damaged roots can't take up water properly regardless of how much is in the soil.",
        ],
        bulletsTitle: "Signs and response",
        bullets: [
          "Signs: wilting despite moist soil, yellowing leaves, mushy or blackened roots if you check, a sour smell from the soil",
          "Response: unpot and inspect roots \u2014 trim away mushy, dark roots with clean tools",
          "Repot into fresh, well-draining mix and a pot with drainage",
          "Reduce watering frequency going forward and let soil dry appropriately between waterings",
        ],
      },
      {
        id: "powdery-mildew",
        heading: "Powdery mildew",
        paragraphs: [
          "Powdery mildew appears as a white or gray powdery coating on leaves and stems, caused by fungal spores that thrive in conditions with high humidity but poor air circulation, especially when leaves stay damp.",
          "It rarely kills a plant outright but can weaken it over time and spread to nearby plants, so addressing airflow and removing affected leaves early helps contain it.",
        ],
        bulletsTitle: "Signs and response",
        bullets: [
          "Signs: white or grayish powdery patches, often starting on older or lower leaves",
          "Response: improve air circulation around the plant",
          "Remove and dispose of affected leaves rather than composting them nearby",
          "Avoid overhead watering that leaves foliage wet for long periods",
        ],
      },
      {
        id: "leaf-spot",
        heading: "Leaf spot",
        paragraphs: [
          "Leaf spot is a general term for fungal or bacterial infections that cause discolored, often circular spots on leaves, sometimes with a yellow halo or a dark border. It's frequently linked to water sitting on leaves, overcrowded plants with poor airflow, or previously damaged tissue.",
          "Most leaf spot issues are manageable by improving conditions and removing affected leaves, rather than requiring aggressive chemical treatment.",
        ],
        bulletsTitle: "Signs and response",
        bullets: [
          "Signs: brown, black, or tan spots, sometimes with a yellow ring around them",
          "Response: remove affected leaves promptly",
          "Avoid wetting leaves when watering; water at the soil level instead",
          "Space plants out to improve airflow",
        ],
      },
      {
        id: "general-prevention",
        heading: "General disease prevention",
        paragraphs: [
          "Most common houseplant diseases trace back to a handful of conditions: soil that stays too wet, poor air circulation, or water sitting on leaves for long periods. Addressing those fundamentals prevents more problems than reacting to disease after it appears.",
          "If a disease issue is severe, spreading rapidly, or not responding to basic care adjustments, it may be worth consulting a local extension office or plant specialist, since accurate diagnosis sometimes requires lab testing beyond what's visible to the eye.",
        ],
        bulletsTitle: "Quick reference",
        bullets: [
          "Water at the soil level, not overhead, when possible",
          "Ensure pots have drainage and avoid letting soil stay saturated",
          "Give plants enough space and airflow",
          "Remove affected foliage promptly rather than letting it linger",
        ],
      },
    ],
    relatedSlugs: ["soil-and-drainage", "temperature-and-humidity", "common-pests"],
  },

  {
    slug: "yellow-leaves",
    title: "Why Are My Plant's Leaves Turning Yellow?",
    description:
      "A symptom-based look at the most common causes of yellowing leaves, from watering to light to age.",
    category: "troubleshooting",
    categoryLabel: CATEGORY_LABELS.troubleshooting,
    readingTime: "6 min read",
    keywords: ["yellow leaves", "yellowing", "chlorosis", "leaf discoloration"],
    sections: [
      {
        id: "why-multiple-causes",
        heading: "Why yellow leaves can have several causes",
        paragraphs: [
          "Yellowing is one of the most common plant symptoms, and unfortunately one of the least specific \u2014 overwatering, underwatering, too little light, nutrient deficiency, natural aging, and even pests can all cause it. The pattern of yellowing and the plant's recent conditions matter more than the color alone.",
          "Because of that overlap, it's worth thinking through the plant's recent watering, light, and any recent changes (new location, repotting, temperature swings) rather than assuming a single default cause.",
        ],
        bulletsTitle: "Questions to ask first",
        bullets: [
          "Is it one old, lower leaf, or several leaves at once?",
          "Has your watering routine changed recently?",
          "Has the plant moved to a different light level?",
          "Is the soil staying wet for a long time, or drying out very fast?",
          "Any pests visible on close inspection?",
        ],
      },
      {
        id: "common-patterns",
        heading: "Common patterns and likely causes",
        paragraphs: [
          "A single older, lower leaf turning yellow and dropping is frequently just natural leaf aging \u2014 plants regularly shed their oldest leaves as they grow new ones, and this isn't usually a cause for concern on its own.",
          "Multiple yellowing leaves, especially if they feel soft rather than crispy, often points toward overwatering or poor drainage. Yellowing paired with dry, crispy patches more often suggests too little water or too much direct light.",
        ],
        bulletsTitle: "Pattern guide (general, not diagnostic)",
        bullets: [
          "One old lower leaf, otherwise healthy plant: likely natural aging",
          "Several soft, yellowing leaves + consistently wet soil: check for overwatering or root rot",
          "Yellowing + crispy/dry: check watering frequency and light exposure",
          "Yellowing between veins on new leaves, veins stay green: possible nutrient deficiency",
          "Yellowing with visible pests: treat the pest issue first",
        ],
      },
      {
        id: "what-to-check",
        heading: "What to check and adjust",
        paragraphs: [
          "Start by checking the soil moisture with a finger test, and think back on your watering pattern over the past couple of weeks rather than just the current moment. Then consider the plant's light exposure and whether it's changed recently.",
          "If several checks point toward overwatering, it may be worth unpotting to inspect the roots, since catching root rot early significantly improves the chances of recovery.",
        ],
        bulletsTitle: "Steps to take",
        bullets: [
          "Check current soil moisture and recent watering pattern",
          "Assess light level and any recent changes to the plant's location",
          "Inspect closely for pests, especially on leaf undersides",
          "If overwatering is suspected, check roots and adjust going forward",
          "Trim off leaves that are already fully yellow \u2014 they won't turn green again",
        ],
      },
    ],
    relatedSlugs: ["watering", "lighting", "fertilizing"],
  },

  {
    slug: "brown-leaf-tips",
    title: "Why Are My Plant's Leaf Tips Turning Brown?",
    description:
      "Common causes of crispy, browning leaf tips and edges, including humidity, water quality, and fertilizer.",
    category: "troubleshooting",
    categoryLabel: CATEGORY_LABELS.troubleshooting,
    readingTime: "5 min read",
    keywords: ["brown tips", "crispy leaves", "leaf edges", "low humidity"],
    sections: [
      {
        id: "common-causes",
        heading: "Common causes of brown tips",
        paragraphs: [
          "Brown, crispy leaf tips or edges are frequently linked to low humidity, inconsistent watering, or a buildup of mineral salts in the soil from fertilizer or tap water. Plants with naturally thin or delicate leaves \u2014 like many calatheas, ferns, and spider plants \u2014 tend to show this symptom more readily than thicker-leaved species.",
          "Because several unrelated issues can look similar, it helps to consider your environment and routine as a whole (humidity, watering consistency, fertilizer use, water source) rather than assuming a single fix will solve it.",
        ],
        bulletsTitle: "Frequent contributors",
        bullets: [
          "Low humidity, especially in winter with heating running",
          "Inconsistent watering \u2014 alternating between very dry and very wet",
          "Fertilizer salt buildup from regular feeding without occasional flushing",
          "Tap water with high mineral content or fluoride, for sensitive species",
          "Direct sun exposure on plants that prefer indirect light",
        ],
      },
      {
        id: "narrowing-it-down",
        heading: "Narrowing down the cause",
        paragraphs: [
          "If brown tips appear mainly in winter or in a dry room, low humidity is a likely contributor. If they appear alongside a visible white crust on the soil surface or after a period of regular fertilizing, salt buildup is worth considering.",
          "If the plant is sensitive to water quality (calatheas and some other tropicals are commonly cited as more sensitive), switching to filtered or distilled water, or letting tap water sit out for 24 hours before use, sometimes helps \u2014 though this varies by plant and by local water quality.",
        ],
        bulletsTitle: "Quick diagnostic checklist",
        bullets: [
          "Dry room, winter, or near a heating vent: consider humidity",
          "White crust on soil, regular fertilizing: consider a soil flush",
          "Sensitive species + hard tap water: consider filtered or rested water",
          "Bright direct light on an indirect-light plant: consider relocating",
        ],
      },
      {
        id: "what-to-do",
        heading: "What to do",
        paragraphs: [
          "Brown tips that have already formed won't turn green again, but trimming them (following the natural leaf shape with clean scissors) improves appearance without harming the plant, since you're only removing already-dead tissue.",
          "Addressing the underlying cause \u2014 raising humidity, watering more consistently, flushing soil with plain water every few months, or adjusting fertilizer frequency \u2014 helps prevent new tips from browning, even though it won't fix leaves that are already affected.",
        ],
        bulletsTitle: "Practical steps",
        bullets: [
          "Trim dead tips with clean scissors, following the leaf's natural shape",
          "Raise humidity with a humidifier or grouping plants together",
          "Flush soil with plain water occasionally to clear excess salts",
          "Water consistently rather than letting the plant swing between very dry and very wet",
        ],
      },
    ],
    relatedSlugs: ["temperature-and-humidity", "fertilizing", "watering"],
  },

  {
    slug: "drooping-leaves",
    title: "Why Is My Plant Drooping?",
    description:
      "Working through the most common reasons a plant's leaves or stems droop, from watering to temperature to transplant shock.",
    category: "troubleshooting",
    categoryLabel: CATEGORY_LABELS.troubleshooting,
    readingTime: "6 min read",
    keywords: ["drooping", "wilting", "limp leaves", "transplant shock"],
    sections: [
      {
        id: "drooping-basics",
        heading: "What drooping usually means",
        paragraphs: [
          "Drooping is generally a sign that leaves or stems aren't getting enough water pressure (turgor) to stay firm \u2014 but the underlying reason can be too little water in the soil, roots that are damaged and can't take up water even though it's available, or heat stress pulling water out faster than roots can replace it.",
          "Some plants, like peace lilies, are known for dramatic drooping when thirsty that resolves quickly after watering \u2014 this is a fairly reliable signal for those species, but not a universal rule for all plants.",
        ],
        bulletsTitle: "Broad categories to consider",
        bullets: [
          "Underwatering \u2014 soil is dry, drooping improves after a thorough watering",
          "Overwatering / root rot \u2014 soil is wet, drooping doesn't improve or worsens after watering",
          "Heat or cold stress \u2014 recent temperature exposure lines up with the drooping",
          "Transplant or repotting shock \u2014 drooping began shortly after being moved or repotted",
          "Root-bound plant \u2014 roots have outgrown the pot and can't take up enough water",
        ],
      },
      {
        id: "watering-related-drooping",
        heading: "Watering-related drooping",
        paragraphs: [
          "If the soil is dry and the plant perks back up within a few hours of a thorough watering, underwatering is the likely cause. If the soil is wet or has been consistently moist and the plant still droops \u2014 especially with yellowing or a sour smell \u2014 overwatering or root rot is more likely.",
          "A plant that's been both underwatered and overwatered in cycles can also show chronic stress and drooping, since inconsistent watering damages roots over time even without a single dramatic event.",
        ],
        bulletsTitle: "Quick test",
        bullets: [
          "Check soil moisture first",
          "Dry soil + recovery after watering: underwatering",
          "Wet soil + no recovery, possible odor: check roots for rot",
          "Repeated cycles of very dry and very wet: consider a more consistent routine",
        ],
      },
      {
        id: "non-watering-causes",
        heading: "Non-watering causes",
        paragraphs: [
          "If watering seems fine but drooping persists, consider recent changes: a move to a hotter or colder spot, a repot within the last couple of weeks, or a plant that's become root-bound over time. Sudden environmental changes are a common and often overlooked cause.",
          "Drooping shortly after repotting is usually temporary transplant shock and improves within a week or two as roots settle in, as long as the plant isn't also showing signs of a deeper problem like rot.",
        ],
        bulletsTitle: "Other causes to rule out",
        bullets: [
          "Recent move to a hotter, colder, or draftier spot",
          "Recent repotting \u2014 some drooping is a normal, temporary adjustment",
          "Root-bound plant that needs a larger pot",
          "Pest damage to roots or stems (check closely)",
        ],
      },
    ],
    relatedSlugs: ["watering", "repotting", "temperature-and-humidity"],
  },

  {
    slug: "slow-growth",
    title: "Why Has My Plant Stopped Growing?",
    description: "Common reasons for slow or stalled growth, including light, season, nutrients, and pot size.",
    category: "troubleshooting",
    categoryLabel: CATEGORY_LABELS.troubleshooting,
    readingTime: "5 min read",
    keywords: ["slow growth", "stunted growth", "not growing", "dormancy"],
    sections: [
      {
        id: "is-it-actually-a-problem",
        heading: "Is slow growth actually a problem?",
        paragraphs: [
          "Many houseplants naturally slow down or stop growing during fall and winter, when day length and light intensity drop, regardless of how good their care is. This dormant or semi-dormant period is normal, not a sign that something is wrong, and growth typically resumes in spring.",
          "It's worth checking the calendar and comparing to the plant's typical growing season before assuming slow growth reflects a care issue.",
        ],
        bulletsTitle: "Before troubleshooting, consider",
        bullets: [
          "Is it currently the plant's dormant season (often fall/winter)?",
          "Has the plant grown normally in past growing seasons?",
          "Is the plant otherwise healthy \u2014 no yellowing, drooping, or pests?",
        ],
      },
      {
        id: "common-causes",
        heading: "Common causes of stalled growth during the growing season",
        paragraphs: [
          "If a plant isn't growing during its normal active season, insufficient light is one of the most common culprits, since low light directly limits how much energy a plant has available for new growth. A root-bound plant that's outgrown its pot can also stall, since there's no room for new root growth to support new leaves.",
          "Nutrient deficiency (soil that hasn't been fertilized in a long time) and chronic underwatering or overwatering can also slow growth, generally alongside other symptoms like discoloration.",
        ],
        bulletsTitle: "Likely causes and what they look like",
        bullets: [
          "Low light: leggy or minimal new growth, plant leaning toward light",
          "Root-bound: roots visible at drainage holes or circling the surface",
          "Nutrient deficiency: pale or yellowing leaves alongside slow growth",
          "Watering issues: growth issues alongside overwatering or underwatering symptoms",
          "Temperature too low: growth generally stalls below the plant's comfortable range",
        ],
      },
      {
        id: "what-to-adjust",
        heading: "What to adjust",
        paragraphs: [
          "If it's the growing season and light seems adequate, check whether the plant is root-bound and consider repotting. If light seems low for what the plant needs, consider moving it closer to a window or supplementing with a grow light.",
          "If the plant hasn't been fertilized in a long time and is otherwise healthy, a balanced fertilizer during the growing season can help \u2014 but fertilizer won't fix a fundamentally low-light or root-bound situation on its own.",
        ],
        bulletsTitle: "Practical steps",
        bullets: [
          "Confirm it's the active growing season for that plant",
          "Check for root-bound conditions and repot if needed",
          "Reassess light level against what the species generally needs",
          "Resume or start a regular fertilizing routine during the growing season",
          "Rule out watering issues as a contributing factor",
        ],
      },
    ],
    relatedSlugs: ["lighting", "repotting", "fertilizing"],
  },

  {
    slug: "indoor-plant-types",
    title: "A Guide to Indoor Plant Types",
    description:
      "General care differences between succulents, tropical foliage plants, ferns, flowering houseplants, and herbs.",
    category: "plant-types",
    categoryLabel: CATEGORY_LABELS["plant-types"],
    readingTime: "8 min read",
    keywords: ["plant types", "succulents", "tropical plants", "ferns", "herbs", "flowering houseplants"],
    sections: [
      {
        id: "why-type-matters",
        heading: "Why plant type matters for care",
        paragraphs: [
          "Houseplants come from a wide range of native environments \u2014 desert, tropical rainforest understory, temperate woodland \u2014 and their care needs generally reflect where they evolved. Grouping plants by broad type is a useful starting point, though individual species within a type can still vary.",
          "The guides on watering, lighting, and soil elsewhere in this library go into the general principles; this guide focuses on how those principles tend to differ by plant category.",
        ],
        bulletsTitle: "Broad categories covered here",
        bullets: [
          "Succulents and cacti",
          "Tropical foliage plants (aroids, calatheas, etc.)",
          "Ferns",
          "Flowering houseplants",
          "Herbs",
        ],
      },
      {
        id: "succulents-and-cacti",
        heading: "Succulents and cacti",
        paragraphs: [
          "Succulents and cacti store water in their leaves or stems and are adapted to infrequent rainfall, so they generally want bright, direct light and soil that dries out substantially between waterings. Overwatering is the most common way these plants run into trouble indoors.",
          "A fast-draining mix (potting soil with extra sand or perlite) and a pot with drainage are especially important for this group, since their thick, water-storing tissue is particularly vulnerable to rot in soggy soil.",
        ],
        bulletsTitle: "General care notes",
        bullets: [
          "Bright, direct light for most species",
          "Let soil dry out well between waterings",
          "Fast-draining, gritty soil mix",
          "Reduce watering further in winter dormancy",
        ],
      },
      {
        id: "tropical-foliage-and-ferns",
        heading: "Tropical foliage plants and ferns",
        paragraphs: [
          "Tropical foliage plants like pothos, philodendron, and monstera generally want bright indirect light, soil that's allowed to partially dry between waterings, and moderate to high humidity. Many are quite tolerant of a range of conditions, which is part of why they're popular beginner plants.",
          "Ferns tend to be less forgiving \u2014 many prefer consistently moist (not soggy) soil and higher humidity than the average room offers, and they can show crispy fronds relatively quickly if humidity drops or the soil dries out fully.",
        ],
        bulletsTitle: "General care notes",
        bullets: [
          "Tropical foliage: bright indirect light, water when top inch or two is dry, moderate humidity",
          "Ferns: consistent moisture, higher humidity, indirect light, avoid letting soil fully dry out",
          "Both groups generally dislike cold drafts and sudden temperature swings",
        ],
      },
      {
        id: "flowering-plants-and-herbs",
        heading: "Flowering houseplants and herbs",
        paragraphs: [
          "Flowering houseplants (like African violets, orchids, or peace lilies) often have more specific requirements around light and watering to bloom reliably, and may benefit from a fertilizer formulated for flowering during their bloom season.",
          "Herbs grown indoors, like basil or mint, generally want as much direct light as you can give them \u2014 often more than a typical indoor windowsill provides \u2014 which is why many struggle indoors without a grow light, especially in winter.",
        ],
        bulletsTitle: "General care notes",
        bullets: [
          "Flowering plants: check species-specific light and fertilizer needs to encourage blooming",
          "Herbs: as much direct light as possible; consider a grow light for consistent indoor growing",
          "Both groups often benefit from more attentive care than low-maintenance foliage plants",
        ],
      },
    ],
    relatedSlugs: ["lighting", "watering", "fertilizing"],
  },
];

// ---------------------------------------------------------------------------
// Lookup / search helpers
// ---------------------------------------------------------------------------

export function getAllGuides(): PlantGuide[] {
  return PLANT_GUIDES;
}

export function getAllGuideSlugs(): string[] {
  return PLANT_GUIDES.map((guide) => guide.slug);
}

export function getGuideBySlug(slug: string): PlantGuide | undefined {
  return PLANT_GUIDES.find((guide) => guide.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): PlantGuide[] {
  return PLANT_GUIDES.filter((guide) => guide.category === category);
}

/** Resolves a guide's relatedSlugs into full PlantGuide objects, dropping any that don't exist. */
export function getRelatedGuides(guide: PlantGuide): PlantGuide[] {
  return guide.relatedSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is PlantGuide => Boolean(g));
}

/** Client-side substring search over title, description, category label, and keywords. */
export function searchGuides(guides: PlantGuide[], query: string): PlantGuide[] {
  const q = query.trim().toLowerCase();
  if (!q) return guides;
  return guides.filter((guide) => {
    return (
      guide.title.toLowerCase().includes(q) ||
      guide.description.toLowerCase().includes(q) ||
      guide.categoryLabel.toLowerCase().includes(q) ||
      guide.keywords.some((keyword) => keyword.toLowerCase().includes(q))
    );
  });
}