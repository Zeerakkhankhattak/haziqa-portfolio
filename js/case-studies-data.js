/**
 * HAZIQA KHAN KHATTAK — CASE STUDIES DATA STORE
 * Comprehensive, production-grade project narratives highlighting Software Engineering + Product Design synergy.
 */

window.caseStudiesData = {
  "aura-health": {
    title: "Aura Health — Biometric Chronotype & Sleep Intelligence",
    tagline: "Bridging clinical sleep telemetry with an ethereal, low-cognitive-load mobile experience.",
    category: "Product Design",
    role: "Lead Product Designer & Prototyper",
    timeline: "4 Months • 0 to 1 Launch",
    impact: "+42% 30-Day Retention, 94.8% Task Success Rate",
    techStack: ["Figma Variables", "ProtoPie", "React Native", "TailwindCSS", "HealthKit API"],
    image: "assets/images/aura-health.svg",
    problem: `Most sleep and recovery trackers overwhelm users during their most vulnerable moments—early morning and late evening—with dense tabular graphs, clinical terminology, and aggressive alert banners. Users reported feeling 'sleep anxiety' rather than calm empowerment.`,
    research: `Conducted contextual inquiry interviews with 24 shift workers and knowledge professionals. Discovered that 82% wanted ambient, glanceable status instead of numerical overload. The design needed to translate complex biometric algorithms (HRV, circadian rhythm phase shifts) into poetic, intuitive visual metaphors.`,
    solution: `Crafted a circadian-adaptive interface that morphs dynamically based on solar altitude and user sleep stage. Introduced a unified 'Chronotype Radial Orbit' that conveys recovery state in under 2 seconds, paired with spatial audio soundscapes.`,
    engineeringHighlight: `Leveraged my Software Engineering foundation to define strict design token math matching HealthKit telemetry data models. Collaborated closely with the mobile engineering team to write the animation timing curves and ensure 60fps gesture physics on low-power devices.`,
    deliverables: [
      "End-to-End iOS & Android Application Flow",
      "Dynamic Token System (Circadian Color Transitions)",
      "Interactive High-Fidelity ProtoPie Haptic Model",
      "Production-Ready React Native Component Specs"
    ]
  },

  "komorebi": {
    title: "Komorebi — Ambient Spatial Productivity Canvas",
    tagline: "Procedural soundscapes, tactile focus blocks, and zero-distraction micro-widgets.",
    category: "Product Design",
    role: "Product Designer & Frontend Engineer",
    timeline: "3 Months • Concept to Open Beta",
    impact: "12,000+ Active Beta Users, 4.9/5 UX Rating",
    techStack: ["Next.js", "TypeScript", "Web Audio API", "Figma", "CSS Glassmorphism"],
    image: "assets/images/komorebi.svg",
    problem: `Modern task management apps have become hyper-complex databases packed with nested menus, notification spam, and cognitive friction that paradoxically destroy user focus and flow state.`,
    research: `Benchmarked 15 productivity tools and surveyed 180 engineers and designers. Over 74% reported abandoning tools that took more than 5 seconds to capture a thought or required extensive setup. The sweet spot was an ambient, calming sanctuary that balances structure with sensory peace.`,
    solution: `Designed a minimalist spatial desktop workspace that integrates procedural audio synthesis (binaural beats, rain on bamboo, dusk wind) directly with lightweight, fluid task blocks. Utilized deep plum tones and soft blush accents to reduce eye strain during prolonged night sessions.`,
    engineeringHighlight: `Architected the Web Audio API synthesizer node graph and connected it directly to user interaction events. Hand-coded custom CSS custom property animations that sync visually with the audio buffer frequencies without consuming unnecessary GPU cycles.`,
    deliverables: [
      "Desktop Application Architecture & Wireframing",
      "Sensory UI Audio-Visual Feedback System",
      "Interactive Micro-Interactions & Keyboard Shortcuts",
      "Full Next.js & TypeScript Reference Implementation"
    ]
  },

  "scribe-studio": {
    title: "Scribe Studio — Figma-to-Code Token Engine",
    tagline: "Eliminating design-engineering handoff friction through bidirectional token synchronization.",
    category: "Engineering",
    role: "Design Engineer & Systems Architect",
    timeline: "5 Months • Enterprise Tooling",
    impact: "65% Reduction in Design Handoff Review Cycles",
    techStack: ["TypeScript", "Figma Plugin API", "AST Parser", "React", "CSS Modules"],
    image: "assets/images/scribe-studio.svg",
    problem: `The communication gap between design tools and production codebases remains a chronic source of bugs, UI inconsistencies, and endless back-and-forth reviews between designers and frontend developers.`,
    research: `Audited 6 cross-functional product squads. Found that designers frequently changed token values in Figma without knowing the downstream dependency tree, while engineers hardcoded ad-hoc values when specs were ambiguous.`,
    solution: `Designed and engineered Scribe Studio: a bidirectional bridge that inspects Figma component nodes, validates token contrast ratios in real time, and automatically outputs type-safe React/TypeScript component files with zero layout shift.`,
    engineeringHighlight: `Built custom Abstract Syntax Tree (AST) parsers to generate production-ready React components that directly reference CSS variables. Created an intuitive split-pane UI where designers see the rendered component alongside the live generated code.`,
    deliverables: [
      "Figma Plugin UI & Interaction Workflow",
      "Component Token Mapping Engine",
      "Live React Previewer with Interactive Prop Inspector",
      "Developer Documentation & GitHub CI/CD Action"
    ]
  },

  "prism-system": {
    title: "Prism Design System — Multi-Brand Component Architecture",
    tagline: "A resilient, tokenized, WCAG AAA accessible design system engineered for enterprise scale.",
    category: "Design Systems",
    role: "Design System Lead & UI Engineer",
    timeline: "6 Months • 48 Components",
    impact: "Adopted across 4 Core Products, 100% WCAG AAA Compliance",
    techStack: ["Figma Variables", "Storybook", "TypeScript", "Tailwind & Vanilla CSS", "Axe Accessibility"],
    image: "assets/images/prism-system.svg",
    problem: `Four disconnected product suites under a single parent brand suffered from inconsistent button behaviors, fractured color palettes, and critical accessibility failures that blocked international compliance.`,
    research: `Conducted a comprehensive UI inventory across 240+ screens. Identified 38 disparate button styles and 14 variations of primary purple/pink. Needed a unified, mathematical design system that could support dark mode, high contrast, and dynamic brand theming.`,
    solution: `Designed and codified the 'Prism' design token hierarchy (Global -> Semantic -> Component). Created 48 atomic and composite components with strict keyboard navigation, ARIA live regions, and velvety blush/purple theme modes.`,
    engineeringHighlight: `Wrote exhaustive Storybook stories with automated visual regression tests and automated Axe accessibility scanning. Provided developers with copy-paste TypeScript snippets and Figma auto-layout variants with 1:1 parity.`,
    deliverables: [
      "Comprehensive Figma Library with Component Variables",
      "Storybook Documentation Portal & Interaction Tests",
      "Accessible Micro-Interactions (Focus rings, Haptic states)",
      "Zero-Runtime CSS Design Tokens"
    ]
  }
};
