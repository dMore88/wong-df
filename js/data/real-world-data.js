// Real-World Cases Data: Practical graphic design scenarios applying Wucius Wong's visual grammar
export const realWorldCases = [
  {
    id: "brandmarks",
    number: "01",
    title: "Brandmarks & Negative Space Monograms",
    category: "Identity & Logo Design",
    principles: ["Ch 02: Form Interrelations", "Ch 12: Positive/Negative Space"],
    summary: "How subtraction, touching, and penetration produce iconic, memorable brand marks using negative-space Gestalt illusions (think FedEx arrow, WWF panda, Mobil logo).",
    problem: "A client needs a distinctive, timeless brand mark that looks geometric and memorable without complex illustrative clutter.",
    wongSolution: "Combine two elementary geometric primitives (circles, squares, shields) through Subtraction, Penetration, or Touching, leaving the brain to resolve the negative space.",
    tips: [
      "Subtraction cuts away an invisible silhouette from a solid figure, producing an unforgettable negative focal point.",
      "Penetration creates transparent intersections where brand color overlays or secondary shapes emerge.",
      "Touching achieves tension at the exact tangential point of contact without merging."
    ],
    presets: [
      {
        id: "gestalt-subtraction",
        name: "Gestalt Cut (Circle - Diamond)",
        formA: "circle",
        formB: "diamond",
        interrelation: "subtraction",
        scaleA: 130,
        scaleB: 90,
        offsetX: 30,
        offsetY: -10,
        rotationB: 45
      },
      {
        id: "tangent-touching",
        name: "Tangential Contact (Twin Circles)",
        formA: "circle",
        formB: "circle",
        interrelation: "touching",
        scaleA: 110,
        scaleB: 110,
        offsetX: 110,
        offsetY: 0,
        rotationB: 0
      },
      {
        id: "penetration-mark",
        name: "Translucent Penetration (Arch & Hexagon)",
        formA: "arch",
        formB: "hexagon",
        interrelation: "penetration",
        scaleA: 120,
        scaleB: 85,
        offsetX: 40,
        offsetY: 25,
        rotationB: 30
      }
    ],
    mockupType: "monogram"
  },
  {
    id: "swiss-poster",
    number: "02",
    title: "Swiss Typographic Poster & Book Cover",
    category: "Editorial & Cultural Posters",
    principles: ["Ch 04: Structure & Grids", "Ch 07: Radiation", "Ch 06: Gradation"],
    summary: "Combining Wong's mathematical radiation vortices and formal grids with classic Swiss International Typographic layout (Josef Müller-Brockmann style).",
    problem: "Design an exhibition or festival poster that conveys intellectual rigor, hypnotic kinetic energy, and pristine editorial typography.",
    wongSolution: "Generate an underlying centrifugal radiation or concentric wave field that directs visual torque outward, while asymmetric grotesque typography anchors the frame.",
    tips: [
      "Use radiation to generate directional optical energy, drawing the viewer in from across the room.",
      "High-contrast monochrome gives maximum legibility and timeless editorial authority.",
      "Let the geometric field bleed off edges while typographic titles sit precisely on invisible grid margins."
    ],
    presets: [
      {
        id: "vortex-exhibition",
        name: "Centrifugal Vortex (Kunsthalle 1968)",
        type: "vortex",
        arms: 24,
        curvature: 45,
        density: 16,
        themeText: "KUNSTHALLE ZÜRICH 1968\nINTERNATIONALE TYPOGRAFIE\nOKT 12 — NOV 24"
      },
      {
        id: "concentric-ripple",
        name: "Concentric Wave (Neue Grafik)",
        type: "concentric",
        arms: 18,
        curvature: 10,
        density: 22,
        themeText: "NEUE GRAFIK • BAUHAUS WEIMAR\nFORM & STRUKTUR EXHIBIT\nZÜRICH • KUNSTMUSEUM"
      },
      {
        id: "sunburst-festival",
        name: "Sunburst Rays (Electronic Music Series)",
        type: "sunburst",
        arms: 32,
        curvature: 0,
        density: 14,
        themeText: "MODULAR FREQUENCIES • 2026\nANNUAL SOUND ARCHIVE\nBERLIN • VOLKSBÜHNE"
      }
    ],
    mockupType: "poster"
  },
  {
    id: "patterns",
    number: "03",
    title: "Luxury Packaging & Brand Patterns",
    category: "Surface & Packaging Design",
    principles: ["Ch 03: Repetition", "Ch 05: Similarity", "Ch 11: Texture"],
    summary: "Designing seamless brand patterns, packaging wraps, endpapers, and textiles using modular unit repetition, rotational reflection, and subtle similarity kinship.",
    problem: "A luxury lifestyle or boutique brand needs an extensible graphic pattern for premium box packaging, tissue paper, and shopping bags.",
    wongSolution: "Construct a primary unit form using sub-units with rotational symmetry (like the 'Meeting of 4 Circles'), then tile it across an active structural grid with alternating reflection.",
    tips: [
      "A 50% brick shift (half-drop / al tresbolillo) prevents linear eye tracking and creates a rich continuous fabric.",
      "Subtle similarity variations (small changes in aperture or scale) keep large packaging surfaces organic.",
      "Fine line weights with metallic/foil accents evoke luxury and understated elegance."
    ],
    presets: [
      {
        id: "meeting-of-4",
        name: "Meeting of 4 Circles (Wong Classic)",
        module: "quatrefoil",
        gridType: "grid",
        rows: 5,
        cols: 5,
        spacing: 0,
        subUnitScale: 100
      },
      {
        id: "brick-shift-diamonds",
        name: "Half-Drop Diamond Lattice",
        module: "diamond-star",
        gridType: "brick",
        rows: 6,
        cols: 6,
        spacing: 12,
        subUnitScale: 85
      },
      {
        id: "interlocking-chevrons",
        name: "Interlocking Geometric Chevron",
        module: "chevron",
        gridType: "staggered",
        rows: 7,
        cols: 7,
        spacing: 6,
        subUnitScale: 90
      }
    ],
    mockupType: "packaging"
  },
  {
    id: "focal-hierarchy",
    number: "04",
    title: "Focal Hierarchy & High-Impact Hero",
    category: "Digital Direction & Hero Layouts",
    principles: ["Ch 08: Anomaly", "Ch 10: Concentration", "Ch 09: Contrast"],
    summary: "Using structural anomaly and gravitational concentration to break layout monotony and direct the user's eye to high-priority calls to action.",
    problem: "A landing page hero or editorial spread feels flat, repetitive, or lacks an unmistakable starting point for the viewer's gaze.",
    wongSolution: "Distribute a calm, repetitive grid of modules, then introduce an intentional anomaly (scale expansion or tonal fracture) at the exact golden section or action point.",
    tips: [
      "An anomaly works ONLY if the background regular structure is sufficiently consistent to establish a rule.",
      "Too many anomalies destroy hierarchy and create visual noise; exactly one strong anomaly creates an anchor.",
      "Concentration fields simulate gravity, naturally leading the eye along vectors of density toward the key headline."
    ],
    presets: [
      {
        id: "scale-epicenter",
        name: "Scale Anomaly at Golden Section",
        anomalyType: "scale",
        intensity: 220,
        epicenterX: 0.65,
        epicenterY: 0.45,
        gridRows: 8,
        gridCols: 8,
        headline: "THE ATTENTION ANOMALY",
        ctaText: "EXPLORE THE DISRUPTION"
      },
      {
        id: "rotational-rupture",
        name: "Rotational Twist Fracture",
        anomalyType: "rotation",
        intensity: 180,
        epicenterX: 0.5,
        epicenterY: 0.5,
        gridRows: 7,
        gridCols: 7,
        headline: "STRUCTURAL FRACTURE",
        ctaText: "BEGIN RECONSTRUCTION"
      },
      {
        id: "gravitational-cluster",
        name: "Concentration Gravity Well",
        anomalyType: "density",
        intensity: 250,
        epicenterX: 0.4,
        epicenterY: 0.6,
        gridRows: 9,
        gridCols: 9,
        headline: "VISUAL GRAVITY FIELD",
        ctaText: "DISCOVER THE CENTER"
      }
    ],
    mockupType: "hero"
  }
];
