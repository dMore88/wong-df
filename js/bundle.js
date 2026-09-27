// Standalone self-contained script for Wucius Wong 2D Design Studio
// Compatible with both http:// (web server) and file:/// (local direct open)
(function() {
  'use strict';

  // Canvas and mathematical utilities for Wucius Wong Design Studio

const CanvasUtils = {
  // Setup crisp HiDPI canvas
  setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width, height, dpr };
  },

  // Color Palettes inspired by Swiss & Bauhaus Graphic Design
  palettes: {
    monochrome: {
      id: "monochrome",
      name: "Monochrome (Ink & Paper)",
      bg: "#FAFAFA",
      fg: "#111111",
      accent: "#E11D48",
      grid: "#E5E5E5",
      isDark: false
    },
    inverted: {
      id: "inverted",
      name: "Inverted (Chalkboard)",
      bg: "#121212",
      fg: "#F4F4F5",
      accent: "#F43F5E",
      grid: "#27272A",
      isDark: true
    },
    bauhaus: {
      id: "bauhaus",
      name: "Bauhaus Primary",
      bg: "#F7F4EB",
      fg: "#1E1E1E",
      accent: "#D9381E",
      secondary: "#0047AB",
      grid: "#E0DCCE",
      isDark: false
    },
    blueprint: {
      id: "blueprint",
      name: "Architectural Blueprint",
      bg: "#0B2545",
      fg: "#EEF4F8",
      accent: "#134074",
      grid: "#134074",
      isDark: true
    },
    sepia: {
      id: "sepia",
      name: "Warm Editorial Archive",
      bg: "#F5EFE6",
      fg: "#2F2519",
      accent: "#994D1C",
      grid: "#E4D9C8",
      isDark: false
    }
  },

  // Draw background and optional grid
  clear(ctx, width, height, palette, showGrid = false, gridSize = 40) {
    ctx.save();
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, width, height);

    if (showGrid) {
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Subtle center crosshair
      ctx.strokeStyle = palette.accent;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  // Draw regular polygon
  drawPolygon(ctx, x, y, radius, sides, rotation = 0) {
    if (sides < 3) return;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = rotation + (i * 2 * Math.PI) / sides;
      const px = x + radius * Math.cos(angle);
      const py = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  },

  // Draw smooth teardrop shape (frequently used in Wong's similarity & concentration chapters)
  drawTeardrop(ctx, x, y, width, length, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, length / 2);
    ctx.bezierCurveTo(width / 2, length / 4, width / 2, -length / 4, 0, -length / 2);
    ctx.bezierCurveTo(-width / 2, -length / 4, -width / 2, length / 4, 0, length / 2);
    ctx.closePath();
    ctx.restore();
  },

  // Draw Wong's classic "C-shape" / hollow cut-out ring
  drawCShape(ctx, x, y, outerR, innerR, cutAngle = Math.PI / 4, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    const startAngle = cutAngle / 2;
    const endAngle = 2 * Math.PI - cutAngle / 2;
    ctx.arc(0, 0, outerR, startAngle, endAngle, false);
    ctx.arc(0, 0, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.restore();
  },

  // Export current canvas to PNG download
  exportPNG(canvas, filename = "wong-design-study.png") {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  },

  // Export as SVG
  exportSVG(svgString, filename = "wong-design-study.svg") {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
};


  // Complete English content and pedagogical reference for Wucius Wong's 2D Design Fundamentals
const chaptersContent = [
  {
    id: 1,
    number: "01",
    title: "Introduction to Visual Language",
    subtitle: "The elements of design, the picture plane, and visual grammar",
    summary: "Design is a practical process of visual creation with a specific purpose. Unlike pure artistic self-expression, design must convey a predetermined message, solve a practical requirement, and function harmoniously with its environment.",
    readingTime: "6 min read",
    keyConcepts: ["Visual Language", "Conceptual Elements", "Visual Elements", "Relational Elements", "Practical Elements", "Picture Plane"],
    sections: [
      {
        heading: "1. The Nature of Design & Visual Language",
        text: "Many consider design merely as embellishment or surface decoration. In reality, design is a disciplined process of visual creation with purpose. A chair must not only look pleasant; it must stand firmly on the ground, support weight safely, be economical to manufacture, and provide ergonomic comfort.\n\nA good design is the best visual expression of the essence of 'something'—whether a message or a physical object. The designer is a practical problem-solver who must master a visual language governed by systematic principles."
      },
      {
        heading: "2. The Four Groups of Design Elements",
        text: "Wong categorizes design elements into four interconnected groups:\n\n" +
          "• **Conceptual Elements:** Points, lines, planes, and volumes that do not exist physically but are felt to be present. For example, a point exists where two lines intersect; a line marks the boundary of a plane.\n\n" +
          "• **Visual Elements:** When conceptual elements become visible on paper or a screen. They possess:\n" +
          "   - *Shape (Form):* The definitive contour and silhouette that provides visual identity.\n" +
          "   - *Size (Measure):* The relative magnitude and scale compared to other elements or the frame.\n" +
          "   - *Color & Value:* Hue, lightness, saturation, and monochrome tone (black, white, grays).\n" +
          "   - *Texture:* Surface quality—smooth, rough, matte, gloss, or patterned.\n\n" +
          "• **Relational Elements:** Govern the placement and interconnection of forms:\n" +
          "   - *Position:* Judged relative to the picture frame or composition coordinates.\n" +
          "   - *Direction:* Depends on relationship to the viewer, frame, or neighboring forms.\n" +
          "   - *Space:* Filled vs. void; flat 2D surface vs. illusory 3D depth.\n" +
          "   - *Gravity:* Psychological sense of weight, stability, lightness, or tension.\n\n" +
          "• **Practical Elements:** Underlie the purpose and message of design:\n" +
          "   - *Representation:* Realistic, stylized, or abstract imitation of nature or human-made forms.\n" +
          "   - *Meaning:* The symbolic or communicable message conveyed.\n" +
          "   - *Function:* The designated utility the design fulfills."
      },
      {
        heading: "3. The Reference Frame & The Picture Plane",
        text: "Every two-dimensional design exists within a defined boundary known as the 'reference frame' (the edges of the page, canvas, poster, or screen). This frame establishes visual coordinates (center, edges, quadrants) that give meaning to direction, gravity, and scale.\n\nThe picture plane is the actual flat physical or digital surface on which elements are placed. Forms may appear flat on the plane or create illusory depth (floating above, penetrating through, or receding behind)."
      }
    ],
    exercise: {
      title: "Studio Assignment: Conceptual to Visual Transformation",
      instructions: "Use the interactive canvas to explore how an abstract conceptual point expands into a line, an extruded plane, and illusory volume. Experiment with varying position, scale, and gravitational balance within the reference frame.",
      targetGoal: "Create a balanced visual composition featuring point, line, and planar elements with clear directional tension."
    }
  },
  {
    id: 2,
    number: "02",
    title: "Form & The 8 Interrelations",
    subtitle: "Classification of forms, positive/negative space, and spatial encounters",
    summary: "Forms can be classified as points, lines, or planes. When two or more forms encounter each other in a composition, they interact according to eight fundamental relational operations.",
    readingTime: "8 min read",
    keyConcepts: ["Form as Point/Line/Plane", "Positive & Negative Forms", "Figure-Ground", "8 Interrelations of Forms"],
    sections: [
      {
        heading: "1. The Classification of Forms",
        text: "Form is recognized as:\n" +
          "• **Point:** Recognized when small in proportion to the reference frame. Its shape is simple and devoid of explicit direction (circles, squares, simple blobs).\n" +
          "• **Line:** Recognized when width is extremely narrow relative to length. Characterized by body, curvature, and extremities.\n" +
          "• **Plane:** A two-dimensional surface bounded by lines. Classified into:\n" +
          "   - *Geometric:* Constructed mathematically (circles, triangles, squares).\n" +
          "   - *Organic:* Bound by fluid, natural, convex curves.\n" +
          "   - *Rectilinear:* Straight lines not mathematically related.\n" +
          "   - *Irregular:* Mixed straight lines and curves without mathematical formula.\n" +
          "   - *Calligraphic/Hand-drawn:* Gestural lines of varying thickness.\n" +
          "   - *Accidental:* Spontaneous splatters, cracks, or natural textures."
      },
      {
        heading: "2. Positive & Negative Forms (Figure-Ground)",
        text: "A form occupying space is 'positive' (figure), while the unoccupied space surrounding it is 'negative' (ground). When black forms sit on white paper, black is perceived as positive. However, reversing the distribution turns white into positive forms enclosed in a black void. In ambiguous designs, figure and ground continuously alternate in perception."
      },
      {
        heading: "3. The 8 Interrelations of Forms",
        text: "When two distinct shapes meet on a plane, their relationship falls into one of eight distinct visual operations:\n\n" +
          "1. **Detachment (Distanciamiento):** Forms remain separated with negative space between them.\n" +
          "2. **Touching (Toque):** Forms make point- or edge-contact without overlapping; negative space between them is closed.\n" +
          "3. **Overlapping (Superposición):** One form sits in front of the other, occluding part of the rear form and generating illusory depth.\n" +
          "4. **Penetration (Penetración):** Both forms appear transparent; overlapping contours remain fully visible, dividing the intersection into transparent zones.\n" +
          "5. **Union (Unión):** Forms merge into a single continuous combined silhouette; boundary lines disappear at intersection.\n" +
          "6. **Subtraction (Sustracción):** An invisible or negative form cuts away from an underlying positive form, leaving a void.\n" +
          "7. **Intersection (Intersección):** Only the shared common area where both forms cross remains visible; outer contours are discarded.\n" +
          "8. **Coincidence (Coincidencia):** Both forms align in identical position and size, coalescing into a single entity."
      }
    ],
    exercise: {
      title: "Studio Assignment: The 8 Interrelations Matrix",
      instructions: "Select two overlapping geometric forms on the interactive canvas. Switch through each of the 8 interrelation modes and toggle positive/negative inversion to observe how visual unity and figure-ground shifts occur.",
      targetGoal: "Demonstrate all 8 interrelations using a circle and a square, observing how union and subtraction form new hybrid silhouettes."
    }
  },
  {
    id: 3,
    number: "03",
    title: "Repetition",
    subtitle: "Unit forms, sub-units, super-units, reflection, and rhythmic schemes",
    summary: "Repetition is the most fundamental design discipline. When a unit form is repeated across a surface, it introduces immediate rhythm, visual unity, and structural order.",
    readingTime: "7 min read",
    keyConcepts: ["Unit Form (Module)", "Sub-unit", "Super-unit", "The Meeting of 4 Circles", "Reflection", "Rotational Symmetry"],
    sections: [
      {
        heading: "1. Repetition of Unit Forms (Modules)",
        text: "Unit forms are simple shapes repeated throughout a design to establish order and rhythm. Repetition can apply to:\n" +
          "• *Shape:* The primary visual element; identical silhouettes repeated across the plane.\n" +
          "• *Size:* Identical dimensions ensuring uniform visual scale.\n" +
          "• *Color & Value:* Uniform hue and brightness or structured alternating contrast.\n" +
          "• *Direction & Position:* Direction may be constant, alternating, or systematically varied."
      },
      {
        heading: "2. Sub-units and Super-units",
        text: "A unit form can itself be composed of smaller elements called **sub-units (submódulos)**.\n\n" +
          "When two, three, or four unit forms are grouped closely together to act as a unified repeated element throughout the larger composition, they form a **super-unit (supermódulo)**."
      },
      {
        heading: "3. The Classic Exercise: The Meeting of Four Circles",
        text: "Wucius Wong illustrates the boundless power of super-units using four identical circles:\n" +
          "• *Linear Arrangement:* Four circles lined up in a straight or curved row.\n" +
          "• *Square / Rectangular Arrangement:* Four circles placed at the four corners of a square.\n" +
          "• *Rhombic Arrangement:* Four circles forming a diamond diamond grid.\n" +
          "• *Triangular Arrangement:* Three circles forming a triangle with one circle centered or stacked.\n" +
          "• *Circular / Radial Arrangement:* Four circles arranged around a central pivot point.\n\n" +
          "By adjusting the inter-circle distance from detachment to touching, penetration, and union, countless distinct super-units emerge."
      },
      {
        heading: "4. Reflection and Rotation",
        text: "When an asymmetrical unit form is mirrored across an axis, it creates **reflection**. A reflected form cannot be matched by simple rotation; together, mirrored pairs produce bilateral symmetry and rich counterpointed patterns."
      }
    ],
    exercise: {
      title: "Studio Assignment: Super-Unit Generator",
      instructions: "Combine 4 basic unit forms into a super-unit using rotational and reflective symmetry. Tile this super-unit across a repetition field and test alternating positive/negative color schemes.",
      targetGoal: "Construct an intricate optical wallpaper pattern built solely from the repetition of a 4-element super-unit."
    }
  },
  {
    id: 4,
    number: "04",
    title: "Structure",
    subtitle: "Formal, semi-formal, informal structures; active vs. inactive, visible vs. invisible grids",
    summary: "Structure governs the spatial positioning and internal relationships between unit forms. It is the underlying skeletal framework that guides composition.",
    readingTime: "9 min read",
    keyConcepts: ["Formal / Semi-formal / Informal", "Active vs. Inactive", "Visible vs. Invisible", "Basic Repetition Grid", "Grid Variations"],
    sections: [
      {
        heading: "1. The Classification of Structures",
        text: "Structure can be defined according to three fundamental categories:\n\n" +
          "• **Formal Structure:** Rigorous, mathematically disciplined grid lines guide the composition (repetition, gradation, radiation).\n" +
          "• **Semi-formal Structure:** Regular overall layout with deliberate slight irregularities, shifts, or loose rhythms.\n" +
          "• **Informal Structure:** Free, intuitive distribution without strict mathematical guidelines (contrast, balance, asymmetry)."
      },
      {
        heading: "2. Active vs. Inactive Structures",
        text: "• **Inactive Structure:** Structural lines exist purely conceptually to position unit forms. The lines do not cut into or alter the forms, nor do they divide space into isolated color zones.\n\n" +
          "• **Active Structure:** Structural lines actively divide the canvas into individual spatial cells. An active line **slices, clips, or confines** any unit form that crosses it, or inverts the color between neighboring cells (e.g. checkerboard effect)."
      },
      {
        heading: "3. Visible vs. Invisible Structures",
        text: "• **Invisible Structure:** Structural lines exist purely to align shapes; the lines themselves have zero stroke width and are unseen.\n\n" +
          "• **Visible Structure:** The structural lines themselves have tangible stroke thickness, color, and texture, becoming prominent visual elements alongside the modules."
      },
      {
        heading: "4. Variations of the Basic Repetition Grid",
        text: "From a simple square grid, numerous variations can be mathematically derived:\n" +
          "a) *Proportion Change:* Stretching squares into tall or wide rectangles.\n" +
          "b) *Direction Change:* Shearing horizontal or vertical lines into sloped rhomboids (isometric/diagonal grids).\n" +
          "c) *Sliding (Staggering):* Alternating rows or columns shifted horizontally or vertically like running-bond brickwork.\n" +
          "d) *Curvature & Zigzag:* Curving or kinking structural lines.\n" +
          "e) *Combination:* Grouping multiple grid cells into larger macro-cells.\n" +
          "f) *Triangular & Hexagonal Grids:* Tilting axes to create 60-degree triangular or hexagonal tessellations."
      }
    ],
    exercise: {
      title: "Studio Assignment: Active Grid Slicing",
      instructions: "Place repeating unit forms across a basic grid. Toggle between Inactive (floating modules) and Active (clipped/inverted modules), and adjust grid sliding and curvature.",
      targetGoal: "Create a dynamic checkerboard composition where an active grid shears and inverts the colors of the contained modules."
    }
  },
  {
    id: 5,
    number: "05",
    title: "Similarity",
    subtitle: "Similarity of modules, spatial distortion, tension, compression, and similarity structures",
    summary: "Similarity creates visual kinship without strict mathematical uniformity. In nature, no two oak leaves or tree branches are identical, yet they share an undeniable structural similarity.",
    readingTime: "7 min read",
    keyConcepts: ["Visual Kinship", "Imperfection & Truncation", "Spatial Distortion (Foreshortening)", "Tension & Compression", "Similarity Structures"],
    sections: [
      {
        heading: "1. Similarity vs. Repetition",
        text: "While repetition demands identical shapes, similarity embraces natural variation while maintaining visual harmony. Similarity avoids the rigid discipline of repetition without dissolving into chaotic disparity."
      },
      {
        heading: "2. Methods for Creating Similarity of Form",
        text: "Wong details five primary methods for generating similar unit forms:\n\n" +
          "• **Association:** Shapes belonging to the same family or category (e.g. all 26 letters of a custom typeface; different species of leaves).\n" +
          "• **Imperfection:** Starting with an ideal mathematical form (circle, square) and introducing cuts, broken corners, or random distortions.\n" +
          "• **Spatial Distortion (Foreshortening):** Rotating a flat shape in simulated 3D space, compressing its projected silhouette into ellipses or trapezoids.\n" +
          "• **Union / Subtraction Variations:** Combining or cutting two shapes at subtly shifting offsets, angles, or proportions.\n" +
          "• **Tension and Compression:** Treating the form as an elastic membrane subjected to pulling forces (stretching) or pushing forces (squashing)."
      },
      {
        heading: "3. Similarity Structures",
        text: "Unlike rigid repetition grids, a similarity structure uses subdivisions that are similar in shape and area but non-identical. Examples include Voronoi cells, irregular quad networks, and organic tessellations resembling stone paving or cracked dry earth."
      }
    ],
    exercise: {
      title: "Studio Assignment: Elastic Morphing Field",
      instructions: "Define a base geometric unit form and apply procedural tension, compression, and 3D angle distortion across the canvas to generate an organic, breathing field of similar modules.",
      targetGoal: "Generate a field of 36 unit forms that clearly belong to the same visual family while each having unique elastic deformation."
    }
  },
  {
    id: 6,
    number: "06",
    title: "Gradation",
    subtitle: "Planar, spatial, and shape gradation; velocity, progression pathways, and alternating structures",
    summary: "Gradation creates a progressive, ordered change along a specific path. It generates an intense optical illusion of movement, depth, and culmination.",
    readingTime: "8 min read",
    keyConcepts: ["Planar Gradation", "Spatial Gradation", "Shape Gradation", "Velocity (Slow vs. Fast)", "Parallel, Concentric, Zigzag Paths", "Alternating Gradation"],
    sections: [
      {
        heading: "1. The Discipline of Gradation",
        text: "Gradation is stricter than similarity: every step in the sequence must follow a systematic, discernible rule of change. Because human perception readily interprets gradual reduction in size as recession into distance, gradation effortlessly introduces spatial depth and kinetic rhythm."
      },
      {
        heading: "2. The Three Modes of Gradation",
        text: "• **Planar Gradation:** Changes occurring entirely within the 2D picture plane without implying 3D rotation:\n" +
          "   - *Rotation in plane:* Forms rotate progressively around their centers.\n" +
          "   - *Progression in plane:* Forms step gradually along horizontal, vertical, or diagonal axes.\n\n" +
          "• **Spatial Gradation:** Changes that imply motion into 3D depth:\n" +
          "   - *Spatial Rotation:* The form tilts into depth, foreshortening into an edge.\n" +
          "   - *Spatial Progression (Scale):* Gradual decrease in size implying retreat away from the viewer.\n\n" +
          "• **Shape Gradation:** The contour itself transforms:\n" +
          "   - *Union/Subtraction morphing:* A shape gradually grows an appendage or is hollowed out.\n" +
          "   - *Edge morphing:* A sharp square smoothly rounds its corners into a circle or sharpens into a triangle."
      },
      {
        heading: "3. Gradation Velocity and Pathways",
        text: "• **Velocity:** Fast gradation (few steps) creates dramatic jumps; slow gradation (many subtle steps) creates smooth, hypnotic optical illusions.\n" +
          "• **Pathways:** Gradation can advance in:\n" +
          "   - *Parallel rows:* Left to right, top to bottom.\n" +
          "   - *Concentric rings:* Radiating out from a central peak or hollow.\n" +
          "   - *Zigzag tracks:* Weaving back and forth across columns.\n" +
          "• **Alternating Gradation:** Two opposing gradations interlaced side-by-side (e.g. even rows expanding while odd rows contract), producing pulsating optical vibrations."
      }
    ],
    exercise: {
      title: "Studio Assignment: Alternating Gradation Wave",
      instructions: "Set up a grid with shape morphing (circle to diamond) along the X-axis and size/rotation gradation along the Y-axis. Enable alternating row inversion.",
      targetGoal: "Produce a pulsating optical wave composition where shape and size gradation culminate in a high-contrast focal ridge."
    }
  },
  {
    id: 7,
    number: "07",
    title: "Radiation",
    subtitle: "Centrifugal, concentric, and centripetal schemes; multiple centers and optical Moiré",
    summary: "Radiation is a specialized case of repetition where structural lines or modules revolve regularly around a common focal center, creating explosive visual energy and directional momentum.",
    readingTime: "9 min read",
    keyConcepts: ["Focal Center", "Centrifugal Radiation", "Concentric Radiation", "Centripetal Radiation", "Multiple Centers", "Moiré Superposition"],
    sections: [
      {
        heading: "1. Characteristics of Radiation",
        text: "Radiation possesses distinct optical traits:\n" +
          "• Highly multi-symmetrical around a central axis.\n" +
          "• An intense focal point that commands instant visual attention.\n" +
          "• A powerful psychological sense of energy radiating outward or pulling inward."
      },
      {
        heading: "2. The Three Primary Classes of Radiation",
        text: "• **Centrifugal Radiation (Outward):** Lines or modules radiate directly away from the center:\n" +
          "   - *Basic straight rays:* Radial spikes.\n" +
          "   - *Curved / Swirling rays:* Spiraling outward like a pinwheel or galaxy.\n" +
          "   - *Open center (Aperture):* The center opens into a polygon or circular void with rays running tangentially.\n" +
          "   - *Multi-center:* Several distinct focal origins interacting across the plane.\n\n" +
          "• **Concentric Radiation (Enclosing):** Structural lines surround the center in nested layers:\n" +
          "   - Concentric circles, squares, or polygons.\n" +
          "   - Archimedean and logarithmic spirals.\n" +
          "   - Gradual rotation of concentric polygon layers.\n\n" +
          "• **Centripetal Radiation (Inward):** Sequences of curved or bent lines that press inward toward the center."
      },
      {
        heading: "3. Superposition & Optical Moiré",
        text: "When two radiation structures are overlaid (for instance, two offset centrifugal wheels or concentric ring systems), their intersecting lines create complex interference patterns known as **Moiré effects**, producing shimmer and kinetic vibration."
      }
    ],
    exercise: {
      title: "Studio Assignment: Dual-Center Moiré Engine",
      instructions: "Configure a centrifugal radiating system with customizable ray count and curvature. Add a secondary center with slight offset to explore constructive and destructive interference waves.",
      targetGoal: "Construct a dynamic swirling radiation field with an open polygonal core and secondary Moiré resonance."
    }
  },
  {
    id: 8,
    number: "08",
    title: "Anomaly",
    subtitle: "Irregularity within regularity, relieving monotony, focal emphasis, and structural fracture",
    summary: "Anomaly is the intentional introduction of irregularity into a disciplined, regular design. It breaks visual monotony, commands immediate attention, and can create dramatic fractures.",
    readingTime: "7 min read",
    keyConcepts: ["Irregularity in Regularity", "Focal Point Generation", "Relieving Monotony", "Anomaly in Modules", "Anomaly in Structure", "Structural Fracture"],
    sections: [
      {
        heading: "1. The Purpose of Anomaly",
        text: "Pure regularity can easily become static and monotonous. Anomaly serves three crucial design functions:\n" +
          "1. **Attracting Attention:** The anomalous element becomes an instantaneous focal point because the human eye is wired to spot deviations.\n" +
          "2. **Relieving Monotony:** Subtle variations scatter energy and warmth across an otherwise rigid grid.\n" +
          "3. **Transforming or Breaking Regularity:** Anomaly can act as an invading force that progressively shatters or reorganizes the entire structure."
      },
      {
        heading: "2. Anomaly Among Unit Forms",
        text: "A single module or small cluster deviates in one or more visual elements:\n" +
          "• Shape anomaly: One triangular module sits inside a field of ninety-nine circles.\n" +
          "• Size anomaly: One oversized or microscopic module within an otherwise uniform array.\n" +
          "• Color/Value anomaly: Inverting color or turning one element bright white against a field of gray/black."
      },
      {
        heading: "3. Anomaly Within Structure",
        text: "The grid itself can undergo localized distortion:\n" +
          "• Dislocation or sliding of several structural rows.\n" +
          "• A localized swelling, compression, or curved warp zone.\n" +
          "• **Fracture (Ruptura):** A jagged fault line running through the grid where lines are severed, offset, or destroyed, evoking earthquake fissures or torn paper."
      }
    ],
    exercise: {
      title: "Studio Assignment: The Structural Fault Line",
      instructions: "Generate a dense grid of regular unit forms. Click on the canvas to place an anomaly epicenter, and adjust the fracture radius and distortion intensity.",
      targetGoal: "Demonstrate a dramatic focal rupture where modules near the epicenter shear and shatter while outer modules remain strictly aligned."
    }
  },
  {
    id: 9,
    number: "09",
    title: "Contrast",
    subtitle: "Comparison of visual and relational opposites, dominance, and dynamic equilibrium",
    summary: "Contrast is the sharp comparison of differences: black vs. white, straight vs. curved, large vs. small. It prevents visual flatness and creates tension, drama, and hierarchy.",
    readingTime: "8 min read",
    keyConcepts: ["Contrast of Visual Elements", "Contrast of Relational Elements", "Dominance (Majority)", "Emphasis (Minority)", "Dynamic Asymmetric Balance"],
    sections: [
      {
        heading: "1. The Universal Presence of Contrast",
        text: "Contrast exists everywhere: day vs. night, sharp vs. blunt, solid vs. void. In design, contrast is not limited to obvious black-and-white dichotomy; it operates across every dimension of form, scale, direction, and spatial depth."
      },
      {
        heading: "2. Categories of Contrast",
        text: "• **Contrast of Shape:** Curvilinear vs. rectilinear; geometric vs. organic; simple vs. complex.\n" +
          "• **Contrast of Size:** Gigantic macro-forms paired with delicate micro-dots.\n" +
          "• **Contrast of Color & Value:** High-contrast pitch black against paper white; subtle dark gray against light gray.\n" +
          "• **Contrast of Direction:** Vertical stable pillars clashing with acute 45-degree diagonal thrusts.\n" +
          "• **Contrast of Position & Space:** Crowded clusters vs. vast empty negative expanses.\n" +
          "• **Contrast of Gravity:** Heavy, grounded solid blocks balancing buoyant, floating shapes."
      },
      {
        heading: "3. Dominance and Emphasis",
        text: "A successful contrast composition requires two balancing forces:\n" +
          "• **Dominance of the Majority:** One element type, color, or direction must prevail to provide structural coherence and visual unity.\n" +
          "• **Emphasis of the Minority:** The small contrasting minority must be placed strategically to command attention without overwhelming the whole composition—resembling a counterweight on an asymmetrical scale."
      }
    ],
    exercise: {
      title: "Studio Assignment: Dominance & Asymmetric Balance",
      instructions: "Compose a canvas with two competing shape vocabularies (monolithic rectilinear bars vs. small organic circles). Adjust the ratio slider to balance visual weight.",
      targetGoal: "Achieve dynamic visual equilibrium where 90% dominant rectilinear elements are harmoniously anchored by 10% high-contrast circular accents."
    }
  },
  {
    id: 10,
    number: "10",
    title: "Concentration",
    subtitle: "Quantitative distribution of modules, gathering and scattering, gravitational density",
    summary: "Concentration refers to the quantitative distribution of unit forms: gathering densely in certain zones while dispersing loosely in others, mirroring cities, galaxies, and biological swarms.",
    readingTime: "8 min read",
    keyConcepts: ["Quantitative Distribution", "Concentration to Point/Line", "Deconcentration (Diffusion)", "Free Concentration", "Super-concentration"],
    sections: [
      {
        heading: "1. The Quantitative Nature of Concentration",
        text: "While gradation deals with systematic shape/size progression, concentration deals with **density and population**: how many modules are packed into a unit area. A city center surrounded by sprawling suburbs is the classic real-world model of concentration."
      },
      {
        heading: "2. Types of Concentration Structures",
        text: "• **Concentration Toward a Point:** Modules crowd together tightly around a focal coordinate, thinning out toward the periphery.\n" +
          "• **Concentration Away from a Point:** A void or clearing at the center, with modules fleeing toward outer perimeters.\n" +
          "• **Concentration Toward a Line:** Modules cluster like filings along a magnetic field line or riverbank.\n" +
          "• **Free Concentration:** Multiple fluid hotspots and empty voids creating rhythm without mathematical centers.\n" +
          "• **Super-concentration:** Modules pack so densely that individual shapes fuse into a solid textured mass.\n" +
          "• **Deconcentration:** An even, randomized dispersion of forms across the plane without clustering."
      }
    ],
    exercise: {
      title: "Studio Assignment: Multi-Attractor Swarm Studio",
      instructions: "Place multiple gravitational attractor and repulsor points onto the canvas. Adjust the particle count, gravitational pull, and falloff radius to shape organic density clouds.",
      targetGoal: "Simulate a cosmic concentration field with dense gravitational clusters flowing into ethereal deconcentrated voids."
    }
  },
  {
    id: 11,
    number: "11",
    title: "Texture",
    subtitle: "Visual vs. tactile texture, typographic halftones, mechanical rasterization, and collage",
    summary: "Texture refers to the surface characteristics of a form. In 2D design, visual texture evokes tactile sensations through optical patterns, grain, mechanical screens, and typography.",
    readingTime: "7 min read",
    keyConcepts: ["Visual vs. Tactile Texture", "Decorative Texture", "Spontaneous Texture", "Mechanical Texture", "Typographic Density", "Collage"],
    sections: [
      {
        heading: "1. Visual Texture vs. Tactile Texture",
        text: "• **Visual Texture:** Strictly two-dimensional; seen by the eye but flat to the touch. It creates illusions of richness, depth, and material character.\n" +
          "• **Tactile Texture:** Physically three-dimensional; felt by fingers (embossed paper, rough canvas, wood grain)."
      },
      {
        heading: "2. The Three Types of Visual Texture",
        text: "• **Decorative Texture:** Manually drawn or stamped patterns that decorate a surface without changing its underlying structural shape.\n" +
          "• **Spontaneous Texture:** Inseparable from the process of creation itself—ink wash blooms, splatter, dry-brush drag, or marbling.\n" +
          "• **Mechanical Texture:** Generated by mechanical or digital processes—halftone dots, scanlines, digital dithering, and mathematical noise."
      },
      {
        heading: "3. Typography as Visual Texture",
        text: "In one of Wong's most famous classroom exercises, students cut and layered printed letterforms from newspapers and books. Scaled down or tightly interlaced, words lose their verbal readability and transform into sophisticated fields of visual tone, grain, and rhythmic vibration."
      }
    ],
    exercise: {
      title: "Studio Assignment: Typographic Raster Generator",
      instructions: "Generate procedural visual texture using typographic glyphs and halftone screens. Vary glyph scale, kerning density, and noise turbulence.",
      targetGoal: "Compose an optical portrait/gradient using varying densities of typography as a continuous tonal texture."
    }
  },
  {
    id: 12,
    number: "12",
    title: "Space",
    subtitle: "Positive/negative space, flat vs. illusory depth, fluctuating and conflicting space",
    summary: "Space in 2D design can be flat or illusory. Through overlapping, size changes, linear perspective, and isometric projection, flat paper opens into three-dimensional infinity or mind-bending optical contradictions.",
    readingTime: "9 min read",
    keyConcepts: ["Positive / Negative Space", "Flat Space", "Illusory Space", "Perspective & Isometric", "Fluctuating Space", "Conflicting (Impossible) Space"],
    sections: [
      {
        heading: "1. Flat Space vs. Illusory Space",
        text: "• **Flat Space:** All forms seem to rest parallel and flat upon the picture plane without receding or advancing.\n" +
          "• **Illusory Space:** The 2D surface acts like a window into three-dimensional reality. Techniques include:\n" +
          "   - *Overlapping:* Front forms occlude rear forms.\n" +
          "   - *Size change:* Smaller forms seem further away.\n" +
          "   - *Vertical placement:* Lower forms appear closer; higher forms seem distant.\n" +
          "   - *Isometric & Linear Perspective:* Angled converging lines suggesting receding parallel planes."
      },
      {
        heading: "2. Fluctuating Space",
        text: "Fluctuating space occurs when visual cues are ambiguous. A form seems to push forward one second, and recede the next, creating a kinetic vibration where the eye cannot settle on a permanent spatial interpretation (e.g. Necker cube variations, alternating black/white planes)."
      },
      {
        heading: "3. Conflicting (Impossible) Space",
        text: "Conflicting space presents visual evidence that cannot physically exist in three dimensions. Lines and planes connect in ways that appear logical locally, but form an absurd, impossible whole when viewed globally (reminiscent of M.C. Escher and Josef Albers)."
      }
    ],
    exercise: {
      title: "Studio Assignment: The Optical Space Lab",
      instructions: "Experiment with impossible isometric cubes, fluctuating staircases, and reversible figure-ground planes. Toggle depth cues (shading, overlaps, and perspective lines).",
      targetGoal: "Construct a conflicting optical illusion where planes simultaneously project forward and fold backward in space."
    }
  }
];


  // Shape definitions and drawing procedures for Wucius Wong Design Studio

const Shapes = {
  // 1. Pure Geometrics
  circle: {
    id: "circle",
    name: "Circle",
    category: "geometric",
    draw(ctx, size) {
      const r = size / 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.closePath();
    },
    svgPath(size) {
      const r = size / 2;
      return `<circle cx="0" cy="0" r="${r}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><circle cx="0" cy="0" r="14" fill="currentColor"/></svg>`
  },

  square: {
    id: "square",
    name: "Square",
    category: "geometric",
    draw(ctx, size) {
      const s = size;
      ctx.beginPath();
      ctx.rect(-s / 2, -s / 2, s, s);
      ctx.closePath();
    },
    svgPath(size) {
      const s = size;
      return `<rect x="${-s/2}" y="${-s/2}" width="${s}" height="${s}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><rect x="-14" y="-14" width="28" height="28" fill="currentColor"/></svg>`
  },

  rect: {
    id: "rect",
    name: "Rectangle",
    category: "geometric",
    draw(ctx, size) {
      const w = size * 0.6;
      const h = size;
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.closePath();
    },
    svgPath(size) {
      const w = size * 0.6;
      const h = size;
      return `<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><rect x="-9" y="-15" width="18" height="30" fill="currentColor"/></svg>`
  },

  triangle_eq: {
    id: "triangle_eq",
    name: "Equilateral Triangle",
    category: "geometric",
    draw(ctx, size) {
      const r = size * 0.58;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * Math.cos(Math.PI / 6), r * Math.sin(Math.PI / 6));
      ctx.lineTo(-r * Math.cos(Math.PI / 6), r * Math.sin(Math.PI / 6));
      ctx.closePath();
    },
    svgPath(size) {
      const r = size * 0.58;
      const x1 = 0, y1 = -r;
      const x2 = r * Math.cos(Math.PI / 6), y2 = r * Math.sin(Math.PI / 6);
      const x3 = -r * Math.cos(Math.PI / 6), y3 = r * Math.sin(Math.PI / 6);
      return `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="0,-15 14,12 -14,12" fill="currentColor"/></svg>`
  },

  triangle_right: {
    id: "triangle_right",
    name: "Right Triangle",
    category: "geometric",
    draw(ctx, size) {
      const s = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(-s, -s);
      ctx.lineTo(s, s);
      ctx.lineTo(-s, s);
      ctx.closePath();
    },
    svgPath(size) {
      const s = size * 0.5;
      return `<polygon points="${-s},${-s} ${s},${s} ${-s},${s}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="-12,-12 12,12 -12,12" fill="currentColor"/></svg>`
  },

  rhombus: {
    id: "rhombus",
    name: "Rhombus (Diamond)",
    category: "polygonal",
    draw(ctx, size) {
      const rx = size * 0.45;
      const ry = size * 0.65;
      ctx.beginPath();
      ctx.moveTo(0, -ry);
      ctx.lineTo(rx, 0);
      ctx.lineTo(0, ry);
      ctx.lineTo(-rx, 0);
      ctx.closePath();
    },
    svgPath(size) {
      const rx = size * 0.45;
      const ry = size * 0.65;
      return `<polygon points="0,${-ry} ${rx},0 0,${ry} ${-rx},0" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="0,-16 11,0 0,16 -11,0" fill="currentColor"/></svg>`
  },

  trapezoid: {
    id: "trapezoid",
    name: "Trapezoid",
    category: "polygonal",
    draw(ctx, size) {
      const topW = size * 0.35;
      const botW = size * 0.7;
      const h = size * 0.55;
      ctx.beginPath();
      ctx.moveTo(-topW / 2, -h / 2);
      ctx.lineTo(topW / 2, -h / 2);
      ctx.lineTo(botW / 2, h / 2);
      ctx.lineTo(-botW / 2, h / 2);
      ctx.closePath();
    },
    svgPath(size) {
      const topW = size * 0.35;
      const botW = size * 0.7;
      const h = size * 0.55;
      return `<polygon points="${-topW/2},${-h/2} ${topW/2},${-h/2} ${botW/2},${h/2} ${-botW/2},${h/2}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="-6,-10 6,-10 14,10 -14,10" fill="currentColor"/></svg>`
  },

  hexagon: {
    id: "hexagon",
    name: "Hexagon",
    category: "polygonal",
    draw(ctx, size) {
      const r = size * 0.52;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    },
    svgPath(size) {
      const r = size * 0.52;
      let pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        pts.push(`${r * Math.cos(a)},${r * Math.sin(a)}`);
      }
      return `<polygon points="${pts.join(" ")}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="0,-14 13,-7 13,8 0,15 -13,8 -13,-7" fill="currentColor"/></svg>`
  },

  star4: {
    id: "star4",
    name: "4-Point Star",
    category: "polygonal",
    draw(ctx, size) {
      const rOuter = size * 0.55;
      const rInner = size * 0.18;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    },
    svgPath(size) {
      const rOuter = size * 0.55;
      const rInner = size * 0.18;
      let pts = [];
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? rOuter : rInner;
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        pts.push(`${r * Math.cos(a)},${r * Math.sin(a)}`);
      }
      return `<polygon points="${pts.join(" ")}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><polygon points="0,-15 4,-4 15,0 4,4 0,15 -4,4 -15,0 -4,-4" fill="currentColor"/></svg>`
  },

  crescent: {
    id: "crescent",
    name: "Crescent (Lúnula)",
    category: "organic",
    draw(ctx, size) {
      const r = size * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
      ctx.arc(r * 0.45, 0, r * 0.85, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();
    },
    svgPath(size) {
      const r = size * 0.5;
      const cutX = r * 0.45;
      const cutR = r * 0.85;
      return `<path d="M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${cutR} ${cutR} 0 0 0 0 ${-r} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M 0 -14 A 14 14 0 0 1 0 14 A 12 12 0 0 0 0 -14 Z" fill="currentColor"/></svg>`
  },

  teardrop: {
    id: "teardrop",
    name: "Teardrop (Gota)",
    category: "organic",
    draw(ctx, size) {
      const w = size * 0.65;
      const l = size * 0.95;
      ctx.beginPath();
      ctx.moveTo(0, -l / 2);
      ctx.bezierCurveTo(w / 1.5, -l / 6, w / 1.8, l / 2, 0, l / 2);
      ctx.bezierCurveTo(-w / 1.8, l / 2, -w / 1.5, -l / 6, 0, -l / 2);
      ctx.closePath();
    },
    svgPath(size) {
      const w = size * 0.65;
      const l = size * 0.95;
      return `<path d="M 0 ${-l/2} C ${w/1.5} ${-l/6}, ${w/1.8} ${l/2}, 0 ${l/2} C ${-w/1.8} ${l/2}, ${-w/1.5} ${-l/6}, 0 ${-l/2} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M 0 -14 C 10 -4, 9 13, 0 13 C -9 13, -10 -4, 0 -14 Z" fill="currentColor"/></svg>`
  },

  capsule: {
    id: "capsule",
    name: "Capsule (Píldora)",
    category: "organic",
    draw(ctx, size) {
      const w = size * 0.5;
      const h = size * 0.9;
      const r = w / 2;
      ctx.beginPath();
      ctx.arc(0, -h / 2 + r, r, Math.PI, 0, false);
      ctx.arc(0, h / 2 - r, r, 0, Math.PI, false);
      ctx.closePath();
    },
    svgPath(size) {
      const w = size * 0.5;
      const h = size * 0.9;
      const r = w / 2;
      return `<path d="M ${-r} ${-h/2+r} A ${r} ${r} 0 0 1 ${r} ${-h/2+r} L ${r} ${h/2-r} A ${r} ${r} 0 0 1 ${-r} ${h/2-r} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M -7 -6 A 7 7 0 0 1 7 -6 L 7 6 A 7 7 0 0 1 -7 6 Z" fill="currentColor"/></svg>`
  },

  cross: {
    id: "cross",
    name: "Greek Cross (+)",
    category: "polygonal",
    draw(ctx, size) {
      const arm = size * 0.5;
      const th = size * 0.18;
      ctx.beginPath();
      ctx.moveTo(-th / 2, -arm);
      ctx.lineTo(th / 2, -arm);
      ctx.lineTo(th / 2, -th / 2);
      ctx.lineTo(arm, -th / 2);
      ctx.lineTo(arm, th / 2);
      ctx.lineTo(th / 2, th / 2);
      ctx.lineTo(th / 2, arm);
      ctx.lineTo(-th / 2, arm);
      ctx.lineTo(-th / 2, th / 2);
      ctx.lineTo(-arm, th / 2);
      ctx.lineTo(-arm, -th / 2);
      ctx.lineTo(-th / 2, -th / 2);
      ctx.closePath();
    },
    svgPath(size) {
      const arm = size * 0.5;
      const th = size * 0.18;
      return `<path d="M ${-th/2} ${-arm} L ${th/2} ${-arm} L ${th/2} ${-th/2} L ${arm} ${-th/2} L ${arm} ${th/2} L ${th/2} ${th/2} L ${th/2} ${arm} L ${-th/2} ${arm} L ${-th/2} ${th/2} L ${-arm} ${th/2} L ${-arm} ${-th/2} L ${-th/2} ${-th/2} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M -3 -14 L 3 -14 L 3 -3 L 14 -3 L 14 3 L 3 3 L 3 14 L -3 14 L -3 3 L -14 3 L -14 -3 L -3 -3 Z" fill="currentColor"/></svg>`
  },

  c_ring: {
    id: "c_ring",
    name: "C-Shape Ring (Wong)",
    category: "geometric",
    draw(ctx, size) {
      const outerR = size * 0.5;
      const innerR = size * 0.26;
      const cutAngle = Math.PI / 3;
      ctx.beginPath();
      const startAngle = cutAngle / 2;
      const endAngle = 2 * Math.PI - cutAngle / 2;
      ctx.arc(0, 0, outerR, startAngle, endAngle, false);
      ctx.arc(0, 0, innerR, endAngle, startAngle, true);
      ctx.closePath();
    },
    svgPath(size) {
      const outerR = size * 0.5;
      const innerR = size * 0.26;
      const cutAngle = Math.PI / 3;
      const sa = cutAngle / 2;
      const ea = 2 * Math.PI - cutAngle / 2;
      const ox1 = outerR * Math.cos(sa), oy1 = outerR * Math.sin(sa);
      const ox2 = outerR * Math.cos(ea), oy2 = outerR * Math.sin(ea);
      const ix1 = innerR * Math.cos(ea), iy1 = innerR * Math.sin(ea);
      const ix2 = innerR * Math.cos(sa), iy2 = innerR * Math.sin(sa);
      return `<path d="M ${ox1} ${oy1} A ${outerR} ${outerR} 0 1 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 1 0 ${ix2} ${iy2} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M 7 12 A 14 14 0 1 1 7 -12 L 4 -7 A 8 8 0 1 0 4 7 Z" fill="currentColor"/></svg>`
  },

  line: {
    id: "line",
    name: "Straight Line",
    category: "linear",
    draw(ctx, size) {
      const len = size * 0.9;
      const th = Math.max(size * 0.14, 4);
      ctx.beginPath();
      ctx.rect(-len / 2, -th / 2, len, th);
      ctx.closePath();
    },
    svgPath(size) {
      const len = size * 0.9;
      const th = Math.max(size * 0.14, 4);
      return `<rect x="${-len/2}" y="${-th/2}" width="${len}" height="${th}" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><rect x="-14" y="-2.5" width="28" height="5" fill="currentColor"/></svg>`
  },

  arc: {
    id: "arc",
    name: "Quadrant Arc",
    category: "linear",
    draw(ctx, size) {
      const r = size * 0.55;
      const th = Math.max(size * 0.16, 4);
      ctx.beginPath();
      ctx.arc(-r / 2, r / 2, r, -Math.PI / 2, 0, false);
      ctx.arc(-r / 2, r / 2, r - th, 0, -Math.PI / 2, true);
      ctx.closePath();
    },
    svgPath(size) {
      const r = size * 0.55;
      const th = Math.max(size * 0.16, 4);
      return `<path d="M ${-r/2} ${-r/2} A ${r} ${r} 0 0 1 ${r/2} ${r/2} L ${r/2-th} ${r/2} A ${r-th} ${r-th} 0 0 0 ${-r/2} ${-r/2+th} Z" />`;
    },
    iconSvg: `<svg viewBox="-20 -20 40 40" class="w-4 h-4"><path d="M -8 -10 A 18 18 0 0 1 10 8 L 6 8 A 14 14 0 0 0 -8 -6 Z" fill="currentColor"/></svg>`
  }
};


  // Studio Composition Engine: Unified Grammar Pipeline for Wucius Wong 2D Design



const defaultStudioState = {
  // Primary Module Form A
  formA: {
    shape: "circle",
    scale: 110,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  },
  // Secondary Module Form B
  formB: {
    enabled: true,
    shape: "square",
    scale: 100,
    rotation: 0,
    offsetX: 65,
    offsetY: 0
  },
  // Interrelation between Form A and B
  interrelation: "overlapping", // detachment, touching, overlapping, penetration, union, subtraction, intersection, coincidence
  invertFigureGround: false,
  wireframe: false,

  // Modifiers Stack
  modifiers: {
    repetition: {
      enabled: false,
      gridType: "basic", // basic, sliding, sheared, curved, zigzag, triangular, alternating
      cols: 4,
      rows: 4,
      spacing: 0,
      shearAngle: 15,
      slideOffset: 0.5,
      curveIntensity: 18,
      activeClipping: false,
      showGridLines: false,
      gridLineWidth: 1.5,
      checkerInvert: false
    },
    structure: {
      enabled: false,
      mode: "rhythmic", // rhythmic (A:B:A:B cadence), compression
      colRatio: 1.8,
      rowRatio: 1.8,
      bandThickness: 3,
      showBands: false
    },
    similarity: {
      enabled: false,
      kinshipType: "distortion", // distortion, foreshortening, rotation_wobble, scale_kinship, hybrid
      intensity: 50, // 0 to 100
      cellJitter: 0, // 0 to 30
      seed: 42
    },
    gradation: {
      enabled: false,
      type: "rotation", // rotation, scale, depth, drift
      pathway: "diagonal", // diagonal, horizontal, vertical, concentric
      range: 180, // degrees or span
      steps: 1, // cycles (1 to 4)
      reverse: false
    },
    radiation: {
      enabled: false,
      scheme: "centrifugal", // centrifugal, concentric, spiral, multi_center
      rays: 12, // 4 to 28
      rings: 5, // 2 to 10
      spiralTwist: 45, // -180 to 180
      showRays: false,
      showRings: false,
      centerX: 0,
      centerY: 0
    },
    anomaly: {
      enabled: false,
      type: "focal", // focal, fracture, swell, tear
      epicenterX: 0.5, // 0.1 to 0.9
      epicenterY: 0.5, // 0.1 to 0.9
      radius: 160, // 50 to 350
      intensity: 65, // 10 to 100
      anomalousShape: "triangle_eq",
      highlightColor: true,
      showReticle: true
    },
    contrast: {
      enabled: false,
      dimension: "scale", // scale, shape, direction, tone
      dominanceRatio: 80, // % majority regular (60 to 95)
      contrastShape: "star4", // shape for shape contrast
      scaleFactor: 2.2, // scale multiplier for scale contrast
      angle: 45, // clash angle for direction contrast
      highlightContrast: false // highlight minority elements
    },
    concentration: {
      enabled: false,
      mode: "point", // point, void, line, free
      attractorX: 0.5,
      attractorY: 0.5,
      power: 65, // 20 to 100
      radius: 240, // 80 to 450
      lineAxis: "horizontal", // horizontal, vertical
      alignToField: true,
      densityScale: true,
      showAttractor: true
    },
    texture: {
      enabled: false,
      target: "shapes", // shapes, both, canvas
      mode: "grain", // grain, halftone, ribbing, typography
      density: 50, // 20 to 90
      scale: 14, // 6 to 36
      contrast: 40 // opacity 15 to 80
    },
    space: {
      enabled: false,
      mode: "isometric", // isometric, foreshortening, fluctuating, conflicting
      depth: 35, // 10 to 80
      angle: 30, // -60 to 60
      shading: 65, // 20 to 100
      showIsoGuides: false
    }
  },

  // Mat / Canvas display settings
  showSafeBounds: true,
  zoomLevel: 1.0
};

class StudioEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.state = JSON.parse(JSON.stringify(defaultStudioState));
  }

  // Get active principles list for the editorial colophon
  getActivePrinciples() {
    const list = ["FORM"];
    const hasRep = this.state.modifiers.repetition.enabled;
    const hasRad = this.state.modifiers.radiation.enabled;
    const hasGrid = hasRep || hasRad;

    if (hasRad) {
      list.push("RADIATION");
    } else if (hasRep) {
      list.push("REPETITION");
      if (this.state.modifiers.structure.enabled) list.push("STRUCTURE");
    }

    if (hasGrid) {
      if (this.state.modifiers.similarity.enabled) list.push("SIMILARITY");
      if (this.state.modifiers.gradation.enabled) list.push("GRADATION");
      if (this.state.modifiers.anomaly.enabled) list.push("ANOMALY");
      if (this.state.modifiers.contrast.enabled) list.push("CONTRAST");
    }

    if (this.state.modifiers.concentration.enabled && hasGrid) list.push("CONCENTRATION");
    if (this.state.modifiers.texture.enabled) list.push("TEXTURE");
    if (this.state.modifiers.space.enabled) list.push("SPACE");
    return list;
  }

  getColophonString() {
    return `USED ON THIS DESIGN: ${this.getActivePrinciples().join(" / ")}`;
  }

  // Draw a single shape helper with in-figure texture and illusory 3D space support
  drawShape(ctx, shapeId, size, fgColor, strokeOnly = false, lineWidth = 2, bgColor = null, isAlternating = false, skipSpace = false) {
    const shapeDef = Shapes[shapeId] || Shapes.circle;
    const space = this.state.modifiers.space;

    if (!space || !space.enabled || skipSpace) {
      this.drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor);
      return;
    }

    this.drawSpatialShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor, isAlternating, space);
  }

  // Draw flat shape with optional in-figure tactile texture
  drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly = false, lineWidth = 2, bgColor = null) {
    ctx.save();
    shapeDef.draw(ctx, size);

    if (strokeOnly) {
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    } else {
      ctx.fillStyle = fgColor;
      ctx.fill();

      // In-shape tactile texture (Chapter 11)
      const text = this.state.modifiers.texture;
      if (text && text.enabled && (text.target === "shapes" || text.target === "both")) {
        ctx.save();
        shapeDef.draw(ctx, size);
        ctx.clip();
        const etchColor = bgColor || (this.state.invertFigureGround ? "#111111" : "#FAFAFA");
        this.fillShapeTexture(ctx, size, fgColor, etchColor, text);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // Draw illusory 3D spatial form (Chapter 12: Space)
  drawSpatialShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor, isAlternating, space) {
    const mode = space.mode || "isometric";
    const depth = space.depth ?? 35;
    const angleRad = ((space.angle ?? 30) * Math.PI) / 180;
    const shading = (space.shading ?? 65) / 100;

    if (mode === "foreshortening") {
      // Fig. 73b: 3D Spatial Plane Tilt (Foreshortening)
      const tiltAmount = Math.sin(angleRad) * 0.45;
      const depthSquash = Math.max(0.2, 1 - (depth / 100) * 0.6);

      // Subtle cast shadow on ground plane
      ctx.save();
      ctx.translate(Math.cos(angleRad) * depth * 0.35, Math.sin(Math.abs(angleRad)) * depth * 0.4);
      ctx.scale(1, 0.28);
      ctx.fillStyle = fgColor;
      ctx.globalAlpha = 0.2 * shading;
      shapeDef.draw(ctx, size);
      ctx.fill();
      ctx.restore();

      // Floating tilted plane with depth projection
      ctx.save();
      ctx.transform(1, 0, tiltAmount, depthSquash, 0, 0);
      this.drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor);
      ctx.restore();

    } else if (mode === "fluctuating") {
      // Fig. 76b: Fluctuating Reversible Spatial Planes
      const dir = isAlternating ? -1 : 1;
      const totalDx = Math.cos(angleRad) * depth * dir;
      const totalDy = -Math.sin(angleRad) * depth * dir;
      const steps = Math.max(6, Math.min(20, Math.round(depth / 3)));

      if (strokeOnly) {
        // Wireframe fluctuating prism
        ctx.save();
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = 0.35;
        shapeDef.draw(ctx, size);
        ctx.stroke();

        ctx.save();
        ctx.translate(totalDx, totalDy);
        ctx.globalAlpha = 1.0;
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      } else {
        // Volumetric shaded slices with alternating facet contrast
        ctx.save();
        ctx.fillStyle = fgColor;
        const sideAlpha = isAlternating ? (0.2 + shading * 0.35) : (0.55 - shading * 0.25);
        ctx.globalAlpha = Math.max(0.12, Math.min(0.85, sideAlpha));

        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          ctx.save();
          ctx.translate(totalDx * t, totalDy * t);
          shapeDef.draw(ctx, size);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Front face
        ctx.save();
        ctx.translate(totalDx, totalDy);
        this.drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor);
        ctx.restore();
      }

    } else if (mode === "conflicting") {
      // Fig. 77: Conflicting Paradoxical Depth & Interlock
      const dx1 = Math.cos(angleRad) * depth * 0.85;
      const dy1 = -Math.sin(angleRad) * depth * 0.85;
      const dx2 = -Math.cos(angleRad) * depth * 0.65;
      const dy2 = Math.sin(angleRad) * depth * 0.65;

      if (strokeOnly) {
        ctx.save();
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = lineWidth;

        // Facet 1
        ctx.save();
        ctx.translate(dx1, dy1);
        ctx.globalAlpha = 0.5;
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();

        // Center
        ctx.globalAlpha = 1.0;
        shapeDef.draw(ctx, size);
        ctx.stroke();

        // Facet 2
        ctx.save();
        ctx.translate(dx2, dy2);
        ctx.globalAlpha = 0.5;
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      } else {
        // Secondary opposing paradoxical facet
        ctx.save();
        ctx.fillStyle = fgColor;
        ctx.globalAlpha = 0.3 * shading;
        for (let s = 1; s <= 6; s++) {
          const t = s / 6;
          ctx.save();
          ctx.translate(dx2 * t, dy2 * t);
          shapeDef.draw(ctx, size);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Primary forward facet
        ctx.save();
        ctx.fillStyle = fgColor;
        ctx.globalAlpha = 0.45 * shading;
        for (let s = 1; s <= 8; s++) {
          const t = s / 8;
          ctx.save();
          ctx.translate(dx1 * t, dy1 * t);
          shapeDef.draw(ctx, size);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Central plane
        this.drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor);

        // Paradoxical interlock cut line
        ctx.save();
        ctx.strokeStyle = bgColor || (this.state.invertFigureGround ? "#111111" : "#FAFAFA");
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(dx1 * 0.45, dy1 * 0.45);
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      }

    } else {
      // Default: Fig. 74d Isometric Volumetric Extrusion
      const totalDx = Math.cos(angleRad) * depth;
      const totalDy = -Math.sin(angleRad) * depth;
      const steps = Math.max(8, Math.min(28, Math.round(depth / 2.2)));

      if (strokeOnly) {
        // Wireframe extrusion
        ctx.save();
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = 0.35;
        shapeDef.draw(ctx, size);
        ctx.stroke();

        ctx.save();
        ctx.translate(totalDx, totalDy);
        ctx.globalAlpha = 1.0;
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      } else {
        // Volumetric shaded extrusion body
        ctx.save();
        ctx.fillStyle = fgColor;
        const sideAlpha = 0.15 + (1 - shading * 0.7) * 0.45;
        ctx.globalAlpha = Math.max(0.12, Math.min(0.85, sideAlpha));

        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          ctx.save();
          ctx.translate(totalDx * t, totalDy * t);
          shapeDef.draw(ctx, size);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();

        // Architectural facet edge contour
        ctx.save();
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3 * shading;
        shapeDef.draw(ctx, size);
        ctx.stroke();
        ctx.restore();

        // Front face (with texture if active)
        ctx.save();
        ctx.translate(totalDx, totalDy);
        this.drawFlatShape(ctx, shapeDef, size, fgColor, strokeOnly, lineWidth, bgColor);
        ctx.restore();
      }
    }
  }

  // Draw tactile texture strictly within the clipped silhouette of a shape (Chapter 11)
  fillShapeTexture(ctx, size, fgColor, etchColor, text) {
    const alpha = (text.contrast ?? 40) / 100;
    const density = (text.density ?? 50) / 100;
    const scale = text.scale ?? 14;

    ctx.save();

    if (text.mode === "grain") {
      // Lithographic tooth / stipple grain carved into the shape
      ctx.fillStyle = etchColor;
      ctx.globalAlpha = Math.min(0.85, alpha * 1.1);
      const dotSize = Math.max(1, scale * 0.12);
      const count = Math.floor(size * size * 0.08 * (0.5 + density));
      let s = 98765;
      const rng = () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return (s / 4294967296) * 2 - 1; // -1 to 1
      };
      for (let i = 0; i < count; i++) {
        const gx = rng() * size;
        const gy = rng() * size;
        ctx.fillRect(gx, gy, dotSize, dotSize);
      }
    } else if (text.mode === "halftone") {
      // Mechanical dot screen eroding the shape into a dot raster (Fig. 67c)
      ctx.fillStyle = etchColor;
      ctx.globalAlpha = Math.min(0.9, alpha * 1.25);
      const step = Math.max(4, Math.round(18 - density * 10));
      const maxDot = (step * 0.42) * (scale / 14);
      for (let y = -size; y <= size; y += step) {
        for (let x = -size; x <= size; x += step) {
          const dist = Math.hypot(x, y);
          const factor = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(dist * 0.08));
          const r = Math.max(0.6, maxDot * factor);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (text.mode === "ribbing") {
      // Parallel linear ribbing / hatching carved across the shape (Fig. 68a)
      ctx.strokeStyle = etchColor;
      ctx.lineWidth = Math.max(1, scale * 0.09);
      ctx.globalAlpha = Math.min(0.9, alpha * 1.2);
      const step = Math.max(3, Math.round(15 - density * 9));
      ctx.beginPath();
      for (let y = -size; y <= size; y += step) {
        ctx.moveTo(-size, y);
        ctx.lineTo(size, y);
      }
      ctx.stroke();
    } else if (text.mode === "typography") {
      // Typographic glyphs stamped inside the shape (Fig. 71)
      const letters = ["A", "B", "R", "X", "M", "Q", "S", "8", "■", "┼", "╱", "╲"];
      const step = Math.max(10, Math.round(24 - density * 12));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.round(scale * 0.85)}px "Space Grotesk", monospace, sans-serif`;
      ctx.fillStyle = etchColor;
      ctx.globalAlpha = Math.min(0.85, alpha * 1.15);

      for (let y = -size + step / 2; y <= size; y += step) {
        for (let x = -size + step / 2; x <= size; x += step) {
          const hash = Math.sin(y * 31.7 + x * 73.1) * 43758.5453;
          const rand = hash - Math.floor(hash);
          const char = letters[Math.floor(rand * letters.length)];
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rand - 0.5) * 0.5);
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }

  // Render the base unit form (Module) with interrelation operations
  renderModule(ctx, sizeMultiplier = 1, fgColor = "#111111", bgColor = "#FAFAFA", customScaleA = null, customScaleB = null, shapeOverrideA = null, wireframeOverride = null, isAlternating = false) {
    const { formA, formB, interrelation } = this.state;
    const wireframe = wireframeOverride !== null ? wireframeOverride : this.state.wireframe;
    const shapeA = shapeOverrideA || formA.shape;
    const rA = (customScaleA ?? formA.scale) * sizeMultiplier;
    const rB = (customScaleB ?? formB.scale) * sizeMultiplier;

    const ax = (formA.offsetX || 0) * sizeMultiplier;
    const ay = (formA.offsetY || 0) * sizeMultiplier;

    // If Form B is disabled, render just Form A
    if (!formB.enabled) {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate((formA.rotation * Math.PI) / 180);
      this.drawShape(ctx, shapeA, rA, fgColor, wireframe, 2, bgColor, isAlternating);
      ctx.restore();
      return;
    }

    // Determine actual offset based on interrelation mode
    let ox = formB.offsetX * sizeMultiplier;
    let oy = formB.offsetY * sizeMultiplier;

    if (interrelation === "touching") {
      const angle = Math.atan2(oy || 0.0001, ox || 1);
      const touchDist = (rA + rB) / 2;
      ox = Math.cos(angle) * touchDist;
      oy = Math.sin(angle) * touchDist;
    } else if (interrelation === "coincidence") {
      ox = ax;
      oy = ay;
    }

    ctx.save();

    // Handling 8 Interrelations
    switch (interrelation) {
      case "detachment":
      case "touching":
      case "overlapping": {
        // Draw Form A
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, shapeA, rA, fgColor, wireframe, 2, bgColor, isAlternating);
        ctx.restore();

        // Draw Form B (if overlapping, add fine outline separation for clarity)
        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);

        if (!wireframe && interrelation === "overlapping") {
          // Clean border cut around Form B to clearly distinguish layering
          ctx.save();
          this.drawShape(ctx, formB.shape, rB, bgColor, true, 3, bgColor, !isAlternating);
          ctx.restore();
        }

        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe, 2, bgColor, !isAlternating);
        ctx.restore();
        break;
      }

      case "union": {
        // Unified single silhouette
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, shapeA, rA, fgColor, wireframe, 2, bgColor, isAlternating);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe, 2, bgColor, !isAlternating);
        ctx.restore();
        break;
      }

      case "subtraction": {
        // Offscreen canvas technique to cut B out of A
        const pad = Math.max(rA, rB, Math.abs(ax), Math.abs(ay), Math.abs(ox), Math.abs(oy)) * 4 + 100;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = pad;
        offCanvas.height = pad;
        const offCtx = offCanvas.getContext("2d");
        const cx = pad / 2;
        const cy = pad / 2;

        offCtx.save();
        offCtx.translate(cx + ax, cy + ay);
        offCtx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(offCtx, shapeA, rA, fgColor, wireframe, 2, null, false, true);
        offCtx.restore();

        offCtx.save();
        offCtx.translate(cx + ox, cy + oy);
        offCtx.rotate((formB.rotation * Math.PI) / 180);
        offCtx.globalCompositeOperation = "destination-out";
        this.drawShape(offCtx, formB.shape, rB, fgColor, false, 2, null, false, true);
        offCtx.restore();

        ctx.drawImage(offCanvas, -cx, -cy);
        break;
      }

      case "intersection": {
        // Offscreen canvas technique: keep only overlap
        const pad = Math.max(rA, rB, Math.abs(ax), Math.abs(ay), Math.abs(ox), Math.abs(oy)) * 4 + 100;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = pad;
        offCanvas.height = pad;
        const offCtx = offCanvas.getContext("2d");
        const cx = pad / 2;
        const cy = pad / 2;

        offCtx.save();
        offCtx.translate(cx + ax, cy + ay);
        offCtx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(offCtx, shapeA, rA, fgColor, wireframe, 2, null, false, true);
        offCtx.restore();

        offCtx.save();
        offCtx.translate(cx + ox, cy + oy);
        offCtx.rotate((formB.rotation * Math.PI) / 180);
        offCtx.globalCompositeOperation = "destination-in";
        this.drawShape(offCtx, formB.shape, rB, fgColor, false, 2, null, false, true);
        offCtx.restore();

        ctx.drawImage(offCanvas, -cx, -cy);
        break;
      }

      case "penetration": {
        // Transparent overlap where intersecting area reverses or shows transparency
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, shapeA, rA, fgColor, wireframe, 2, bgColor, isAlternating);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        ctx.globalAlpha = 0.55;
        this.drawShape(ctx, formB.shape, rB, fgColor, wireframe, 2, bgColor, !isAlternating);
        ctx.restore();
        break;
      }

      case "coincidence": {
        // Form B perfectly aligned over Form A
        ctx.save();
        ctx.translate(ax, ay);
        ctx.rotate((formA.rotation * Math.PI) / 180);
        this.drawShape(ctx, shapeA, rA, fgColor, wireframe, 2, bgColor, isAlternating);
        ctx.restore();

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate((formB.rotation * Math.PI) / 180);
        this.drawShape(ctx, formB.shape, rB, bgColor, true, 2, bgColor, !isAlternating);
        ctx.restore();
        break;
      }
    }

    ctx.restore();
  }

  // Build the boundary path for a cell in the given grid variation
  buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX) {
    ctx.beginPath();
    if (rep.gridType === "sheared") {
      const rad = (rep.shearAngle * Math.PI) / 180;
      const dxTop = -(cH / 2) * Math.tan(rad);
      const dxBot = (cH / 2) * Math.tan(rad);
      ctx.moveTo(cx - cW / 2 + dxTop, cy - cH / 2);
      ctx.lineTo(cx + cW / 2 + dxTop, cy - cH / 2);
      ctx.lineTo(cx + cW / 2 + dxBot, cy + cH / 2);
      ctx.lineTo(cx - cW / 2 + dxBot, cy + cH / 2);
    } else if (rep.gridType === "triangular") {
      const isUp = (r + c) % 2 === 0;
      if (isUp) {
        ctx.moveTo(cx, cy - cH / 2);
        ctx.lineTo(cx + cW * 0.55, cy + cH / 2);
        ctx.lineTo(cx - cW * 0.55, cy + cH / 2);
      } else {
        ctx.moveTo(cx, cy + cH / 2);
        ctx.lineTo(cx + cW * 0.55, cy - cH / 2);
        ctx.lineTo(cx - cW * 0.55, cy - cH / 2);
      }
    } else if (rep.gridType === "curved") {
      const wTop = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
      const wBot = Math.sin(((r + 1) / rows) * Math.PI * 2) * rep.curveIntensity;
      const baseX = startX;
      ctx.moveTo(baseX + wTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + wTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + wBot, cy + cH / 2);
      ctx.lineTo(baseX + wBot, cy + cH / 2);
    } else if (rep.gridType === "zigzag") {
      const zTop = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const zBot = ((r + 1) % 2 === 0 ? 1 : -1) * rep.curveIntensity;
      const baseX = startX;
      ctx.moveTo(baseX + zTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + zTop, cy - cH / 2);
      ctx.lineTo(baseX + cW + zBot, cy + cH / 2);
      ctx.lineTo(baseX + zBot, cy + cH / 2);
    } else {
      // Basic orthogonal, sliding, alternating
      ctx.rect(cx - cW / 2 + 0.5, cy - cH / 2 + 0.5, cW - 1, cH - 1);
    }
    ctx.closePath();
  }

  // Render the repetition / structural grid with similarity and gradation kinematics
  renderRepetitionGrid(ctx, width, height, palette) {
    const rep = this.state.modifiers.repetition;
    const struct = this.state.modifiers.structure;
    const sim = this.state.modifiers.similarity;
    const grad = this.state.modifiers.gradation;
    const anom = this.state.modifiers.anomaly;
    const contrast = this.state.modifiers.contrast;
    const conc = this.state.modifiers.concentration;

    const cols = Math.max(1, rep.cols);
    const rows = Math.max(1, rep.rows);

    const margin = 40;
    const usableW = width - margin * 2;
    const usableH = height - margin * 2;

    // Calculate column widths and x positions (Dual rhythmic interval support)
    const colWidths = [];
    const colX = [];
    const colStarts = [];
    if (struct.enabled && struct.mode === "rhythmic") {
      const rA = struct.colRatio;
      let weightSum = 0;
      for (let c = 0; c < cols; c++) {
        weightSum += (c % 2 === 0 ? rA : 1.0);
      }
      const unitW = usableW / weightSum;
      let currX = margin;
      for (let c = 0; c < cols; c++) {
        const w = (c % 2 === 0 ? rA : 1.0) * unitW;
        colStarts.push(currX);
        colWidths.push(w);
        colX.push(currX + w / 2);
        currX += w;
      }
    } else {
      const cellW = usableW / cols;
      for (let c = 0; c < cols; c++) {
        colStarts.push(margin + c * cellW);
        colWidths.push(cellW);
        colX.push(margin + (c + 0.5) * cellW);
      }
    }

    // Calculate row heights and y positions (Dual rhythmic interval support)
    const rowHeights = [];
    const rowY = [];
    const rowStarts = [];
    if (struct.enabled && struct.mode === "rhythmic") {
      const rA = struct.rowRatio;
      let weightSum = 0;
      for (let r = 0; r < rows; r++) {
        weightSum += (r % 2 === 0 ? rA : 1.0);
      }
      const unitH = usableH / weightSum;
      let currY = margin;
      for (let r = 0; r < rows; r++) {
        const h = (r % 2 === 0 ? rA : 1.0) * unitH;
        rowStarts.push(currY);
        rowHeights.push(h);
        rowY.push(currY + h / 2);
        currY += h;
      }
    } else {
      const cellH = usableH / rows;
      for (let r = 0; r < rows; r++) {
        rowStarts.push(margin + r * cellH);
        rowHeights.push(cellH);
        rowY.push(margin + (r + 0.5) * cellH);
      }
    }

    // Wrap in outer bounding clip so shapes never bleed outside grid canvas
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, usableW, usableH);
    ctx.clip();

    const seed = sim.seed || 42;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cW = colWidths[c];
        const cH = rowHeights[r];
        let cx = colX[c];
        let cy = rowY[r];
        const startX = colStarts[c];

        // Apply grid deformations to center coordinates
        if (rep.gridType === "sliding") {
          if (r % 2 === 1) cx += cW * rep.slideOffset;
        } else if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          cx += (r - rows / 2) * Math.tan(rad) * (cH * 0.6);
        } else if (rep.gridType === "curved") {
          const wave = Math.sin((r / rows) * Math.PI * 2) * rep.curveIntensity;
          cx += wave;
        } else if (rep.gridType === "zigzag") {
          const zig = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
          cx += zig;
        } else if (rep.gridType === "triangular") {
          if (r % 2 === 1) cx += cW * 0.5;
        }

        // Similarity PRNG helper
        const pRand = (salt) => {
          const x = Math.sin(seed * 997 + r * 1337 + c * 31 + salt * 101) * 10000;
          return (x - Math.floor(x)) * 2 - 1; // -1 to 1
        };

        // Similarity: cell spatial jitter
        if (sim.enabled && sim.cellJitter > 0) {
          cx += pRand(10) * sim.cellJitter;
          cy += pRand(11) * sim.cellJitter;
        }

        // Concentration Field Displacement & Density Kinematics (Chapter 10)
        let concAngle = 0;
        let concScaleMul = 1.0;
        if (conc && conc.enabled) {
          const attX = (conc.attractorX ?? 0.5) * width;
          const attY = (conc.attractorY ?? 0.5) * height;
          const power = (conc.power ?? 65) / 100;
          const radius = conc.radius ?? 240;

          if (conc.mode === "point") {
            const dist = Math.hypot(cx - attX, cy - attY);
            if (dist < radius) {
              const factor = Math.pow(1 - dist / radius, 1.4) * power;
              const pull = factor * (radius * 0.45);
              const angle = Math.atan2(attY - cy, attX - cx);
              cx += Math.cos(angle) * pull;
              cy += Math.sin(angle) * pull;
              concAngle = angle;
              if (conc.densityScale) concScaleMul = 0.55 + (dist / radius) * 0.7;
            }
          } else if (conc.mode === "void") {
            const dist = Math.hypot(cx - attX, cy - attY);
            if (dist < radius) {
              const factor = Math.pow(1 - dist / radius, 1.2) * power;
              const push = factor * (radius * 0.55);
              const angle = Math.atan2(cy - attY, cx - attX);
              cx += Math.cos(angle) * push;
              cy += Math.sin(angle) * push;
              concAngle = angle + Math.PI / 2;
              if (conc.densityScale) concScaleMul = 0.4 + (dist / radius) * 0.8;
            }
          } else if (conc.mode === "line") {
            if (conc.lineAxis === "vertical") {
              const distX = Math.abs(cx - attX);
              if (distX < radius) {
                const factor = Math.pow(1 - distX / radius, 1.4) * power;
                const pullX = (attX - cx) * factor * 0.75;
                cx += pullX;
                concAngle = (attX >= cx ? 0 : Math.PI);
                if (conc.densityScale) concScaleMul = 0.65 + (distX / radius) * 0.6;
              }
            } else {
              const distY = Math.abs(cy - attY);
              if (distY < radius) {
                const factor = Math.pow(1 - distY / radius, 1.4) * power;
                const pullY = (attY - cy) * factor * 0.75;
                cy += pullY;
                concAngle = (attY >= cy ? Math.PI / 2 : -Math.PI / 2);
                if (conc.densityScale) concScaleMul = 0.65 + (distY / radius) * 0.6;
              }
            }
          } else if (conc.mode === "free") {
            const att2X = width - attX;
            const att2Y = height - attY;
            const dist1 = Math.hypot(cx - attX, cy - attY);
            const dist2 = Math.hypot(cx - att2X, cy - att2Y);
            const nearestDist = Math.min(dist1, dist2);
            const targetX = dist1 < dist2 ? attX : att2X;
            const targetY = dist1 < dist2 ? attY : att2Y;
            if (nearestDist < radius) {
              const factor = Math.pow(1 - nearestDist / radius, 1.4) * power;
              const pull = factor * (radius * 0.4);
              const angle = Math.atan2(targetY - cy, targetX - cx);
              cx += Math.cos(angle) * pull;
              cy += Math.sin(angle) * pull;
              concAngle = angle;
              if (conc.densityScale) concScaleMul = 0.65 + (nearestDist / radius) * 0.6;
            }
          }
        }

        ctx.save();

        const isOddCell = (r + c) % 2 === 1;
        let fgColor = palette.fg;
        let bgColor = palette.bg;

        // Checkerboard inversion
        if (rep.checkerInvert && isOddCell) {
          ctx.save();
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX);
          ctx.fillStyle = palette.fg;
          ctx.fill();
          ctx.restore();
          fgColor = palette.bg;
          bgColor = palette.fg;
        }

        // Active clipping: restrict drawing strictly to cell boundaries
        if (rep.activeClipping) {
          this.buildCellPath(ctx, r, c, rows, cols, cx, cy, cW, cH, rep, startX);
          ctx.clip();
        }

        ctx.translate(cx, cy);

        // Concentration directional flow
        if (conc && conc.enabled && conc.alignToField && concAngle !== 0) {
          ctx.rotate(concAngle);
        }

        // Alternating mirror / rotation
        if (rep.gridType === "alternating" && isOddCell) {
          ctx.rotate(Math.PI);
        }

        // Gradation kinematics across Cartesian pathways
        if (grad.enabled) {
          let t = 0;
          if (grad.pathway === "horizontal") {
            t = cols > 1 ? c / (cols - 1) : 0;
          } else if (grad.pathway === "vertical") {
            t = rows > 1 ? r / (rows - 1) : 0;
          } else if (grad.pathway === "diagonal") {
            t = (cols + rows > 2) ? (c + r) / (cols + rows - 2) : 0;
          } else if (grad.pathway === "concentric") {
            const dc = c - (cols - 1) / 2;
            const dr = r - (rows - 1) / 2;
            const maxD = Math.sqrt(Math.pow((cols - 1) / 2, 2) + Math.pow((rows - 1) / 2, 2)) || 1;
            t = Math.sqrt(dc * dc + dr * dr) / maxD;
          }

          if (grad.reverse) t = 1 - t;
          t = (t * (grad.steps || 1)) % 1.0001;

          if (grad.type === "rotation") {
            const rotSpan = ((grad.range ?? 180) * Math.PI) / 180;
            ctx.rotate(t * rotSpan);
          } else if (grad.type === "scale") {
            const sFactor = 0.35 + t * 1.1;
            ctx.scale(sFactor, sFactor);
          } else if (grad.type === "depth") {
            ctx.rotate(Math.PI / 6);
            ctx.scale(1, Math.max(0.18, 1 - t * 0.82));
            ctx.rotate(-Math.PI / 6);
          } else if (grad.type === "drift") {
            ctx.translate(t * (cW * 0.28), 0);
          }
        }

        // Similarity: Module Kinship & Fluctuation
        if (sim.enabled) {
          const intensity = (sim.intensity ?? 50) / 100;
          if (sim.kinshipType === "distortion") {
            const sx = 1 + pRand(1) * intensity * 0.65;
            const sy = 1 + pRand(2) * intensity * 0.65;
            ctx.scale(sx, sy);
          } else if (sim.kinshipType === "foreshortening") {
            const rot = pRand(3) * Math.PI;
            const tilt = Math.max(0.18, 1 - Math.abs(pRand(4)) * intensity * 0.82);
            ctx.rotate(rot);
            ctx.scale(1, tilt);
            ctx.rotate(-rot);
          } else if (sim.kinshipType === "rotation_wobble") {
            const wobble = pRand(5) * intensity * (Math.PI / 2);
            ctx.rotate(wobble);
          } else if (sim.kinshipType === "scale_kinship") {
            const sFactor = Math.max(0.2, 1 + pRand(6) * intensity * 0.7);
            ctx.scale(sFactor, sFactor);
          } else if (sim.kinshipType === "hybrid") {
            const sx = 1 + pRand(1) * intensity * 0.35;
            const sy = 1 + pRand(2) * intensity * 0.35;
            const wobble = pRand(5) * intensity * 0.4;
            ctx.rotate(wobble);
            ctx.scale(sx, sy);
          }
        }

        // Anomaly & Contrast Modifiers
        let cellShapeA = null;
        let cellWireframe = null;
        let cellFg = fgColor;
        let cellBg = bgColor;
        let cellScaleMul = 1;

        if (anom.enabled) {
          const epiX = (anom.epicenterX ?? 0.5) * width;
          const epiY = (anom.epicenterY ?? 0.5) * height;
          const dist = Math.hypot(cx - epiX, cy - epiY);
          const inZone = dist < anom.radius;
          const factor = inZone ? (1 - dist / anom.radius) : 0;
          const severity = (anom.intensity ?? 65) / 100;

          if (anom.type === "focal") {
            const focalRadius = Math.max(cW, cH) * 0.75;
            if (dist < focalRadius) {
              cellShapeA = anom.anomalousShape || "triangle_eq";
              ctx.rotate((Math.PI / 4) * severity);
              cellScaleMul *= (1 + 0.35 * severity);
              if (anom.highlightColor) cellFg = palette.accent;
            }
          } else if (anom.type === "fracture") {
            const corridor = anom.radius * 0.45;
            if (Math.abs(cx - epiX) < corridor) {
              const jag = Math.sin(cy * 0.08) * (18 * severity);
              const shearY = (cy > epiY ? 1 : -1) * (36 * severity) + jag;
              const shearX = (cx > epiX ? 1 : -1) * (10 * severity);
              ctx.translate(shearX, shearY);
              ctx.rotate((factor * severity * Math.PI) / 3.2);
              if (factor > 0.4 && anom.highlightColor) cellFg = palette.accent;
            }
          } else if (anom.type === "swell") {
            if (inZone) {
              const angle = Math.atan2(cy - epiY, cx - epiX);
              const push = Math.sin(factor * Math.PI) * (42 * severity);
              ctx.translate(Math.cos(angle) * push, Math.sin(angle) * push);
              const sFactor = 1 + factor * 0.55 * severity;
              ctx.scale(sFactor, sFactor);
              if (factor > 0.65 && anom.highlightColor) cellFg = palette.accent;
            }
          } else if (anom.type === "tear") {
            if (factor > 0.6) {
              // Disintegrated void
              ctx.restore();
              continue;
            } else if (factor > 0.15) {
              // Shattered debris
              ctx.translate(pRand(51) * 26 * severity, pRand(52) * 26 * severity);
              ctx.rotate(pRand(53) * Math.PI * severity);
              const shrink = Math.max(0.15, 1 - factor * 0.85);
              ctx.scale(shrink, shrink);
              if (anom.highlightColor && factor > 0.3) cellFg = palette.accent;
            }
          }
        }

        if (contrast.enabled) {
          const k = r * cols + c;
          const hash = Math.abs(Math.sin(k * 137.5 + 43.1) * 10000) % 100;
          const isMinority = hash >= (contrast.dominanceRatio ?? 80);
          if (isMinority) {
            if (contrast.dimension === "scale") {
              const sFactor = contrast.scaleFactor ?? 2.2;
              cellScaleMul *= sFactor;
            } else if (contrast.dimension === "shape") {
              cellShapeA = contrast.contrastShape || "star4";
            } else if (contrast.dimension === "direction") {
              const clashAngle = ((contrast.angle ?? 45) * Math.PI) / 180;
              ctx.rotate(clashAngle);
            } else if (contrast.dimension === "tone") {
              cellWireframe = true;
            }
            if (contrast.highlightContrast) {
              cellFg = palette.accent;
            }
          }
        }

        const isAlt = (r + c) % 2 === 1;
        this.renderModule(ctx, normScale, cellFg, cellBg, null, null, cellShapeA, cellWireframe, isAlt);
        ctx.restore();
      }
    }

    ctx.restore(); // end outer clip

    // Optional visible structure grid lines
    if (rep.showGridLines || (struct.enabled && struct.showBands)) {
      ctx.save();
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = struct.enabled && struct.showBands ? struct.bandThickness : rep.gridLineWidth;

      // Draw horizontal lines
      for (let r = 0; r <= rows; r++) {
        const y = r === rows ? margin + usableH : rowStarts[r];
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Draw vertical / deformed lines
      for (let c = 0; c <= cols; c++) {
        const baseX = c === cols ? margin + usableW : colStarts[c];
        ctx.beginPath();

        if (rep.gridType === "sheared") {
          const rad = (rep.shearAngle * Math.PI) / 180;
          const topX = baseX - (rows / 2) * Math.tan(rad) * (rowHeights[0] * 0.6);
          const botX = baseX + (rows / 2) * Math.tan(rad) * (rowHeights[0] * 0.6);
          ctx.moveTo(topX, margin);
          ctx.lineTo(botX, height - margin);
        } else if (rep.gridType === "curved") {
          ctx.moveTo(baseX, margin);
          const steps = 30;
          for (let s = 1; s <= steps; s++) {
            const frac = s / steps;
            const y = margin + frac * usableH;
            const wave = Math.sin(frac * Math.PI * 2) * rep.curveIntensity;
            ctx.lineTo(baseX + wave, y);
          }
        } else if (rep.gridType === "zigzag") {
          ctx.moveTo(baseX, margin);
          for (let r = 0; r < rows; r++) {
            const zig = (r % 2 === 0 ? 1 : -1) * rep.curveIntensity;
            ctx.lineTo(baseX + zig, margin + (r + 1) * rowHeights[r]);
          }
        } else {
          ctx.moveTo(baseX, margin);
          ctx.lineTo(baseX, height - margin);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    // Anomaly reticle guide overlay
    if (anom.enabled && anom.showReticle) {
      const epiX = (anom.epicenterX ?? 0.5) * width;
      const epiY = (anom.epicenterY ?? 0.5) * height;
      ctx.save();
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Influence radius boundary
      ctx.beginPath();
      ctx.arc(epiX, epiY, anom.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Precision target reticle
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(epiX, epiY, 6, 0, Math.PI * 2);
      ctx.moveTo(epiX - 14, epiY);
      ctx.lineTo(epiX + 14, epiY);
      ctx.moveTo(epiX, epiY - 14);
      ctx.lineTo(epiX, epiY + 14);
      ctx.stroke();
      ctx.restore();
    }

    // Concentration attractor guide overlay
    if (conc && conc.enabled && conc.showAttractor) {
      this.drawAttractorGuide(ctx, width, height, palette, conc);
    }
  }

  // Render the polar radiation layout (Chapter 7)
  renderRadiation(ctx, width, height, palette) {
    const rad = this.state.modifiers.radiation;
    const grad = this.state.modifiers.gradation;
    const sim = this.state.modifiers.similarity;
    const anom = this.state.modifiers.anomaly;
    const contrast = this.state.modifiers.contrast;
    const conc = this.state.modifiers.concentration;

    const margin = 35;
    const usableW = width - margin * 2;
    const usableH = height - margin * 2;
    const maxR = Math.min(usableW, usableH) / 2;

    const cx = width / 2 + (rad.centerX || 0);
    const cy = height / 2 + (rad.centerY || 0);

    const rays = Math.max(4, rad.rays);
    const rings = Math.max(2, rad.rings);
    const twistRad = ((rad.spiralTwist || 0) * Math.PI) / 180;

    // Centers list (if multi_center, we have two focal centers creating Moiré)
    const centers = rad.scheme === "multi_center"
      ? [
          { x: cx - maxR * 0.35, y: cy },
          { x: cx + maxR * 0.35, y: cy }
        ]
      : [{ x: cx, y: cy }];

    // Clip to usable area
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, usableW, usableH);
    ctx.clip();

    const seed = sim.seed || 42;

    centers.forEach((center, centerIdx) => {
      for (let i = 1; i <= rings; i++) {
        const ringRadius = (i / rings) * maxR;

        for (let j = 0; j < rays; j++) {
          const baseAngle = (j / rays) * Math.PI * 2;
          let angle = baseAngle;

          // Spiral twist
          if (rad.scheme === "spiral") {
            angle += twistRad * (i / rings);
          }

          const x = center.x + ringRadius * Math.cos(angle);
          const y = center.y + ringRadius * Math.sin(angle);

          let posX = x;
          let posY = y;
          let concAngle = 0;
          let concScaleMul = 1.0;

          if (conc && conc.enabled) {
            const attX = (conc.attractorX ?? 0.5) * width;
            const attY = (conc.attractorY ?? 0.5) * height;
            const power = (conc.power ?? 65) / 100;
            const radius = conc.radius ?? 240;

            if (conc.mode === "point") {
              const dist = Math.hypot(posX - attX, posY - attY);
              if (dist < radius) {
                const factor = Math.pow(1 - dist / radius, 1.4) * power;
                const pull = factor * (radius * 0.45);
                const a = Math.atan2(attY - posY, attX - posX);
                posX += Math.cos(a) * pull;
                posY += Math.sin(a) * pull;
                concAngle = a;
                if (conc.densityScale) concScaleMul = 0.55 + (dist / radius) * 0.7;
              }
            } else if (conc.mode === "void") {
              const dist = Math.hypot(posX - attX, posY - attY);
              if (dist < radius) {
                const factor = Math.pow(1 - dist / radius, 1.2) * power;
                const push = factor * (radius * 0.55);
                const a = Math.atan2(posY - attY, posX - attX);
                posX += Math.cos(a) * push;
                posY += Math.sin(a) * push;
                concAngle = a + Math.PI / 2;
                if (conc.densityScale) concScaleMul = 0.4 + (dist / radius) * 0.8;
              }
            } else if (conc.mode === "line") {
              if (conc.lineAxis === "vertical") {
                const distX = Math.abs(posX - attX);
                if (distX < radius) {
                  const factor = Math.pow(1 - distX / radius, 1.4) * power;
                  posX += (attX - posX) * factor * 0.75;
                  concAngle = (attX >= posX ? 0 : Math.PI);
                  if (conc.densityScale) concScaleMul = 0.65 + (distX / radius) * 0.6;
                }
              } else {
                const distY = Math.abs(posY - attY);
                if (distY < radius) {
                  const factor = Math.pow(1 - distY / radius, 1.4) * power;
                  posY += (attY - posY) * factor * 0.75;
                  concAngle = (attY >= posY ? Math.PI / 2 : -Math.PI / 2);
                  if (conc.densityScale) concScaleMul = 0.65 + (distY / radius) * 0.6;
                }
              }
            } else if (conc.mode === "free") {
              const att2X = width - attX;
              const att2Y = height - attY;
              const dist1 = Math.hypot(posX - attX, posY - attY);
              const dist2 = Math.hypot(posX - att2X, posY - att2Y);
              const nearestDist = Math.min(dist1, dist2);
              const targetX = dist1 < dist2 ? attX : att2X;
              const targetY = dist1 < dist2 ? attY : att2Y;
              if (nearestDist < radius) {
                const factor = Math.pow(1 - nearestDist / radius, 1.4) * power;
                const pull = factor * (radius * 0.4);
                const a = Math.atan2(targetY - posY, targetX - posX);
                posX += Math.cos(a) * pull;
                posY += Math.sin(a) * pull;
                concAngle = a;
                if (conc.densityScale) concScaleMul = 0.65 + (nearestDist / radius) * 0.6;
              }
            }
          }

          // Check bounds
          if (posX < margin || posX > width - margin || posY < margin || posY > height - margin) continue;

          ctx.save();
          ctx.translate(posX, posY);

          // Concentration directional flow
          if (conc && conc.enabled && conc.alignToField && concAngle !== 0) {
            ctx.rotate(concAngle);
          }

          // Base radiation orientation
          if (rad.scheme === "centrifugal" || rad.scheme === "multi_center") {
            ctx.rotate(angle + Math.PI / 2);
          } else if (rad.scheme === "concentric") {
            ctx.rotate(angle);
          } else if (rad.scheme === "spiral") {
            ctx.rotate(angle + Math.PI / 2 + (twistRad * 0.35));
          }

          // Gradation on polar radiation
          if (grad.enabled) {
            let t = (grad.pathway === "concentric" || grad.pathway === "diagonal") 
              ? (i / rings) 
              : (j / rays);
            if (grad.reverse) t = 1 - t;
            t = (t * (grad.steps || 1)) % 1.0001;

            if (grad.type === "rotation") {
              ctx.rotate(t * (((grad.range ?? 180) * Math.PI) / 180));
            } else if (grad.type === "scale") {
              const sFactor = 0.35 + t * 1.1;
              ctx.scale(sFactor, sFactor);
            } else if (grad.type === "depth") {
              ctx.rotate(0.3);
              ctx.scale(1, Math.max(0.2, 1 - t * 0.75));
              ctx.rotate(-0.3);
            }
          }

          // Similarity on radiation
          if (sim.enabled) {
            const pRand = (salt) => {
              const val = Math.sin(seed * 997 + (i * 100 + j + centerIdx * 1000) * 31 + salt * 101) * 10000;
              return (val - Math.floor(val)) * 2 - 1;
            };
            const intensity = (sim.intensity ?? 50) / 100;
            if (sim.kinshipType === "distortion") {
              ctx.scale(1 + pRand(1) * intensity * 0.5, 1 + pRand(2) * intensity * 0.5);
            } else if (sim.kinshipType === "foreshortening") {
              const rRot = pRand(3) * Math.PI;
              ctx.rotate(rRot);
              ctx.scale(1, Math.max(0.2, 1 - Math.abs(pRand(4)) * intensity * 0.8));
              ctx.rotate(-rRot);
            } else if (sim.kinshipType === "rotation_wobble") {
              ctx.rotate(pRand(5) * intensity * (Math.PI / 2));
            } else if (sim.kinshipType === "scale_kinship") {
              const sFactor = Math.max(0.2, 1 + pRand(6) * intensity * 0.6);
              ctx.scale(sFactor, sFactor);
            }
          }

          // Anomaly & Contrast on radiation module
          let cellShapeA = null;
          let cellWireframe = null;
          let cellFg = palette.fg;
          let cellBg = palette.bg;
          let cellScaleMul = 1;

          if (anom.enabled) {
            const epiX = (anom.epicenterX ?? 0.5) * width;
            const epiY = (anom.epicenterY ?? 0.5) * height;
            const dist = Math.hypot(x - epiX, y - epiY);
            const inZone = dist < anom.radius;
            const factor = inZone ? (1 - dist / anom.radius) : 0;
            const severity = (anom.intensity ?? 65) / 100;

            if (anom.type === "focal") {
              const focalRadius = maxR * 0.28;
              if (dist < focalRadius) {
                cellShapeA = anom.anomalousShape || "triangle_eq";
                ctx.rotate((Math.PI / 4) * severity);
                cellScaleMul *= (1 + 0.35 * severity);
                if (anom.highlightColor) cellFg = palette.accent;
              }
            } else if (anom.type === "fracture") {
              const corridor = anom.radius * 0.45;
              if (Math.abs(x - epiX) < corridor) {
                const jag = Math.sin(y * 0.08) * (18 * severity);
                const shearY = (y > epiY ? 1 : -1) * (36 * severity) + jag;
                const shearX = (x > epiX ? 1 : -1) * (10 * severity);
                ctx.translate(shearX, shearY);
                ctx.rotate((factor * severity * Math.PI) / 3.2);
                if (factor > 0.4 && anom.highlightColor) cellFg = palette.accent;
              }
            } else if (anom.type === "swell") {
              if (inZone) {
                const angleToEpi = Math.atan2(y - epiY, x - epiX);
                const push = Math.sin(factor * Math.PI) * (42 * severity);
                ctx.translate(Math.cos(angleToEpi) * push, Math.sin(angleToEpi) * push);
                const sFactor = 1 + factor * 0.55 * severity;
                ctx.scale(sFactor, sFactor);
                if (factor > 0.65 && anom.highlightColor) cellFg = palette.accent;
              }
            } else if (anom.type === "tear") {
              if (factor > 0.6) {
                ctx.restore();
                continue;
              } else if (factor > 0.15) {
                const rRand = ((seed * 997 + i * 31 + j * 7) % 100) / 100;
                ctx.translate((rRand - 0.5) * 26 * severity, (1 - rRand - 0.5) * 26 * severity);
                ctx.rotate(rRand * Math.PI * severity);
                const shrink = Math.max(0.15, 1 - factor * 0.85);
                ctx.scale(shrink, shrink);
                if (anom.highlightColor && factor > 0.3) cellFg = palette.accent;
              }
            }
          }

          if (contrast.enabled) {
            const k = centerIdx * 1000 + i * rays + j;
            const hash = Math.abs(Math.sin(k * 137.5 + 43.1) * 10000) % 100;
            const isMinority = hash >= (contrast.dominanceRatio ?? 80);
            if (isMinority) {
              if (contrast.dimension === "scale") {
                const sFactor = contrast.scaleFactor ?? 2.2;
                cellScaleMul *= sFactor;
              } else if (contrast.dimension === "shape") {
                cellShapeA = contrast.contrastShape || "star4";
              } else if (contrast.dimension === "direction") {
                const clashAngle = ((contrast.angle ?? 45) * Math.PI) / 180;
                ctx.rotate(clashAngle);
              } else if (contrast.dimension === "tone") {
                cellWireframe = true;
              }
              if (contrast.highlightContrast) {
                cellFg = palette.accent;
              }
            }
          }

          // Natural centrifugal growth scale: outer modules larger, inner smaller
          const growthScale = (0.28 + (i / rings) * 0.42) * cellScaleMul * concScaleMul;
          const isAlt = (i + j) % 2 === 1;
          this.renderModule(ctx, growthScale * (rad.scheme === "multi_center" ? 0.65 : 0.85), cellFg, cellBg, null, null, cellShapeA, cellWireframe, isAlt);
          ctx.restore();
        }
      }
    });

    ctx.restore(); // end outer clip

    // Structural visible guides
    if (rad.showRings || rad.showRays) {
      ctx.save();
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;

      centers.forEach(center => {
        if (rad.showRings) {
          for (let i = 1; i <= rings; i++) {
            const r = (i / rings) * maxR;
            ctx.beginPath();
            ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (rad.showRays) {
          for (let j = 0; j < rays; j++) {
            const baseAngle = (j / rays) * Math.PI * 2;
            ctx.beginPath();
            if (rad.scheme === "spiral") {
              ctx.moveTo(center.x, center.y);
              const steps = 24;
              for (let s = 1; s <= steps; s++) {
                const frac = s / steps;
                const r = frac * maxR;
                const a = baseAngle + twistRad * frac;
                ctx.lineTo(center.x + r * Math.cos(a), center.y + r * Math.sin(a));
              }
            } else {
              ctx.moveTo(center.x, center.y);
              ctx.lineTo(center.x + maxR * Math.cos(baseAngle), center.y + maxR * Math.sin(baseAngle));
            }
            ctx.stroke();
          }
        }
      });

      ctx.restore();
    }

    // Anomaly reticle guide overlay on radiation
    if (anom.enabled && anom.showReticle) {
      const epiX = (anom.epicenterX ?? 0.5) * width;
      const epiY = (anom.epicenterY ?? 0.5) * height;
      ctx.save();
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Influence radius boundary
      ctx.beginPath();
      ctx.arc(epiX, epiY, anom.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Precision target reticle
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(epiX, epiY, 6, 0, Math.PI * 2);
      ctx.moveTo(epiX - 14, epiY);
      ctx.lineTo(epiX + 14, epiY);
      ctx.moveTo(epiX, epiY - 14);
      ctx.lineTo(epiX, epiY + 14);
      ctx.stroke();
      ctx.restore();
    }

    // Concentration attractor guide overlay on radiation
    if (conc && conc.enabled && conc.showAttractor) {
      this.drawAttractorGuide(ctx, width, height, palette, conc);
    }
  }

  // Master render method
  render(palette) {
    if (!this.canvas) return;
    const { ctx, width, height } = CanvasUtils.setupCanvas(this.canvas);

    // 1. Clear background
    ctx.save();
    ctx.fillStyle = this.state.invertFigureGround ? palette.fg : palette.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const fgColor = this.state.invertFigureGround ? palette.bg : palette.fg;
    const bgColor = this.state.invertFigureGround ? palette.fg : palette.bg;

    // 2. Architectural Guide Grid & Safe Bounds (faint red grid matching wireframe)
    if (this.state.showSafeBounds) {
      ctx.save();
      const margin = 28;

      // Draw faint red architectural coordinate grid
      ctx.strokeStyle = palette.accent;
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      const gridSize = 48;
      for (let x = margin; x <= width - margin; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
      }
      for (let y = margin; y <= height - margin; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
      }

      // Dashed red outer safe boundary
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      ctx.restore();
    }

    // 2.5 Isometric Drafting Guides (Chapter 12: Space)
    if (this.state.modifiers.space.enabled && this.state.modifiers.space.showIsoGuides) {
      this.drawIsometricGuides(ctx, width, height, palette);
    }

    // 3. Render Pipeline: Radiation takes spatial precedence over Cartesian grid
    if (this.state.modifiers.radiation.enabled) {
      this.renderRadiation(ctx, width, height, palette);
    } else if (this.state.modifiers.repetition.enabled) {
      this.renderRepetitionGrid(ctx, width, height, palette);
    } else {
      // Single Module Study in Center (Pure Form A & Form B Base Unit)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      this.renderModule(ctx, 1.25, fgColor, bgColor);
      ctx.restore();
    }

    // 4. Subtle center reference dot (when in single module mode)
    if (!this.state.modifiers.repetition.enabled && !this.state.modifiers.structure.enabled && !this.state.modifiers.radiation.enabled) {
      ctx.save();
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Tactile Texture Rendering (Chapter 11)
    if (this.state.modifiers.texture.enabled) {
      this.renderTexture(ctx, width, height, palette);
    }
  }

  // Concentration Attractor Field Guide (Chapter 10)
  drawAttractorGuide(ctx, width, height, palette, conc) {
    const attX = (conc.attractorX ?? 0.5) * width;
    const attY = (conc.attractorY ?? 0.5) * height;
    const radius = conc.radius ?? 240;

    ctx.save();
    ctx.strokeStyle = palette.accent;
    ctx.fillStyle = palette.accent;

    if (conc.mode === "line") {
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      if (conc.lineAxis === "vertical") {
        ctx.moveTo(attX, 0);
        ctx.lineTo(attX, height);
      } else {
        ctx.moveTo(0, attY);
        ctx.lineTo(width, attY);
      }
      ctx.stroke();

      // Influence boundary lines
      ctx.globalAlpha = 0.18;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      if (conc.lineAxis === "vertical") {
        ctx.moveTo(attX - radius, 0);
        ctx.lineTo(attX - radius, height);
        ctx.moveTo(attX + radius, 0);
        ctx.lineTo(attX + radius, height);
      } else {
        ctx.moveTo(0, attY - radius);
        ctx.lineTo(width, attY - radius);
        ctx.moveTo(0, attY + radius);
        ctx.lineTo(width, attY + radius);
      }
      ctx.stroke();
    } else {
      // Concentric gravitational rings
      const rings = [radius * 0.35, radius * 0.7, radius];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.15 + (3 - idx) * 0.12;
        ctx.arc(attX, attY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Central attractor point
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(attX, attY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (conc.mode === "free") {
        // Complementary node for dual hotspot
        const att2X = width - attX;
        const att2Y = height - attY;
        ctx.beginPath();
        ctx.arc(att2X, att2Y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(att2X, att2Y, radius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 30° Isometric Construction Guide Grid (Chapter 12: Space)
  drawIsometricGuides(ctx, width, height, palette) {
    ctx.save();
    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.35;
    ctx.setLineDash([2, 4]);

    const spacing = 36;
    const tan30 = Math.tan((30 * Math.PI) / 180); // ~0.57735
    const extendX = height / tan30;

    // 30 degree diagonal lines (ascending)
    for (let x = -extendX; x <= width + extendX; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + extendX, 0);
      ctx.stroke();
    }

    // -30 degree diagonal lines (descending)
    for (let x = -extendX; x <= width + extendX; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + extendX, height);
      ctx.stroke();
    }

    // Vertical construction lines
    for (let x = 0; x <= width; x += spacing * 1.5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Tactile Texture Engine (Chapter 11) - Canvas-wide surface plate
  renderTexture(ctx, width, height, palette) {
    const text = this.state.modifiers.texture;
    if (!text || !text.enabled) return;
    // Only apply canvas overlay if target is "canvas" or "both"
    if (text.target === "shapes") return;

    ctx.save();
    const fgColor = this.state.invertFigureGround ? palette.bg : palette.fg;
    const alpha = (text.contrast ?? 40) / 100;
    const density = (text.density ?? 50) / 100;
    const scale = text.scale ?? 14;

    if (text.mode === "grain") {
      // Fig. 69b: Lithographic tooth & stipple paper grain
      ctx.fillStyle = fgColor;
      const count = Math.floor(width * height * 0.00035 * (0.5 + density));
      let s = 1234567;
      const rng = () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };
      ctx.globalAlpha = Math.min(0.5, alpha * 0.45);
      const dotSize = Math.max(1, scale * 0.12);
      for (let i = 0; i < count; i++) {
        const gx = rng() * width;
        const gy = rng() * height;
        ctx.fillRect(gx, gy, dotSize, dotSize);
      }
    } else if (text.mode === "halftone") {
      // Fig. 67c: Mechanical dot raster screen
      ctx.fillStyle = fgColor;
      ctx.globalAlpha = Math.min(0.55, alpha * 0.5);
      const step = Math.max(8, Math.round(34 - density * 18));
      const maxDot = (step * 0.38) * (scale / 14);
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const dist = Math.hypot(x - width / 2, y - height / 2);
          const factor = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(dist * 0.012));
          const r = Math.max(0.6, maxDot * factor);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (text.mode === "ribbing") {
      // Fig. 68a: Woven linear ribbing / parallel hatching
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = Math.max(0.8, scale * 0.08);
      ctx.globalAlpha = Math.min(0.45, alpha * 0.4);
      const step = Math.max(4, Math.round(24 - density * 16));
      ctx.beginPath();
      for (let y = 0; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else if (text.mode === "typography") {
      // Fig. 71: Typography as Visual Texture (Wong Exercise)
      const letters = ["A", "B", "R", "X", "M", "Q", "S", "8", "■", "┼", "╱", "╲"];
      const step = Math.max(14, Math.round(48 - density * 24));
      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.round(scale)}px "Space Grotesk", monospace, sans-serif`;
      ctx.fillStyle = fgColor;
      ctx.globalAlpha = Math.min(0.45, alpha * 0.4);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * step;
          const y = (r + 0.5) * step;
          const hash = Math.sin(r * 37.1 + c * 73.9) * 43758.5453;
          const rand = hash - Math.floor(hash);
          const char = letters[Math.floor(rand * letters.length)];
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rand - 0.5) * 0.6);
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }
}


  // Chapter 1: Introduction - Conceptual, Visual & Relational Elements


const Chapter1 = {
  id: 1,
  defaultParams: {
    elementType: "all", // point, line, plane, volume, all
    pointSize: 18,
    lineWidth: 4,
    lineLength: 140,
    planeSize: 90,
    gravity: 0, // -100 (floating/buoyant) to +100 (heavy/grounded)
    direction: 45, // degrees
    showReferenceFrame: true,
    showCoordinates: true,
    density: 5
  },

  controls: [
    {
      id: "elementType",
      label: "Element Classification",
      type: "select",
      options: [
        { value: "all", label: "All Elements (Point, Line, Plane, Volume)" },
        { value: "point", label: "Conceptual Point (Position without Area)" },
        { value: "line", label: "Conceptual Line (Breadthless Length)" },
        { value: "plane", label: "Conceptual Plane (Length & Breadth)" },
        { value: "volume", label: "Conceptual Volume (Illusory 3D)" }
      ]
    },
    { id: "pointSize", label: "Point Scale", type: "range", min: 4, max: 40, step: 1 },
    { id: "lineWidth", label: "Line Caliber", type: "range", min: 1, max: 20, step: 1 },
    { id: "planeSize", label: "Plane Dimension", type: "range", min: 30, max: 200, step: 5 },
    { id: "direction", label: "Relational Direction", type: "range", min: 0, max: 360, step: 5, unit: "°" },
    { id: "gravity", label: "Relational Gravity (Weight)", type: "range", min: -100, max: 100, step: 5 },
    { id: "showReferenceFrame", label: "Show Reference Frame Coordinates", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 1: Conceptual Evolution",
      description: "Point extends to line, line sweeps to plane, plane extrudes to volume.",
      params: { elementType: "all", pointSize: 14, lineWidth: 3, planeSize: 80, direction: 30, gravity: 0, showReferenceFrame: true }
    },
    {
      name: "Fig. 2: Visual Elements (Scale & Texture)",
      description: "Varying visual dimensions, tones, and silhouette weights.",
      params: { elementType: "plane", planeSize: 120, direction: 90, gravity: 50, showReferenceFrame: true }
    },
    {
      name: "Fig. 3: Relational Gravity & Tension",
      description: "Heavy mass suspended against the baseline of the frame.",
      params: { elementType: "point", pointSize: 36, direction: 0, gravity: 90, showReferenceFrame: true }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, params.showReferenceFrame, 50);

    const cx = width / 2;
    const cy = height / 2;
    const gravOffset = (params.gravity / 100) * (height * 0.28);
    const rad = (params.direction * Math.PI) / 180;

    // Draw reference frame coordinate guides if requested
    if (params.showReferenceFrame) {
      ctx.save();
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Label corners
      ctx.fillStyle = palette.accent;
      ctx.font = "10px monospace";
      ctx.fillText("REFERENCE FRAME BOUNDS", 38, 48);
      ctx.fillText(`CENTER (${Math.round(cx)}, ${Math.round(cy)})`, cx - 60, cy - 12);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = params.lineWidth;

    if (params.elementType === "all") {
      // Step-by-step conceptual evolution (Wong Fig 1)
      const colW = width / 4;
      const baseCy = cy + gravOffset;

      // 1. Point
      ctx.beginPath();
      ctx.arc(colW * 0.65, baseCy, params.pointSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "11px sans-serif";
      ctx.fillText("Point", colW * 0.65 - 15, baseCy + params.pointSize + 22);

      // 2. Line
      ctx.save();
      ctx.translate(colW * 1.6, baseCy);
      ctx.rotate(rad);
      ctx.beginPath();
      ctx.moveTo(-params.lineLength / 2, 0);
      ctx.lineTo(params.lineLength / 2, 0);
      ctx.stroke();
      ctx.restore();
      ctx.fillText("Line", colW * 1.6 - 12, baseCy + 50);

      // 3. Plane
      ctx.save();
      ctx.translate(colW * 2.55, baseCy);
      ctx.rotate(rad * 0.5);
      ctx.fillRect(-params.planeSize / 2, -params.planeSize / 2, params.planeSize, params.planeSize);
      ctx.restore();
      ctx.fillText("Plane", colW * 2.55 - 15, baseCy + 55);

      // 4. Volume (Isometric illusory cube)
      ctx.save();
      ctx.translate(colW * 3.4, baseCy);
      this.drawIsometricBox(ctx, 0, 0, params.planeSize * 0.7, palette);
      ctx.restore();
      ctx.fillText("Volume", colW * 3.4 - 20, baseCy + 55);

    } else if (params.elementType === "point") {
      // Point array demonstrating position & gravity
      const positions = [
        { x: cx, y: cy + gravOffset, r: params.pointSize * 1.5 },
        { x: cx - 120, y: cy - 60 + gravOffset, r: params.pointSize * 0.7 },
        { x: cx + 110, y: cy + 40 + gravOffset, r: params.pointSize * 0.9 },
        { x: cx + 50, y: cy - 110 + gravOffset, r: params.pointSize * 0.4 }
      ];
      positions.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

    } else if (params.elementType === "line") {
      // Set of lines demonstrating caliber, direction, and grouping
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      ctx.rotate(rad);
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-params.lineLength, i * 22);
        ctx.lineTo(params.lineLength, i * 22);
        ctx.stroke();
      }
      ctx.restore();

    } else if (params.elementType === "plane") {
      // Overlapping planes demonstrating space & orientation
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      ctx.rotate(rad);
      ctx.fillRect(-params.planeSize / 2, -params.planeSize / 2, params.planeSize, params.planeSize);
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(params.planeSize * 0.4, params.planeSize * 0.4, params.planeSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (params.elementType === "volume") {
      // High-contrast volumetric projection
      ctx.save();
      ctx.translate(cx, cy + gravOffset);
      this.drawIsometricBox(ctx, 0, 0, params.planeSize, palette);
      ctx.restore();
    }

    ctx.restore();
  },

  drawIsometricBox(ctx, x, y, size, palette) {
    const s = size * 0.6;
    const h = s * Math.sin(Math.PI / 6);
    const w = s * Math.cos(Math.PI / 6);

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + w, y - s + h);
    ctx.lineTo(x, y - s + 2 * h);
    ctx.lineTo(x - w, y - s + h);
    ctx.closePath();
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(x - w, y - s + h);
    ctx.lineTo(x, y - s + 2 * h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x - w, y);
    ctx.closePath();
    ctx.fillStyle = palette.fg;
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(x, y - s + 2 * h);
    ctx.lineTo(x + w, y - s + h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.stroke();
  }
};
// Chapter 2: Form & The 8 Interrelations of Forms


const Chapter2 = {
  id: 2,
  defaultParams: {
    interrelation: "overlapping", // detachment, touching, overlapping, penetration, union, subtraction, intersection, coincidence
    shapeA: "circle",
    shapeB: "square",
    sizeA: 110,
    sizeB: 110,
    offsetDistance: 70, // interactive slider or mouse drag
    invertFigureGround: false,
    outlineOnly: false,
    showLabels: true
  },

  controls: [
    {
      id: "interrelation",
      label: "Interrelation Mode",
      type: "select",
      options: [
        { value: "detachment", label: "1. Detachment (Distanciamiento)" },
        { value: "touching", label: "2. Touching (Toque)" },
        { value: "overlapping", label: "3. Overlapping (Superposición)" },
        { value: "penetration", label: "4. Penetration (Penetración / Transparency)" },
        { value: "union", label: "5. Union (Unión / Combined Silhouette)" },
        { value: "subtraction", label: "6. Subtraction (Sustracción / Negative Cut)" },
        { value: "intersection", label: "7. Intersection (Intersección / Shared Core)" },
        { value: "coincidence", label: "8. Coincidence (Coincidencia / Total Unity)" }
      ]
    },
    {
      id: "shapeA",
      label: "Primary Form (A)",
      type: "select",
      options: [
        { value: "circle", label: "Circle (Organic/Pure)" },
        { value: "square", label: "Square (Rectilinear)" },
        { value: "triangle", label: "Equilateral Triangle" }
      ]
    },
    {
      id: "shapeB",
      label: "Secondary Form (B)",
      type: "select",
      options: [
        { value: "circle", label: "Circle" },
        { value: "square", label: "Square" },
        { value: "triangle", label: "Equilateral Triangle" }
      ]
    },
    { id: "sizeA", label: "Form A Scale", type: "range", min: 40, max: 180, step: 5 },
    { id: "offsetDistance", label: "Inter-form Offset", type: "range", min: 0, max: 240, step: 2 },
    { id: "invertFigureGround", label: "Invert Figure-Ground (Negative Space)", type: "checkbox" },
    { id: "outlineOnly", label: "Wireframe / Outline Only", type: "checkbox" },
    { id: "showLabels", label: "Show Diagrammatic Annotations", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 12a: Detachment",
      description: "Two distinct shapes separated by negative void.",
      params: { interrelation: "detachment", offsetDistance: 150, sizeA: 100, sizeB: 100, invertFigureGround: false }
    },
    {
      name: "Fig. 12c: Overlapping",
      description: "One form asserts foreground dominance, occluding the rear form.",
      params: { interrelation: "overlapping", offsetDistance: 70, sizeA: 110, sizeB: 110, invertFigureGround: false }
    },
    {
      name: "Fig. 12e: Union",
      description: "Two forms coalesce into a single hybrid continuous silhouette.",
      params: { interrelation: "union", offsetDistance: 80, sizeA: 110, sizeB: 110, invertFigureGround: false }
    },
    {
      name: "Fig. 12f: Subtraction (Crescent)",
      description: "Form B cuts an invisible negative bite out of Form A.",
      params: { interrelation: "subtraction", offsetDistance: 60, sizeA: 120, sizeB: 120, invertFigureGround: false }
    },
    {
      name: "Fig. 11: Reversible Inversion",
      description: "Positive and negative figure-ground inversion across dual circles.",
      params: { interrelation: "overlapping", offsetDistance: 85, invertFigureGround: true }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cx = width / 2;
    const cy = height / 2;
    const rA = params.sizeA;
    const rB = params.sizeB;

    // Determine actual offset based on mode or manual slider
    let dist = params.offsetDistance;
    if (params.interrelation === "detachment" && dist < rA + 20) dist = rA + 40;
    if (params.interrelation === "touching") dist = rA;
    if (params.interrelation === "coincidence") dist = 0;

    const posA = { x: cx - dist / 2, y: cy };
    const posB = { x: cx + dist / 2, y: cy };

    const fgColor = params.invertFigureGround ? palette.bg : palette.fg;
    const bgColor = params.invertFigureGround ? palette.fg : palette.bg;

    // Fill background if inverted
    if (params.invertFigureGround) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.save();

    // Helper to draw shape path
    const drawShape = (type, x, y, size) => {
      ctx.beginPath();
      if (type === "circle") {
        ctx.arc(x, y, size, 0, Math.PI * 2);
      } else if (type === "square") {
        ctx.rect(x - size, y - size, size * 2, size * 2);
      } else if (type === "triangle") {
        CanvasUtils.drawPolygon(ctx, x, y, size * 1.15, 3, -Math.PI / 2);
      }
      ctx.closePath();
    };

    if (params.outlineOnly) {
      // Wireframe analysis
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 3;
      drawShape(params.shapeA, posA.x, posA.y, rA);
      ctx.stroke();
      drawShape(params.shapeB, posB.x, posB.y, rB);
      ctx.stroke();

    } else {
      // Boolean operations simulation
      switch (params.interrelation) {
        case "detachment":
        case "touching":
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          break;

        case "overlapping":
          // Rear shape (B) with thin border to clarify occlusion
          ctx.fillStyle = fgColor;
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();

          // Foreground shape (A) with background halo/cutout to emphasize depth
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.lineWidth = 4;
          ctx.strokeStyle = bgColor;
          ctx.stroke();
          ctx.restore();
          break;

        case "penetration":
          // Both shapes rendered with transparency so internal overlap is visible
          ctx.fillStyle = fgColor;
          ctx.globalAlpha = 0.45;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.lineWidth = 2;
          ctx.strokeStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.stroke();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          break;

        case "union":
          // Both shapes combined into single solid silhouette
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fill();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          break;

        case "subtraction":
          // Form A with Form B cut out of it
          // Offscreen canvas or composite operation
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.globalCompositeOperation = 'destination-out';
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fill();
          ctx.restore();

          // Subtle dashed outline of the invisible cutting form
          ctx.save();
          ctx.strokeStyle = palette.accent;
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.5;
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          ctx.restore();
          break;

        case "intersection":
          // Only the shared overlap remains
          ctx.save();
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.clip();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.fillStyle = fgColor;
          ctx.fill();
          ctx.restore();

          // Subtle phantom outlines of the discarded parent forms
          ctx.save();
          ctx.strokeStyle = palette.grid;
          ctx.setLineDash([2, 4]);
          drawShape(params.shapeA, posA.x, posA.y, rA);
          ctx.stroke();
          drawShape(params.shapeB, posB.x, posB.y, rB);
          ctx.stroke();
          ctx.restore();
          break;

        case "coincidence":
          ctx.fillStyle = fgColor;
          drawShape(params.shapeA, cx, cy, rA);
          ctx.fill();
          break;
      }
    }

    // Annotations
    if (params.showLabels) {
      ctx.fillStyle = palette.accent;
      ctx.font = "12px monospace";
      ctx.fillText(`MODE: ${params.interrelation.toUpperCase()}`, 30, height - 35);
      ctx.font = "11px sans-serif";
      ctx.fillStyle = fgColor;
      ctx.fillText(`Form A: ${params.shapeA} | Form B: ${params.shapeB}`, 30, height - 18);
    }

    ctx.restore();
  }
};
// Chapter 3: Repetition - Units, Super-Units & Reflection


const Chapter3 = {
  id: 3,
  defaultParams: {
    arrangement: "square", // linear, square, rhombic, triangular, circular
    unitCount: 4, // 2, 3, 4
    circleRadius: 36,
    interDistance: 45, // distance from center of super-unit
    rotation: 0,
    reflectX: false,
    tileRows: 4,
    tileCols: 4,
    displayMode: "tiled", // "single" supermodule or "tiled" repetition
    invertAlternating: false
  },

  controls: [
    {
      id: "displayMode",
      label: "Display Mode",
      type: "select",
      options: [
        { value: "tiled", label: "Tiled Repetition Field" },
        { value: "single", label: "Single Super-Unit Study" }
      ]
    },
    {
      id: "arrangement",
      label: "Meeting of 4 Circles (Arrangement)",
      type: "select",
      options: [
        { value: "square", label: "Fig. 15b: Square / Rectangular" },
        { value: "linear", label: "Fig. 15a: Linear Sequence" },
        { value: "rhombic", label: "Fig. 15c: Rhombic (Diamond)" },
        { value: "triangular", label: "Fig. 15d: Triangular" },
        { value: "circular", label: "Fig. 15e: Circular Radial" }
      ]
    },
    { id: "circleRadius", label: "Circle Radius", type: "range", min: 10, max: 80, step: 2 },
    { id: "interDistance", label: "Inter-Circle Distance (Offset)", type: "range", min: 0, max: 120, step: 2 },
    { id: "rotation", label: "Super-Unit Rotation", type: "range", min: 0, max: 360, step: 5, unit: "°" },
    { id: "tileRows", label: "Repetition Grid Rows", type: "range", min: 2, max: 8, step: 1 },
    { id: "tileCols", label: "Repetition Grid Columns", type: "range", min: 2, max: 8, step: 1 },
    { id: "reflectX", label: "Mirror Reflection (Alternating Cols)", type: "checkbox" },
    { id: "invertAlternating", label: "Alternating Positive/Negative Scheme", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 15b: Square Super-Unit",
      description: "Four overlapping circles positioned at the corners of a square.",
      params: { arrangement: "square", displayMode: "single", circleRadius: 65, interDistance: 50, rotation: 0 }
    },
    {
      name: "Fig. 17a: Tiled Linear Rhythm",
      description: "Dense repetition of small circular modules in strict column alignment.",
      params: { arrangement: "linear", displayMode: "tiled", circleRadius: 18, interDistance: 20, tileRows: 6, tileCols: 6 }
    },
    {
      name: "Fig. 18b: Penetrated Super-Modules",
      description: "Overlapping circles creating floral negative counter-forms.",
      params: { arrangement: "square", displayMode: "tiled", circleRadius: 32, interDistance: 30, tileRows: 4, tileCols: 4, reflectX: true }
    },
    {
      name: "Fig. 18f: Swirling Circular Unit",
      description: "Radial circular arrangement forming dynamic centrifugal pinwheels.",
      params: { arrangement: "circular", displayMode: "single", circleRadius: 70, interDistance: 45, rotation: 45 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cx = width / 2;
    const cy = height / 2;

    if (params.displayMode === "single") {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((params.rotation * Math.PI) / 180);
      this.drawSuperUnit(ctx, 0, 0, params, palette.fg, false);
      ctx.restore();
    } else {
      // Tiled repetition field
      const rows = params.tileRows;
      const cols = params.tileCols;
      const stepX = width / cols;
      const stepY = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = stepX * (c + 0.5);
          const posY = stepY * (r + 0.5);

          const shouldMirror = params.reflectX && (c % 2 === 1);
          const shouldInvert = params.invertAlternating && ((r + c) % 2 === 1);

          const cellFg = shouldInvert ? palette.bg : palette.fg;
          const cellBg = shouldInvert ? palette.fg : palette.bg;

          ctx.save();
          ctx.translate(posX, posY);

          if (shouldInvert) {
            ctx.fillStyle = cellBg;
            ctx.fillRect(-stepX / 2, -stepY / 2, stepX, stepY);
          }

          if (shouldMirror) {
            ctx.scale(-1, 1);
          }

          ctx.rotate((params.rotation * Math.PI) / 180);
          this.drawSuperUnit(ctx, 0, 0, params, cellFg, shouldInvert);
          ctx.restore();
        }
      }
    }
  },

  drawSuperUnit(ctx, x, y, params, fgColor) {
    const d = params.interDistance;
    const r = params.circleRadius;
    const pts = [];

    switch (params.arrangement) {
      case "square":
        pts.push({ x: -d, y: -d }, { x: d, y: -d }, { x: d, y: d }, { x: -d, y: d });
        break;
      case "linear":
        pts.push({ x: -d * 1.5, y: 0 }, { x: -d * 0.5, y: 0 }, { x: d * 0.5, y: 0 }, { x: d * 1.5, y: 0 });
        break;
      case "rhombic":
        pts.push({ x: 0, y: -d * 1.4 }, { x: d * 1.4, y: 0 }, { x: 0, y: d * 1.4 }, { x: -d * 1.4, y: 0 });
        break;
      case "triangular":
        pts.push(
          { x: 0, y: -d * 1.2 },
          { x: -d, y: d * 0.7 },
          { x: d, y: d * 0.7 },
          { x: 0, y: 0 }
        );
        break;
      case "circular":
        for (let i = 0; i < 4; i++) {
          const ang = (i * Math.PI) / 2;
          pts.push({ x: Math.cos(ang) * d, y: Math.sin(ang) * d });
        }
        break;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = fgColor;

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
};
// Chapter 4: Structure - Formal Grids, Active Slicing & Grid Variations


const Chapter4 = {
  id: 4,
  defaultParams: {
    gridType: "basic", // basic, sheared, sliding, curved, zigzag
    isActive: true, // active structure cuts/clips and inverts shapes
    isVisible: true, // visible structure lines with tangible thickness
    gridLineWidth: 2,
    gridSize: 70,
    moduleShape: "c-shape", // c-shape, circle, square, diagonal-split
    moduleScale: 0.75, // relative to cell
    shearAngle: 15,
    slideOffset: 0.5,
    curveIntensity: 18,
    checkerInvert: true
  },

  controls: [
    {
      id: "gridType",
      label: "Grid Variation",
      type: "select",
      options: [
        { value: "basic", label: "Fig. 21: Basic Repetition Grid" },
        { value: "sheared", label: "Fig. 22b: Sheared / Directional Angle" },
        { value: "sliding", label: "Fig. 22c: Sliding / Staggered Rows" },
        { value: "curved", label: "Fig. 22d: Curved Structural Lines" },
        { value: "zigzag", label: "Fig. 22e: Zigzag / Bent Grid" }
      ]
    },
    {
      id: "moduleShape",
      label: "Module (Unit Form)",
      type: "select",
      options: [
        { value: "c-shape", label: "Wong's Classic C-Ring (Fig. 26a)" },
        { value: "circle", label: "Solid Circle" },
        { value: "square", label: "Rotated Square" },
        { value: "quarter", label: "Quarter Circles (Fig. 20)" }
      ]
    },
    { id: "isActive", label: "Active Structure (Clips & Inverts at Boundary)", type: "checkbox" },
    { id: "isVisible", label: "Visible Grid Lines (Measurable Caliber)", type: "checkbox" },
    { id: "gridLineWidth", label: "Structural Line Thickness", type: "range", min: 1, max: 12, step: 1 },
    { id: "gridSize", label: "Cell Size (Scale)", type: "range", min: 45, max: 120, step: 5 },
    { id: "moduleScale", label: "Module Proportion", type: "range", min: 0.3, max: 1.2, step: 0.05 },
    { id: "checkerInvert", label: "Alternating Cell Inversion", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 26a: Active Ring Inversion",
      description: "Active grid slices and inverts C-ring modules across alternating cells.",
      params: { gridType: "basic", isActive: true, isVisible: false, moduleShape: "c-shape", gridSize: 65, moduleScale: 0.85, checkerInvert: true }
    },
    {
      name: "Fig. 20a: Visible Structural Framework",
      description: "Structural lines possess strong physical caliber separating unit forms.",
      params: { gridType: "basic", isActive: false, isVisible: true, gridLineWidth: 6, moduleShape: "quarter", gridSize: 80, moduleScale: 0.75, checkerInvert: false }
    },
    {
      name: "Fig. 22c: Staggered Brick Grid",
      description: "Sliding horizontal rows creating dynamic syncopated rhythm.",
      params: { gridType: "sliding", isActive: true, isVisible: true, gridLineWidth: 2, moduleShape: "circle", gridSize: 60, moduleScale: 0.7, checkerInvert: true }
    },
    {
      name: "Fig. 22d: Curved Dynamic Weave",
      description: "Curved active lines undulating across repeating shapes.",
      params: { gridType: "curved", isActive: true, isVisible: true, gridLineWidth: 2, moduleShape: "c-shape", gridSize: 70, moduleScale: 0.8, curveIntensity: 22, checkerInvert: false }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const sz = params.gridSize;
    const cols = Math.ceil(width / sz) + 2;
    const rows = Math.ceil(height / sz) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        let x = c * sz;
        let y = r * sz;

        // Apply grid variation shifts
        if (params.gridType === "sliding") {
          if (r % 2 === 1) x += sz * params.slideOffset;
        } else if (params.gridType === "sheared") {
          x += Math.tan((params.shearAngle * Math.PI) / 180) * y;
        }

        const isEven = (r + c) % 2 === 0;
        const cellBg = (params.checkerInvert && !isEven) ? palette.fg : palette.bg;
        const cellFg = (params.checkerInvert && !isEven) ? palette.bg : palette.fg;

        ctx.save();

        if (params.isActive) {
          // In active structures, cell boundaries clip the module and invert background
          ctx.beginPath();
          if (params.gridType === "curved") {
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + sz / 2, y + params.curveIntensity, x + sz, y);
            ctx.lineTo(x + sz, y + sz);
            ctx.quadraticCurveTo(x + sz / 2, y + sz + params.curveIntensity, x, y + sz);
          } else {
            ctx.rect(x, y, sz, sz);
          }
          ctx.closePath();

          ctx.fillStyle = cellBg;
          ctx.fill();
          ctx.clip(); // Active structure clips shapes!
        }

        // Draw module inside cell
        const modCx = x + sz / 2;
        const modCy = y + sz / 2;
        const modR = (sz / 2) * params.moduleScale;

        ctx.fillStyle = cellFg;
        ctx.strokeStyle = cellFg;

        this.drawModule(ctx, modCx, modCy, modR, params.moduleShape, palette);

        ctx.restore();
      }
    }

    // Draw visible structural lines on top if enabled
    if (params.isVisible) {
      ctx.save();
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = params.gridLineWidth;

      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        let x = c * sz;
        ctx.beginPath();
        if (params.gridType === "curved") {
          ctx.moveTo(x, 0);
          for (let y = 0; y <= height; y += sz) {
            ctx.quadraticCurveTo(x + params.curveIntensity, y + sz / 2, x, y + sz);
          }
        } else {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        ctx.stroke();
      }

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        let y = r * sz;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    }
  },

  drawModule(ctx, x, y, r, shape, palette) {
    ctx.save();
    ctx.translate(x, y);

    if (shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === "square") {
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
    } else if (shape === "c-shape") {
      // Wucius Wong's famous cut-out C module
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI * 0.25, Math.PI * 1.75, false);
      ctx.arc(0, 0, r * 0.5, Math.PI * 1.75, Math.PI * 0.25, true);
      ctx.closePath();
      ctx.fill();
    } else if (shape === "quarter") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, 0, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
};
// Chapter 5: Similarity - Visual Kinship, Elastic Tension & Organic Structures


const Chapter5 = {
  id: 5,
  defaultParams: {
    method: "tension", // tension, imperfection, spatial, morphing, structure
    baseShape: "super-ellipse", // super-ellipse, teardrop, quad, pebble
    moduleCount: 36, // 6x6
    elasticity: 45, // tension/compression amount
    noiseSeed: 12,
    spatialAngle: 35, // 3D foreshortening angle
    irregularity: 30, // imperfection amount
    structureType: "grid", // grid, organic-voronoi
    fillMode: "solid"
  },

  controls: [
    {
      id: "method",
      label: "Similarity Method",
      type: "select",
      options: [
        { value: "tension", label: "Fig. 31: Tension & Compression (Elasticity)" },
        { value: "imperfection", label: "Fig. 28: Imperfection & Truncation" },
        { value: "spatial", label: "Fig. 29: Spatial Distortion (Foreshortening)" },
        { value: "structure", label: "Fig. 33: Similarity Structure (Organic Cells)" }
      ]
    },
    {
      id: "baseShape",
      label: "Base Family Form",
      type: "select",
      options: [
        { value: "super-ellipse", label: "Organic Pebble / Super-Ellipse" },
        { value: "teardrop", label: "Teardrop Form" },
        { value: "quad", label: "Rounded Quadrilateral" },
        { value: "c-shape", label: "C-Curved Hook" }
      ]
    },
    { id: "elasticity", label: "Elastic Deformation / Variation", type: "range", min: 0, max: 100, step: 2 },
    { id: "spatialAngle", label: "Spatial Tilt Angle (Foreshortening)", type: "range", min: 0, max: 75, step: 5, unit: "°" },
    { id: "irregularity", label: "Imperfection Amount", type: "range", min: 0, max: 80, step: 2 }
  ],

  presets: [
    {
      name: "Fig. 31: Elastic Tension Field",
      description: "Modules stretching and compressing under imaginary gravitational pulls.",
      params: { method: "tension", baseShape: "teardrop", elasticity: 60, spatialAngle: 20 }
    },
    {
      name: "Fig. 28: Imperfect Quadrilaterals",
      description: "Ideal squares subtly distorted with sheared corners and irregular wavering lines.",
      params: { method: "imperfection", baseShape: "quad", irregularity: 50, elasticity: 20 }
    },
    {
      name: "Fig. 29: Spatial 3D Rotation",
      description: "Identical forms tilted in 3D perspective across alternating viewing angles.",
      params: { method: "spatial", baseShape: "super-ellipse", spatialAngle: 65, elasticity: 30 }
    },
    {
      name: "Fig. 33: Organic Similarity Structure",
      description: "Semi-formal irregular network where every cell is related yet unique.",
      params: { method: "structure", baseShape: "pebble", elasticity: 40 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 45);

    const rows = 6;
    const cols = 6;
    const stepX = (width - 80) / cols;
    const stepY = (height - 80) / rows;
    const startX = 40 + stepX / 2;
    const startY = 40 + stepY / 2;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * stepX;
        const y = startY + r * stepY;

        // Pseudo-random deterministic variation based on cell coordinate
        const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
        const randA = seed - Math.floor(seed);
        const randB = Math.cos(seed) * 0.5 + 0.5;

        ctx.save();
        ctx.translate(x, y);

        if (params.method === "spatial") {
          // Spatial 3D tilt: foreshortening along varying axes
          const tiltX = Math.cos((params.spatialAngle * Math.PI) / 180 + randA * 0.8);
          const tiltY = 1.0;
          ctx.scale(Math.max(0.2, tiltX), tiltY);
          ctx.rotate(randB * Math.PI * 0.4 - 0.2);

        } else if (params.method === "tension") {
          // Tension & compression: stretching vertically or horizontally
          const stretch = 1.0 + ((randA - 0.5) * params.elasticity) / 50;
          const squash = 1.0 / stretch;
          ctx.scale(stretch, squash);
          ctx.rotate((randB - 0.5) * 0.4);

        } else if (params.method === "imperfection") {
          // Subtle shear and truncation
          const skew = ((randA - 0.5) * params.irregularity) / 80;
          ctx.transform(1, skew, 0, 1, 0, 0);
        }

        // Draw the base form with its deformation
        const baseRadius = Math.min(stepX, stepY) * 0.36;
        this.drawSimilarForm(ctx, baseRadius, params.baseShape, params, randA);

        ctx.restore();
      }
    }

    ctx.restore();
  },

  drawSimilarForm(ctx, radius, shape, params, variance) {
    ctx.beginPath();

    if (shape === "super-ellipse") {
      // Lamé curve / superellipse with organic variance
      const n = 2.5 + (variance - 0.5) * 1.5;
      const pts = 36;
      for (let i = 0; i <= pts; i++) {
        const theta = (i * 2 * Math.PI) / pts;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const px = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) * radius;
        const py = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

    } else if (shape === "teardrop") {
      CanvasUtils.drawTeardrop(ctx, 0, 0, radius * 1.3, radius * 1.9, variance * Math.PI * 0.2);
      ctx.fill();

    } else if (shape === "quad") {
      // Deformed polygon
      const corners = 4;
      for (let i = 0; i < corners; i++) {
        const ang = (i * Math.PI) / 2 + Math.PI / 4;
        const d = radius * (1 + (variance - 0.5) * 0.35);
        const px = Math.cos(ang) * d;
        const py = Math.sin(ang) * d;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

    } else if (shape === "c-shape") {
      CanvasUtils.drawCShape(ctx, 0, 0, radius, radius * 0.45, Math.PI / 3, variance * 0.5);
      ctx.fill();
    }
  }
};
// Chapter 6: Gradation - Planar, Spatial & Shape Progressions


const Chapter6 = {
  id: 6,
  defaultParams: {
    progressionType: "shape", // shape, size, rotation, alternating
    pathway: "parallel", // parallel, concentric, zigzag
    stepsX: 8,
    stepsY: 8,
    velocity: "linear", // linear, accelerated, decelerated
    startShape: "circle",
    endShape: "triangle",
    maxRotation: 180,
    alternatingInvert: true
  },

  controls: [
    {
      id: "progressionType",
      label: "Gradation Type",
      type: "select",
      options: [
        { value: "shape", label: "Fig. 36: Shape Gradation (Circle → Triangle)" },
        { value: "size", label: "Fig. 35d: Spatial Gradation (Scale / Distance)" },
        { value: "rotation", label: "Fig. 35a: Planar Rotation Gradation" },
        { value: "alternating", label: "Fig. 43: Alternating Dual Gradation" }
      ]
    },
    {
      id: "pathway",
      label: "Movement Pathway",
      type: "select",
      options: [
        { value: "parallel", label: "Fig. 39: Parallel Movement" },
        { value: "concentric", label: "Fig. 40: Concentric Movement" },
        { value: "zigzag", label: "Fig. 41: Zigzag Movement" }
      ]
    },
    { id: "stepsX", label: "Horizontal Steps (Columns)", type: "range", min: 4, max: 16, step: 1 },
    { id: "stepsY", label: "Vertical Steps (Rows)", type: "range", min: 4, max: 16, step: 1 },
    { id: "maxRotation", label: "Max Rotation Span", type: "range", min: 0, max: 360, step: 15, unit: "°" },
    { id: "alternatingInvert", label: "Interlace Alternating Contrast", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 36: Morphing Circle to Triangle",
      description: "Shape transition across rows with subtle intermediate rounded apexes.",
      params: { progressionType: "shape", pathway: "parallel", stepsX: 10, stepsY: 6, startShape: "circle", endShape: "triangle" }
    },
    {
      name: "Fig. 40: Concentric Spatial Tunnel",
      description: "Modules shrink rapidly toward the center, creating deep illusory perspective.",
      params: { progressionType: "size", pathway: "concentric", stepsX: 9, stepsY: 9 }
    },
    {
      name: "Fig. 43b: Opposing Alternating Flow",
      description: "Even rows expand while odd rows contract in counterpoint rhythm.",
      params: { progressionType: "alternating", pathway: "parallel", stepsX: 10, stepsY: 8, alternatingInvert: true }
    },
    {
      name: "Fig. 47d: Op-Art Dynamic Wave",
      description: "Wave gradation generating visual ripple across a dense matrix.",
      params: { progressionType: "rotation", pathway: "zigzag", stepsX: 12, stepsY: 12, maxRotation: 270 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const cols = params.stepsX;
    const rows = params.stepsY;
    const stepX = width / cols;
    const stepY = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = stepX * (c + 0.5);
        const y = stepY * (r + 0.5);

        // Calculate progress t from 0.0 to 1.0 depending on pathway
        let t = 0;
        if (params.pathway === "parallel") {
          t = (c / (cols - 1) + r / (rows - 1)) / 2;
        } else if (params.pathway === "concentric") {
          const normX = (c - (cols - 1) / 2) / ((cols - 1) / 2);
          const normY = (r - (rows - 1) / 2) / ((rows - 1) / 2);
          t = Math.sqrt(normX * normX + normY * normY) / Math.SQRT2;
          t = Math.min(1.0, Math.max(0.0, t));
        } else if (params.pathway === "zigzag") {
          const colProg = (r % 2 === 0) ? (c / (cols - 1)) : (1 - c / (cols - 1));
          t = (colProg + r / (rows - 1)) / 2;
        }

        // Alternating logic
        if (params.progressionType === "alternating" && r % 2 === 1) {
          t = 1.0 - t;
        }

        ctx.save();
        ctx.translate(x, y);

        const isEven = (r + c) % 2 === 0;
        const cellFg = (params.alternatingInvert && !isEven && params.progressionType === "alternating")
          ? palette.accent : palette.fg;

        ctx.fillStyle = cellFg;
        ctx.strokeStyle = cellFg;

        // Render based on progression type
        const maxR = Math.min(stepX, stepY) * 0.42;

        if (params.progressionType === "rotation") {
          const angle = (t * params.maxRotation * Math.PI) / 180;
          ctx.rotate(angle);
          ctx.fillRect(-maxR * 0.75, -maxR * 0.75, maxR * 1.5, maxR * 1.5);

        } else if (params.progressionType === "size") {
          const currentR = maxR * (0.15 + 0.85 * t);
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fill();

        } else if (params.progressionType === "shape" || params.progressionType === "alternating") {
          // Morph between circle (t=0) and sharp triangle/square (t=1)
          const currentR = maxR * (0.35 + 0.65 * (1 - t * 0.2));
          this.drawMorphedShape(ctx, currentR, t);
        }

        ctx.restore();
      }
    }
  },

  drawMorphedShape(ctx, radius, t) {
    // Morph between 3-sided triangle and circle smoothly
    const pts = 36;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const angle = (i * 2 * Math.PI) / pts - Math.PI / 2;
      // Circle radius
      const rCircle = radius;
      // Triangle radius formula
      const triAngle = (angle + Math.PI / 2) % ((2 * Math.PI) / 3) - Math.PI / 3;
      const rTri = (radius * Math.cos(Math.PI / 3)) / Math.max(0.1, Math.cos(triAngle));
      const rCurrent = rCircle * (1 - t) + Math.min(radius * 1.5, rTri) * t;

      const px = Math.cos(angle) * rCurrent;
      const py = Math.sin(angle) * rCurrent;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
};
// Chapter 7: Radiation - Centrifugal, Concentric, Centripetal & Moiré Interference


const Chapter7 = {
  id: 7,
  defaultParams: {
    radiationType: "centrifugal", // centrifugal, concentric, centripetal, spiral, moire
    rayCount: 36,
    curvature: 0, // 0 is straight, positive or negative is swirling
    apertureSize: 30, // central hole / polygon
    concentricRings: 18,
    dualCenterOffset: 60, // for moiré superposition
    lineWidth: 2,
    invertAlternatingSectors: true
  },

  controls: [
    {
      id: "radiationType",
      label: "Radiation Scheme",
      type: "select",
      options: [
        { value: "centrifugal", label: "Fig. 48: Centrifugal (Outward Rays)" },
        { value: "concentric", label: "Fig. 49: Concentric (Nested Rings / Layers)" },
        { value: "centripetal", label: "Fig. 50: Centripetal (Inward Converging)" },
        { value: "spiral", label: "Fig. 49d: Archimedean Spiral" },
        { value: "moire", label: "Fig. 51b: Dual-Center Moiré Interference" }
      ]
    },
    { id: "rayCount", label: "Ray / Sector Count", type: "range", min: 8, max: 72, step: 2 },
    { id: "curvature", label: "Swirl / Curvature Angle", type: "range", min: -90, max: 90, step: 5, unit: "°" },
    { id: "apertureSize", label: "Center Aperture Void", type: "range", min: 0, max: 120, step: 5 },
    { id: "concentricRings", label: "Concentric Layer Count", type: "range", min: 4, max: 40, step: 1 },
    { id: "dualCenterOffset", label: "Dual Center Moiré Offset", type: "range", min: 10, max: 160, step: 5 },
    { id: "invertAlternatingSectors", label: "Fill Alternating Sectors (Pie Wedge)", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 48a: Straight Centrifugal Sunburst",
      description: "Rigid straight structural lines radiating outward from a single focal origin.",
      params: { radiationType: "centrifugal", rayCount: 36, curvature: 0, apertureSize: 0, invertAlternatingSectors: true }
    },
    {
      name: "Fig. 48b: Swirling Dynamic Vortex",
      description: "Curved radiating lines creating intense optical rotation and momentum.",
      params: { radiationType: "centrifugal", rayCount: 32, curvature: 60, apertureSize: 25, invertAlternatingSectors: true }
    },
    {
      name: "Fig. 49a: Concentric Ripples",
      description: "Evenly spaced concentric circular rings enclosing a common center.",
      params: { radiationType: "concentric", concentricRings: 24, apertureSize: 10 }
    },
    {
      name: "Fig. 50a: Centripetal Inward Convergence",
      description: "Bent directional segments pointing sharply toward a central focal void.",
      params: { radiationType: "centripetal", rayCount: 24, apertureSize: 40 }
    },
    {
      name: "Fig. 51b: Dual-Center Moiré Interference",
      description: "Two offset radiation centers producing shimmering optical interference waves.",
      params: { radiationType: "moire", rayCount: 48, dualCenterOffset: 70, apertureSize: 0 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.hypot(width, height) * 0.55;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;
    ctx.lineWidth = params.lineWidth;

    if (params.radiationType === "centrifugal") {
      this.drawCentrifugal(ctx, cx, cy, maxRadius, params, palette);

    } else if (params.radiationType === "concentric") {
      this.drawConcentric(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "centripetal") {
      this.drawCentripetal(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "spiral") {
      this.drawSpiral(ctx, cx, cy, maxRadius, params);

    } else if (params.radiationType === "moire") {
      // Draw two offset radiation systems to induce Moiré fringes
      const offset = params.dualCenterOffset / 2;
      ctx.lineWidth = 1.5;
      this.drawRadialLines(ctx, cx - offset, cy, maxRadius, params.rayCount);
      this.drawRadialLines(ctx, cx + offset, cy, maxRadius, params.rayCount);
    }

    ctx.restore();
  },

  drawCentrifugal(ctx, cx, cy, maxRadius, params, palette) {
    const n = params.rayCount;
    const curveRad = (params.curvature * Math.PI) / 180;
    const rInner = params.apertureSize;

    for (let i = 0; i < n; i++) {
      const angle1 = (i * 2 * Math.PI) / n;
      const angle2 = ((i + 1) * 2 * Math.PI) / n;

      if (params.invertAlternatingSectors && i % 2 === 0) {
        // Draw filled sector wedge
        ctx.beginPath();
        if (rInner > 0) {
          ctx.arc(cx, cy, rInner, angle1, angle2, false);
          ctx.lineTo(cx + Math.cos(angle2 + curveRad) * maxRadius, cy + Math.sin(angle2 + curveRad) * maxRadius);
          ctx.arc(cx, cy, maxRadius, angle2 + curveRad, angle1 + curveRad, true);
        } else {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle1 + curveRad) * maxRadius, cy + Math.sin(angle1 + curveRad) * maxRadius);
          ctx.arc(cx, cy, maxRadius, angle1 + curveRad, angle2 + curveRad, false);
        }
        ctx.closePath();
        ctx.fill();
      } else if (!params.invertAlternatingSectors) {
        // Outline ray
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle1) * rInner, cy + Math.sin(angle1) * rInner);
        if (params.curvature !== 0) {
          const midR = maxRadius * 0.5;
          const ctrlX = cx + Math.cos(angle1 + curveRad * 0.5) * midR;
          const ctrlY = cy + Math.sin(angle1 + curveRad * 0.5) * midR;
          ctx.quadraticCurveTo(ctrlX, ctrlY, cx + Math.cos(angle1 + curveRad) * maxRadius, cy + Math.sin(angle1 + curveRad) * maxRadius);
        } else {
          ctx.lineTo(cx + Math.cos(angle1) * maxRadius, cy + Math.sin(angle1) * maxRadius);
        }
        ctx.stroke();
      }
    }
  },

  drawConcentric(ctx, cx, cy, maxRadius, params) {
    const rings = params.concentricRings;
    const step = (maxRadius - params.apertureSize) / rings;

    for (let i = 1; i <= rings; i++) {
      const r = params.apertureSize + i * step;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  drawCentripetal(ctx, cx, cy, maxRadius, params) {
    const n = params.rayCount;
    const rInner = params.apertureSize;

    for (let i = 0; i < n; i++) {
      const ang = (i * 2 * Math.PI) / n;
      const xOuter = cx + Math.cos(ang) * maxRadius;
      const yOuter = cy + Math.sin(ang) * maxRadius;

      // Inward bend toward center
      ctx.beginPath();
      ctx.moveTo(xOuter, yOuter);
      const midX = cx + Math.cos(ang + 0.3) * (maxRadius * 0.5);
      const midY = cy + Math.sin(ang + 0.3) * (maxRadius * 0.5);
      const inX = cx + Math.cos(ang) * rInner;
      const inY = cy + Math.sin(ang) * rInner;

      ctx.lineTo(midX, midY);
      ctx.lineTo(inX, inY);
      ctx.stroke();
    }
  },

  drawSpiral(ctx, cx, cy, maxRadius, params) {
    const turns = 8;
    const pts = turns * 72;
    ctx.beginPath();
    for (let i = 0; i <= pts; i++) {
      const theta = (i * 2 * Math.PI) / 72;
      const r = (theta / (turns * 2 * Math.PI)) * maxRadius;
      const x = cx + Math.cos(theta) * r;
      const y = cy + Math.sin(theta) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  },

  drawRadialLines(ctx, cx, cy, radius, count) {
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
    }
  }
};
// Chapter 8: Anomaly - Regularity Disruption, Focal Epicenter & Structural Fractures


const Chapter8 = {
  id: 8,
  defaultParams: {
    anomalyType: "focal", // focal (in module), fracture (in structure), tear, monotony
    epicenterX: 0.5, // 0.0 to 1.0 (relative to canvas width)
    epicenterY: 0.5, // 0.0 to 1.0
    distortionRadius: 180,
    disruptionIntensity: 75,
    gridSize: 45,
    regularShape: "square",
    anomalousShape: "triangle",
    highlightColor: true
  },

  controls: [
    {
      id: "anomalyType",
      label: "Anomaly Manifestation",
      type: "select",
      options: [
        { value: "focal", label: "Fig. 56a: Focal Module Anomaly (Attracting Eye)" },
        { value: "fracture", label: "Fig. 56d: Structural Fault Line / Tectonic Rupture" },
        { value: "monotony", label: "Fig. 57a: Relieving Monotony (Gentle Swell)" },
        { value: "tear", label: "Fig. 58e: Void Tear / Structural Disintegration" }
      ]
    },
    { id: "disruptionIntensity", label: "Disruption Severity", type: "range", min: 10, max: 100, step: 2 },
    { id: "distortionRadius", label: "Anomaly Influence Radius", type: "range", min: 60, max: 350, step: 10 },
    { id: "gridSize", label: "Base Regular Grid Size", type: "range", min: 30, max: 80, step: 5 },
    { id: "highlightColor", label: "Highlight Anomaly Accent Color", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 56a: Singular Intruder",
      description: "A single contrasting triangular module breaks a field of rigid squares.",
      params: { anomalyType: "focal", disruptionIntensity: 50, distortionRadius: 120, highlightColor: true }
    },
    {
      name: "Fig. 56d: Tectonic Fracture",
      description: "A jagged fault-line shears through the regular structural columns.",
      params: { anomalyType: "fracture", disruptionIntensity: 85, distortionRadius: 220, highlightColor: false }
    },
    {
      name: "Fig. 57a: Compression Swell",
      description: "Modules stretch and bend around a central gravity distortion.",
      params: { anomalyType: "monotony", disruptionIntensity: 65, distortionRadius: 260 }
    },
    {
      name: "Fig. 58e: Disintegration Void",
      description: "Regular matrix torn open, leaving a dramatic negative rift.",
      params: { anomalyType: "tear", disruptionIntensity: 90, distortionRadius: 200 }
    }
  ],

  // Interactive mouse/touch click allows user to reposition the anomaly epicenter!
  onCanvasClick(e, rect, params) {
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;
    params.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
    params.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
  },

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 40);

    const epiX = params.epicenterX * width;
    const epiY = params.epicenterY * height;
    const sz = params.gridSize;
    const cols = Math.floor(width / sz);
    const rows = Math.floor(height / sz);
    const padX = (width - cols * sz) / 2;
    const padY = (height - rows * sz) / 2;

    ctx.save();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let x = padX + (c + 0.5) * sz;
        let y = padY + (r + 0.5) * sz;

        const distToEpicenter = Math.hypot(x - epiX, y - epiY);
        const inZone = distToEpicenter < params.distortionRadius;
        const factor = inZone ? (1 - distToEpicenter / params.distortionRadius) : 0;

        ctx.save();

        if (params.anomalyType === "focal") {
          // If closest to epicenter, substitute anomalous shape
          const isClosest = distToEpicenter < sz * 0.75;
          ctx.translate(x, y);

          if (isClosest) {
            ctx.fillStyle = params.highlightColor ? palette.accent : palette.fg;
            // Draw anomaly intruder: rotated triangle
            ctx.rotate(Math.PI / 6);
            CanvasUtils.drawPolygon(ctx, 0, 0, sz * 0.42, 3, -Math.PI / 2);
            ctx.fill();
          } else {
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.35, -sz * 0.35, sz * 0.7, sz * 0.7);
          }

        } else if (params.anomalyType === "fracture") {
          // Fault line: vertical shear offset along fracture line
          let shearY = 0;
          if (Math.abs(x - epiX) < params.distortionRadius * 0.4) {
            const jag = Math.sin(y * 0.05) * 15;
            shearY = (y > epiY ? 1 : -1) * (params.disruptionIntensity * 0.5) + jag;
            x += (Math.random() - 0.5) * (factor * 12);
          }

          ctx.translate(x, y + shearY);
          ctx.rotate((factor * (params.disruptionIntensity / 100) * Math.PI) / 3);
          ctx.fillStyle = (factor > 0.6 && params.highlightColor) ? palette.accent : palette.fg;
          ctx.fillRect(-sz * 0.38, -sz * 0.38, sz * 0.76, sz * 0.76);

        } else if (params.anomalyType === "monotony") {
          // Compression swell: push outwards from epicenter
          if (inZone) {
            const angle = Math.atan2(y - epiY, x - epiX);
            const push = Math.sin(factor * Math.PI) * (params.disruptionIntensity * 0.6);
            x += Math.cos(angle) * push;
            y += Math.sin(angle) * push;
          }

          ctx.translate(x, y);
          const currentSize = sz * (0.7 + factor * 0.4);
          ctx.fillStyle = palette.fg;
          ctx.fillRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);

        } else if (params.anomalyType === "tear") {
          // Void tear: cells inside epicenter disintegrate into broken fragments or vanish
          if (factor > 0.6) {
            // Vanished void
          } else if (factor > 0.2) {
            // Shattered debris
            ctx.translate(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20);
            ctx.rotate(Math.random() * Math.PI);
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.2, -sz * 0.2, sz * 0.4, sz * 0.4);
          } else {
            ctx.translate(x, y);
            ctx.fillStyle = palette.fg;
            ctx.fillRect(-sz * 0.38, -sz * 0.38, sz * 0.76, sz * 0.76);
          }
        }

        ctx.restore();
      }
    }

    // Epicenter target reticle
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(epiX, epiY, 8, 0, Math.PI * 2);
    ctx.moveTo(epiX - 14, epiY);
    ctx.lineTo(epiX + 14, epiY);
    ctx.moveTo(epiX, epiY - 14);
    ctx.lineTo(epiX, epiY + 14);
    ctx.stroke();

    ctx.restore();
  }
};
// Chapter 9: Contrast - Opposites, Dominance, Emphasis & Dynamic Equilibrium


const Chapter9 = {
  id: 9,
  defaultParams: {
    contrastType: "scale", // scale, shape, direction, dominance
    dominanceRatio: 85, // % occupied by majority
    elementCount: 28,
    majorityShape: "rectilinear", // rectilinear vs organic
    minorityShape: "curvilinear",
    showBalanceScale: true
  },

  controls: [
    {
      id: "contrastType",
      label: "Contrast Dimension",
      type: "select",
      options: [
        { value: "scale", label: "Fig. 59b: Contrast of Scale (Monolith vs. Micro)" },
        { value: "shape", label: "Fig. 59a: Contrast of Shape (Curvilinear vs. Rectilinear)" },
        { value: "direction", label: "Fig. 59e: Contrast of Direction (Orthogonal vs. Acute)" },
        { value: "dominance", label: "Fig. 63a: Dominance & Emphasis (Visual Weight Balance)" }
      ]
    },
    { id: "dominanceRatio", label: "Dominance Ratio (Majority %)", type: "range", min: 60, max: 95, step: 1, unit: "%" },
    { id: "elementCount", label: "Element Count", type: "range", min: 10, max: 60, step: 2 },
    { id: "showBalanceScale", label: "Show Dynamic Visual Weight Gauge", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 63a: Heavy Monoliths & Micro Dots",
      description: "Dominant rectilinear slabs paired with a tiny cluster of floating circular accents.",
      params: { contrastType: "dominance", dominanceRatio: 90, elementCount: 22 }
    },
    {
      name: "Fig. 59a: Curvilinear vs Rectilinear",
      description: "Organic soft blobs clashing with sharp mathematical rectangles.",
      params: { contrastType: "shape", dominanceRatio: 75, elementCount: 26 }
    },
    {
      name: "Fig. 61b: Asymmetric Balance",
      description: "A large mass near the fulcrum counterbalanced by a small mass far on the opposite arm.",
      params: { contrastType: "scale", dominanceRatio: 85, elementCount: 16 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, true, 45);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();

    if (params.contrastType === "dominance" || params.contrastType === "scale") {
      // Large dominant forms anchoring the composition
      ctx.fillStyle = palette.fg;

      // Dominant slab
      const slabW = width * 0.45;
      const slabH = height * 0.55;
      ctx.fillRect(cx - slabW * 0.65, cy - slabH * 0.5, slabW, slabH);

      // Secondary contrasting element (minority emphasis)
      const accentCount = Math.max(1, Math.round(params.elementCount * (1 - params.dominanceRatio / 100)));
      ctx.fillStyle = palette.accent;

      for (let i = 0; i < accentCount; i++) {
        const dotX = cx + slabW * 0.45 + (i % 3) * 28;
        const dotY = cy - slabH * 0.3 + Math.floor(i / 3) * 32;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 9, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (params.contrastType === "shape") {
      // Rectilinear bars vs organic circles
      const total = params.elementCount;
      const majCount = Math.round((total * params.dominanceRatio) / 100);
      const minCount = total - majCount;

      ctx.fillStyle = palette.fg;
      for (let i = 0; i < majCount; i++) {
        const x = 50 + (i % 6) * (width * 0.12);
        const y = 60 + Math.floor(i / 6) * 70;
        ctx.fillRect(x, y, 45, 45);
      }

      ctx.fillStyle = palette.accent;
      for (let j = 0; j < minCount; j++) {
        const x = width * 0.72 + (j % 2) * 55;
        const y = height * 0.4 + Math.floor(j / 2) * 65;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (params.contrastType === "direction") {
      // Rigid vertical beams vs acute diagonal slashes
      ctx.fillStyle = palette.fg;
      for (let i = 0; i < 7; i++) {
        ctx.fillRect(70 + i * 55, 60, 24, height - 120);
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = palette.accent;
      ctx.fillRect(-width * 0.35, -18, width * 0.7, 36);
      ctx.restore();
    }

    // Dynamic Balance Scale / Gauge at the bottom (Fig. 61)
    if (params.showBalanceScale) {
      const baseY = height - 35;
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 150, baseY);
      ctx.lineTo(cx + 150, baseY);
      ctx.stroke();

      // Fulcrum triangle
      CanvasUtils.drawPolygon(ctx, cx, baseY + 12, 12, 3, -Math.PI / 2);
      ctx.fillStyle = palette.fg;
      ctx.fill();

      // Labels
      ctx.font = "10px monospace";
      ctx.fillText(`DOMINANCE: ${params.dominanceRatio}%`, cx - 145, baseY - 8);
      ctx.fillStyle = palette.accent;
      ctx.fillText(`EMPHASIS: ${100 - params.dominanceRatio}%`, cx + 60, baseY - 8);
    }

    ctx.restore();
  }
};
// Chapter 10: Concentration - Gathering, Scattering, Attractors & Voids


const Chapter10 = {
  id: 10,
  defaultParams: {
    concentrationMode: "point", // point, line, free, void, super
    particleCount: 220,
    attractorPower: 65,
    dispersion: 40,
    particleType: "teardrop", // teardrop, dot, diamond
    alignToField: true,
    centerX: 0.5,
    centerY: 0.5
  },

  controls: [
    {
      id: "concentrationMode",
      label: "Concentration Structure",
      type: "select",
      options: [
        { value: "point", label: "Fig. 65a: Concentration Toward a Point" },
        { value: "void", label: "Fig. 65b: Concentration Away from a Point (Void)" },
        { value: "line", label: "Fig. 65c: Concentration Toward a Line" },
        { value: "free", label: "Fig. 65e: Free Concentration (Multiple Hotspots)" },
        { value: "super", label: "Fig. 66c: Super-concentration (Dense Cluster)" }
      ]
    },
    {
      id: "particleType",
      label: "Module Morphology",
      type: "select",
      options: [
        { value: "teardrop", label: "Directional Teardrop (Fig. 66)" },
        { value: "dot", label: "Circular Dots" },
        { value: "diamond", label: "Rhombic Diamonds" }
      ]
    },
    { id: "particleCount", label: "Module Quantity (Population)", type: "range", min: 80, max: 450, step: 10 },
    { id: "attractorPower", label: "Gathering Force (Pull)", type: "range", min: 20, max: 100, step: 2 },
    { id: "alignToField", label: "Orient Modules Along Field Direction", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 66e: Teardrop Vortex to Center",
      description: "Organic teardrop unit forms streaming rapidly toward a central gravitational vortex.",
      params: { concentrationMode: "point", particleType: "teardrop", particleCount: 260, attractorPower: 80, alignToField: true }
    },
    {
      name: "Fig. 65b: Centrifugal Void",
      description: "Modules flee the central coordinate, leaving a striking negative clearing.",
      params: { concentrationMode: "void", particleType: "dot", particleCount: 200, attractorPower: 70 }
    },
    {
      name: "Fig. 65c: Riverbank Concentration Line",
      description: "High-density gathering along a horizontal central fault.",
      params: { concentrationMode: "line", particleType: "diamond", particleCount: 240, attractorPower: 75 }
    }
  ],

  onCanvasClick(e, rect, params) {
    params.centerX = (e.clientX - rect.left) / rect.width;
    params.centerY = (e.clientY - rect.top) / rect.height;
  },

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = params.centerX * width;
    const cy = params.centerY * height;
    const count = params.particleCount;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    // Deterministic pseudo-random generation with clustering distribution
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin(i * 12.9898) * 43758.5453;
      const seed2 = Math.cos(i * 78.233) * 23421.631;
      const rand1 = seed1 - Math.floor(seed1);
      const rand2 = seed2 - Math.floor(seed2);

      let px, py;
      const power = params.attractorPower / 100;

      if (params.concentrationMode === "point") {
        // Power distribution clustering strongly near center
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 1 / (1 - power * 0.75)) * (width * 0.48);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;

      } else if (params.concentrationMode === "void") {
        // Void in center
        const angle = rand1 * Math.PI * 2;
        const innerVoid = 80;
        const dist = innerVoid + Math.pow(rand2, 0.6) * (width * 0.42);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;

      } else if (params.concentrationMode === "line") {
        px = rand1 * width;
        const yDist = Math.pow(rand2, 1 / (1 - power * 0.8)) * (height * 0.45);
        py = cy + (i % 2 === 0 ? 1 : -1) * yDist;

      } else if (params.concentrationMode === "free") {
        // Two interacting cluster centers
        const c1 = { x: width * 0.3, y: height * 0.4 };
        const c2 = { x: width * 0.7, y: height * 0.65 };
        const target = i % 2 === 0 ? c1 : c2;
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 2.0) * (width * 0.35);
        px = target.x + Math.cos(angle) * dist;
        py = target.y + Math.sin(angle) * dist;

      } else { // super
        const angle = rand1 * Math.PI * 2;
        const dist = Math.pow(rand2, 3.2) * (width * 0.3);
        px = cx + Math.cos(angle) * dist;
        py = cy + Math.sin(angle) * dist;
      }

      // Orientation angle pointing toward attractor center
      let angleToCenter = Math.atan2(cy - py, cx - px);
      if (!params.alignToField) angleToCenter = 0;

      // Distance factor for scale
      const distCenter = Math.hypot(px - cx, py - cy);
      const scaleFactor = Math.max(0.3, Math.min(1.4, 1.2 - distCenter / (width * 0.5)));

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angleToCenter + Math.PI / 2);

      if (params.particleType === "teardrop") {
        CanvasUtils.drawTeardrop(ctx, 0, 0, 8 * scaleFactor, 18 * scaleFactor, 0);
        ctx.fill();
      } else if (params.particleType === "dot") {
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
      } else if (params.particleType === "diamond") {
        CanvasUtils.drawPolygon(ctx, 0, 0, 7 * scaleFactor, 4, Math.PI / 4);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }
};
// Chapter 11: Texture - Visual Grain, Typographic Fields & Halftones


const Chapter11 = {
  id: 11,
  defaultParams: {
    textureMode: "typography", // typography, halftone, decorative, spontaneous
    glyphSet: "latin", // latin, chinese, geometric
    density: 55,
    fontScale: 18,
    contrastThreshold: 45,
    rotationVariance: 45,
    overlayGrain: true
  },

  controls: [
    {
      id: "textureMode",
      label: "Texture Category",
      type: "select",
      options: [
        { value: "typography", label: "Fig. 71: Typography as Visual Texture (Wong Exercise)" },
        { value: "halftone", label: "Fig. 67c: Mechanical Halftone Raster" },
        { value: "decorative", label: "Fig. 68a: Decorative Linear Wave Pattern" },
        { value: "spontaneous", label: "Fig. 69b: Spontaneous Splatter & Grain" }
      ]
    },
    {
      id: "glyphSet",
      label: "Typographic Character Set",
      type: "select",
      options: [
        { value: "latin", label: "Latin Bold Display (A-Z, 0-9)" },
        { value: "swiss", label: "Swiss Grotesk Neutral (HELVETICA)" },
        { value: "symbols", label: "Constructivist Symbols & Blocks" }
      ]
    },
    { id: "density", label: "Packing Density", type: "range", min: 20, max: 90, step: 2 },
    { id: "fontScale", label: "Glyph / Grain Scale", type: "range", min: 8, max: 48, step: 2 },
    { id: "rotationVariance", label: "Rotational Freedom", type: "range", min: 0, max: 180, step: 15, unit: "°" }
  ],

  presets: [
    {
      name: "Fig. 71c: Dense Typographic Collage",
      description: "Layered bold letterforms woven into an intricate optical tonal carpet.",
      params: { textureMode: "typography", glyphSet: "latin", density: 70, fontScale: 20, rotationVariance: 90 }
    },
    {
      name: "Fig. 67c: Mechanical Dot Screen",
      description: "Mathematical halftone dots producing smooth continuous gradation.",
      params: { textureMode: "halftone", density: 40, fontScale: 14 }
    },
    {
      name: "Fig. 68a: Woven Linear Ribbing",
      description: "Fine hand-drawn parallel ridges generating organic tactile vibration.",
      params: { textureMode: "decorative", density: 60, fontScale: 16 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, false);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.fillStyle = palette.fg;
    ctx.strokeStyle = palette.fg;

    if (params.textureMode === "typography") {
      // Wong's famous typographic texture exercise (Fig. 71)
      const letters = params.glyphSet === "latin"
        ? ["A", "B", "R", "K", "X", "M", "Q", "S", "8", "E", "W", "Z", "N", "H"]
        : ["■", "▲", "●", "◆", "┼", "│", "─", "╱", "╲", "░", "▒", "▓"];

      const step = Math.max(12, 60 - params.density * 0.5);
      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * step;
          const y = (r + 0.5) * step;

          // Deterministic seed
          const seed = Math.sin(r * 45.12 + c * 91.34) * 43758.5453;
          const rand = seed - Math.floor(seed);
          const char = letters[Math.floor(rand * letters.length)];

          // Dynamic scale based on distance from center for tonal gradient
          const distToCenter = Math.hypot(x - cx, y - cy);
          const tone = 0.5 + 0.5 * Math.sin(distToCenter * 0.015);
          const size = params.fontScale * (0.8 + rand * 0.6) * (0.6 + tone * 0.8);

          ctx.save();
          ctx.translate(x, y);
          const rotAngle = ((rand - 0.5) * params.rotationVariance * Math.PI) / 90;
          ctx.rotate(rotAngle);
          ctx.font = `bold ${Math.round(size)}px 'Space Grotesk', 'Helvetica Neue', sans-serif`;

          // Opacity variation
          ctx.globalAlpha = 0.4 + tone * 0.6;
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }

    } else if (params.textureMode === "halftone") {
      // Mechanical halftone screen
      const spacing = 18;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dist = Math.hypot(x - cx, y - cy);
          const maxR = spacing * 0.48;
          const radius = Math.max(0.5, (1 - dist / (width * 0.55)) * maxR);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

    } else if (params.textureMode === "decorative") {
      // Decorative linear wave ridges
      const lines = 40;
      const lineStep = height / lines;
      ctx.lineWidth = 2.5;

      for (let i = 0; i <= lines; i++) {
        const y = i * lineStep;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= width; x += 15) {
          const wave = Math.sin(x * 0.05 + i * 0.4) * 8;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

    } else if (params.textureMode === "spontaneous") {
      // Spontaneous ink splatter
      for (let i = 0; i < 400; i++) {
        const seed = Math.sin(i * 123.45) * 43758.5453;
        const rand = seed - Math.floor(seed);
        const x = ((i * 137.5) % width);
        const y = ((i * 269.3) % height);
        const r = Math.pow(rand, 3) * 12 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
};
// Chapter 12: Space - Flat vs Illusory, Fluctuating Depth & Conflicting Paradoxes


const Chapter12 = {
  id: 12,
  defaultParams: {
    spaceMode: "conflicting", // flat, illusory, fluctuating, conflicting
    illusionDepth: 60,
    cubeCount: 5,
    shadingContrast: 80,
    showIsometricGuides: true,
    impossibleJoint: true
  },

  controls: [
    {
      id: "spaceMode",
      label: "Spatial Category",
      type: "select",
      options: [
        { value: "conflicting", label: "Fig. 77: Conflicting (Impossible) Isometric Space" },
        { value: "fluctuating", label: "Fig. 76: Fluctuating Reversible Spatial Planes" },
        { value: "illusory", label: "Fig. 74d: Illusory Isometric Cube Train" },
        { value: "flat", label: "Fig. 72a: Pure Flat Figure-Ground Ambiguity" }
      ]
    },
    { id: "illusionDepth", label: "Perspective / Shear Depth", type: "range", min: 20, max: 100, step: 5 },
    { id: "shadingContrast", label: "Tonal Shading Contrast", type: "range", min: 30, max: 100, step: 5 },
    { id: "impossibleJoint", label: "Impossible Optical Interlock", type: "checkbox" },
    { id: "showIsometricGuides", label: "Show Isometric Guidelines", type: "checkbox" }
  ],

  presets: [
    {
      name: "Fig. 77b: Impossible Isometric Tower",
      description: "Contradictory planes where staircases and beams wrap simultaneously front and back.",
      params: { spaceMode: "conflicting", illusionDepth: 70, impossibleJoint: true }
    },
    {
      name: "Fig. 76b: Fluctuating Ribbon Step",
      description: "A zigzag plane that oscillates in perception between facing upward and downward.",
      params: { spaceMode: "fluctuating", illusionDepth: 55 }
    },
    {
      name: "Fig. 74d: Receding Cube Train",
      description: "Isometric solid cubes stepping diagonally into deep space.",
      params: { spaceMode: "illusory", cubeCount: 4, illusionDepth: 60 }
    }
  ],

  render(ctx, width, height, params, palette) {
    CanvasUtils.clear(ctx, width, height, palette, params.showIsometricGuides, 40);

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = palette.fg;

    if (params.spaceMode === "conflicting") {
      // Impossible Escher/Wong optical box with conflicting depth lines (Fig. 77)
      this.drawImpossibleBlock(ctx, cx, cy, 140, params, palette);

    } else if (params.spaceMode === "fluctuating") {
      // Reversible fluctuating step (Fig. 76a / 76b)
      this.drawFluctuatingStep(ctx, cx, cy, 130, params, palette);

    } else if (params.spaceMode === "illusory") {
      // Receding isometric cubes
      const count = params.cubeCount;
      const sz = 55;
      for (let i = 0; i < count; i++) {
        const x = cx - (count / 2 - i) * 65;
        const y = cy - (count / 2 - i) * 45;
        this.drawSolidIsometricCube(ctx, x, y, sz, palette);
      }

    } else if (params.spaceMode === "flat") {
      // Flat reversible figure-ground grid (Fig. 72a)
      const sz = 60;
      const cols = 6;
      const rows = 6;
      const startX = cx - (cols * sz) / 2;
      const startY = cy - (rows * sz) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * sz;
          const y = startY + r * sz;
          const isOdd = (r + c) % 2 === 1;

          ctx.fillStyle = isOdd ? palette.fg : palette.bg;
          ctx.fillRect(x, y, sz, sz);

          ctx.fillStyle = isOdd ? palette.bg : palette.fg;
          ctx.beginPath();
          ctx.arc(x + sz / 2, y + sz / 2, sz * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  },

  drawImpossibleBlock(ctx, x, y, size, params, palette) {
    const s = size * 0.55;
    const h = s * 0.577; // 30 deg isometric angle

    // Draw the front frame
    ctx.save();
    ctx.translate(x, y);

    // Impossible hexagonal interlock
    ctx.fillStyle = palette.fg;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.4);
    ctx.lineTo(s * 1.2, -h * 0.8);
    ctx.lineTo(s * 1.2, h * 0.8);
    ctx.lineTo(0, s * 1.4);
    ctx.lineTo(-s * 1.2, h * 0.8);
    ctx.lineTo(-s * 1.2, -h * 0.8);
    ctx.closePath();
    ctx.stroke();

    // Internal contradictory bands (Wong Fig 77b)
    for (let i = -4; i <= 4; i++) {
      const offset = i * 16;
      ctx.beginPath();
      ctx.moveTo(-s * 0.9, offset);
      ctx.lineTo(0, offset + (params.impossibleJoint ? -20 : 20));
      ctx.lineTo(s * 0.9, offset);
      ctx.stroke();
    }

    ctx.restore();
  },

  drawFluctuatingStep(ctx, x, y, size, params, palette) {
    const s = size;
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = palette.fg;
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.3);
    ctx.lineTo(-s * 0.2, -s * 0.6);
    ctx.lineTo(s * 0.8, -s * 0.1);
    ctx.lineTo(0, s * 0.2);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, s * 0.2);
    ctx.lineTo(s * 0.8, -s * 0.1);
    ctx.lineTo(s * 0.8, s * 0.5);
    ctx.lineTo(0, s * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  drawSolidIsometricCube(ctx, x, y, size, palette) {
    const s = size;
    const dx = s * Math.cos(Math.PI / 6);
    const dy = s * Math.sin(Math.PI / 6);

    // Top face
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + dx, y - s + dy);
    ctx.lineTo(x, y - s + 2 * dy);
    ctx.lineTo(x - dx, y - s + dy);
    ctx.closePath();
    ctx.fillStyle = palette.bg;
    ctx.fill();
    ctx.stroke();

    // Left face (Darker)
    ctx.beginPath();
    ctx.moveTo(x - dx, y - s + dy);
    ctx.lineTo(x, y - s + 2 * dy);
    ctx.lineTo(x, y + dy);
    ctx.lineTo(x - dx, y);
    ctx.closePath();
    ctx.fillStyle = palette.fg;
    ctx.fill();
    ctx.stroke();

    // Right face (Hatched or medium)
    ctx.beginPath();
    ctx.moveTo(x, y - s + 2 * dy);
    ctx.lineTo(x + dx, y - s + dy);
    ctx.lineTo(x + dx, y);
    ctx.lineTo(x, y + dy);
    ctx.closePath();
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.stroke();
  }
};


  // Main Application Controller for Wucius Wong 2D Design Studio





// Import all 12 Two-Dimensional Chapter Modules (for Theory reference plate)













class WongApp {
  constructor() {
    this.chaptersMap = {
      1: Chapter1,
      2: Chapter2,
      3: Chapter3,
      4: Chapter4,
      5: Chapter5,
      6: Chapter6,
      7: Chapter7,
      8: Chapter8,
      9: Chapter9,
      10: Chapter10,
      11: Chapter11,
      12: Chapter12
    };

    this.currentMode = "studio"; // "studio" or "theory"
    this.currentChapterId = 1;
    this.currentPaletteKey = "monochrome";
    this.theme = "light";

    // Engines & Canvas references
    this.studioCanvas = document.getElementById("studio-canvas");
    this.theoryCanvas = document.getElementById("theory-canvas");
    this.studioEngine = new StudioEngine(this.studioCanvas);

    this.init();
  }

  init() {
    // Theme setup from preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme("dark");
    }

    this.initNavigation();
    this.initStudioShapePickers();
    this.initStudioEventListeners();
    this.initTheorySidebar();
    this.initTheoryDropdown();
    this.initGlobalEvents();

    // Default mode is Studio
    this.setMode("studio");
    this.loadTheoryChapter(1);

    // Initial lucide icons render
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" 
        ? `<i data-lucide="sun" class="w-4 h-4"></i>` 
        : `<i data-lucide="moon" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    this.renderCurrentView();
  }

  // ============================================================
  // NAVIGATION & VIEW MODE SWITCHING (Theory vs Studio)
  // ============================================================
  initNavigation() {
    const theoryBtn = document.getElementById("mode-theory-btn");
    const studioBtn = document.getElementById("mode-studio-btn");

    theoryBtn?.addEventListener("click", () => this.setMode("theory"));
    studioBtn?.addEventListener("click", () => this.setMode("studio"));
  }

  setMode(mode) {
    this.currentMode = mode;

    const theoryView = document.getElementById("theory-view");
    const studioView = document.getElementById("studio-view");
    const theoryBtn = document.getElementById("mode-theory-btn");
    const studioBtn = document.getElementById("mode-studio-btn");
    const theoryNav = document.getElementById("theory-chapter-nav");
    const studioHeader = document.getElementById("studio-center-header");
    const modeBadge = document.getElementById("nav-mode-badge");
    const subtitle = document.getElementById("nav-subtitle");

    if (mode === "studio") {
      theoryView?.classList.add("hidden");
      studioView?.classList.remove("hidden");

      studioBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-medium shadow-sm transition-all";
      theoryBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all";

      theoryNav?.classList.add("hidden");
      theoryNav?.classList.remove("flex");
      studioHeader?.classList.remove("hidden");
      studioHeader?.classList.add("flex");

      if (modeBadge) modeBadge.textContent = "Studio";
      if (subtitle) subtitle.textContent = "Principles of Two-Dimensional Design • Composition Studio";

      this.renderStudio();
    } else {
      studioView?.classList.add("hidden");
      theoryView?.classList.remove("hidden");

      theoryBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--bg-card)] text-[var(--text-primary)] font-medium shadow-sm transition-all";
      studioBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all";

      studioHeader?.classList.add("hidden");
      studioHeader?.classList.remove("flex");
      theoryNav?.classList.remove("hidden");
      theoryNav?.classList.add("flex");

      if (modeBadge) modeBadge.textContent = "Theory";
      if (subtitle) subtitle.textContent = "Principles of Two-Dimensional Design • Handbook & Theory";

      this.renderTheoryPlate();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderCurrentView() {
    if (this.currentMode === "studio") {
      this.renderStudio();
    } else {
      this.renderTheoryPlate();
    }
  }

  // ============================================================
  // STUDIO: COMPOSITION ENGINE & INTERFACE
  // ============================================================
  initStudioShapePickers() {
    const containerA = document.getElementById("form-a-shape-picker");
    const containerB = document.getElementById("form-b-shape-picker");

    if (!containerA || !containerB) return;

    containerA.innerHTML = "";
    containerB.innerHTML = "";

    const shapeKeys = Object.keys(Shapes);

    shapeKeys.forEach(key => {
      const shape = Shapes[key];

      // Form A button
      const btnA = document.createElement("button");
      btnA.className = `shape-btn ${this.studioEngine.state.formA.shape === key ? 'active' : ''}`;
      btnA.dataset.shape = key;
      btnA.title = shape.name;
      btnA.innerHTML = shape.iconSvg;
      btnA.addEventListener("click", () => {
        containerA.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btnA.classList.add("active");
        this.studioEngine.state.formA.shape = key;
        const nameBadge = document.getElementById("form-a-name-badge");
        if (nameBadge) nameBadge.textContent = shape.name;
        this.renderStudio();
      });
      containerA.appendChild(btnA);

      // Form B button
      const btnB = document.createElement("button");
      btnB.className = `shape-btn ${this.studioEngine.state.formB.shape === key ? 'active' : ''}`;
      btnB.dataset.shape = key;
      btnB.title = shape.name;
      btnB.innerHTML = shape.iconSvg;
      btnB.addEventListener("click", () => {
        containerB.querySelectorAll(".shape-btn").forEach(b => b.classList.remove("active"));
        btnB.classList.add("active");
        this.studioEngine.state.formB.shape = key;
        this.renderStudio();
      });
      containerB.appendChild(btnB);
    });
  }

  initStudioEventListeners() {
    // Form A Scale & Rotation
    const scaleA = document.getElementById("input-form-a-scale");
    const rotA = document.getElementById("input-form-a-rotation");
    const valScaleA = document.getElementById("val-form-a-scale");
    const valRotA = document.getElementById("val-form-a-rotation");

    scaleA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.scale = v;
      if (valScaleA) valScaleA.textContent = v;
      this.renderStudio();
    });

    rotA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.rotation = v;
      if (valRotA) valRotA.textContent = `${v}°`;
      this.renderStudio();
    });

    // Form A Offsets
    const offXA = document.getElementById("input-form-a-offset-x");
    const offYA = document.getElementById("input-form-a-offset-y");
    const valOffXA = document.getElementById("val-form-a-offset-x");
    const valOffYA = document.getElementById("val-form-a-offset-y");

    offXA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.offsetX = v;
      if (valOffXA) valOffXA.textContent = `${v}px`;
      this.renderStudio();
    });

    offYA?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formA.offsetY = v;
      if (valOffYA) valOffYA.textContent = `${v}px`;
      this.renderStudio();
    });

    // Form B Scale, Rotation, Offsets
    const scaleB = document.getElementById("input-form-b-scale");
    const rotB = document.getElementById("input-form-b-rotation");
    const offX = document.getElementById("input-form-b-offset-x");
    const offY = document.getElementById("input-form-b-offset-y");
    const valScaleB = document.getElementById("val-form-b-scale");
    const valRotB = document.getElementById("val-form-b-rotation");
    const valOffX = document.getElementById("val-form-b-offset-x");
    const valOffY = document.getElementById("val-form-b-offset-y");

    scaleB?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.scale = v;
      if (valScaleB) valScaleB.textContent = v;
      this.renderStudio();
    });

    rotB?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.rotation = v;
      if (valRotB) valRotB.textContent = `${v}°`;
      this.renderStudio();
    });

    offX?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.offsetX = v;
      if (valOffX) valOffX.textContent = `${v}px`;
      this.renderStudio();
    });

    offY?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.formB.offsetY = v;
      if (valOffY) valOffY.textContent = `${v}px`;
      this.renderStudio();
    });

    // Toggle Form B Enabled/Disabled (+ to add, - to remove)
    const toggleFormBBtn = document.getElementById("toggle-form-b-btn");
    const formBStatusBadge = document.getElementById("form-b-status-badge");
    const formBControls = document.getElementById("form-b-controls");
    const formBPicker = document.getElementById("form-b-shape-picker");

    toggleFormBBtn?.addEventListener("click", () => {
      const current = this.studioEngine.state.formB.enabled;
      this.studioEngine.state.formB.enabled = !current;
      const isEnabled = this.studioEngine.state.formB.enabled;

      if (isEnabled) {
        formBStatusBadge.textContent = "Active";
        formBStatusBadge.className = "text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        formBControls.classList.remove("opacity-40", "pointer-events-none");
        formBPicker.classList.remove("opacity-40", "pointer-events-none");
        toggleFormBBtn.innerHTML = `<i data-lucide="minus" class="w-3.5 h-3.5"></i>`;
        toggleFormBBtn.title = "Deactivate Form B";
        this.showToast("Form B Activated");
      } else {
        formBStatusBadge.textContent = "Inactive";
        formBStatusBadge.className = "text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--border-color)] text-[var(--text-muted)]";
        formBControls.classList.add("opacity-40", "pointer-events-none");
        formBPicker.classList.add("opacity-40", "pointer-events-none");
        toggleFormBBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5"></i>`;
        toggleFormBBtn.title = "Activate Form B";
        this.showToast("Form B Disabled (Single Form Mode)");
      }
      if (window.lucide) window.lucide.createIcons();
      this.renderStudio();
    });

    // Interrelation Select
    const interrelationSelect = document.getElementById("interrelation-select");
    interrelationSelect?.addEventListener("change", (e) => {
      this.studioEngine.state.interrelation = e.target.value;
      this.renderStudio();
    });

    // Repetition Modifier Toggle (Accordion Expansion)
    const repToggle = document.getElementById("mod-repetition-toggle");
    const repAccordion = document.getElementById("accordion-repetition");

    repToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.repetition.enabled = isChecked;
      if (isChecked) {
        repAccordion?.classList.remove("hidden");
        if (this.studioEngine.state.modifiers.radiation.enabled) {
          this.studioEngine.state.modifiers.radiation.enabled = false;
          const radToggleEl = document.getElementById("mod-radiation-toggle");
          if (radToggleEl) radToggleEl.checked = false;
          document.getElementById("accordion-radiation")?.classList.add("hidden");
          this.showToast("Repetition active: switched to Cartesian grid (Radiation deactivated).", 4000);
        } else {
          this.showToast("Repetition Modifier Activated (Cartesian Matrix)");
        }
      } else {
        repAccordion?.classList.add("hidden");
        this.showToast("Repetition Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    // Repetition Grid Variation
    document.getElementById("rep-grid-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.gridType = e.target.value;
      this.renderStudio();
    });

    // Repetition Columns & Rows
    const colsInput = document.getElementById("input-rep-cols");
    const rowsInput = document.getElementById("input-rep-rows");
    const valCols = document.getElementById("val-rep-cols");
    const valRows = document.getElementById("val-rep-rows");

    colsInput?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.repetition.cols = v;
      if (valCols) valCols.textContent = v;
      this.renderStudio();
    });

    rowsInput?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.repetition.rows = v;
      if (valRows) valRows.textContent = v;
      this.renderStudio();
    });

    // Repetition Checkboxes
    document.getElementById("check-rep-active")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.activeClipping = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rep-visible")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.showGridLines = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rep-checker")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.repetition.checkerInvert = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Structure Modifier (Chapter 4)
    // ------------------------------------------------------------
    const structToggle = document.getElementById("mod-structure-toggle");
    const structAccordion = document.getElementById("accordion-structure");

    structToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.structure.enabled = isChecked;
      if (isChecked) {
        structAccordion?.classList.remove("hidden");
        const hasRad = this.studioEngine.state.modifiers.radiation.enabled;
        if (hasRad) {
          this.studioEngine.state.modifiers.radiation.enabled = false;
          const radToggleEl = document.getElementById("mod-radiation-toggle");
          if (radToggleEl) radToggleEl.checked = false;
          document.getElementById("accordion-radiation")?.classList.add("hidden");

          this.studioEngine.state.modifiers.repetition.enabled = true;
          const repToggleEl = document.getElementById("mod-repetition-toggle");
          if (repToggleEl) repToggleEl.checked = true;
          document.getElementById("accordion-repetition")?.classList.remove("hidden");

          this.showToast("Structure active: switched to Cartesian grid (Radiation deactivated).", 4000);
        } else {
          const hasRep = this.studioEngine.state.modifiers.repetition.enabled;
          if (!hasRep) {
            this.showToast("Structure modulates grid intervals. Activate 'Repetition' to visualize its effect on the composition.", 4200);
          } else {
            this.showToast("Structure Modifier Activated (Dual Rhythmic Intervals)");
          }
        }
      } else {
        structAccordion?.classList.add("hidden");
        this.showToast("Structure Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("struct-mode")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.structure.mode = e.target.value;
      this.renderStudio();
    });

    const colRatioInput = document.getElementById("input-struct-col-ratio");
    const rowRatioInput = document.getElementById("input-struct-row-ratio");
    const valColRatio = document.getElementById("val-struct-col-ratio");
    const valRowRatio = document.getElementById("val-struct-row-ratio");

    colRatioInput?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.structure.colRatio = v;
      if (valColRatio) valColRatio.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    rowRatioInput?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.structure.rowRatio = v;
      if (valRowRatio) valRowRatio.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    const checkBands = document.getElementById("check-struct-bands");
    const bandBox = document.getElementById("struct-band-box");
    checkBands?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.structure.showBands = isChecked;
      if (isChecked) bandBox?.classList.remove("hidden");
      else bandBox?.classList.add("hidden");
      this.renderStudio();
    });

    const bandThick = document.getElementById("input-struct-band-thick");
    const valBandThick = document.getElementById("val-struct-band-thick");
    bandThick?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.structure.bandThickness = v;
      if (valBandThick) valBandThick.textContent = `${v}px`;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Similarity Modifier (Chapter 5)
    // ------------------------------------------------------------
    const simToggle = document.getElementById("mod-similarity-toggle");
    const simAccordion = document.getElementById("accordion-similarity");

    simToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.similarity.enabled = isChecked;
      if (isChecked) {
        simAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Similarity operates across module families. Activate 'Repetition' or 'Radiation' to observe kinship variations.", 4200);
        } else {
          this.showToast("Similarity Modifier Activated (Kinship Fluctuation)");
        }
      } else {
        simAccordion?.classList.add("hidden");
        this.showToast("Similarity Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("sim-kinship-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.similarity.kinshipType = e.target.value;
      this.renderStudio();
    });

    const simIntensity = document.getElementById("input-sim-intensity");
    const valSimIntensity = document.getElementById("val-sim-intensity");
    simIntensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.similarity.intensity = v;
      if (valSimIntensity) valSimIntensity.textContent = `${v}%`;
      this.renderStudio();
    });

    const simJitter = document.getElementById("input-sim-jitter");
    const valSimJitter = document.getElementById("val-sim-jitter");
    simJitter?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.similarity.cellJitter = v;
      if (valSimJitter) valSimJitter.textContent = `${v}px`;
      this.renderStudio();
    });

    document.getElementById("btn-sim-shuffle")?.addEventListener("click", () => {
      this.studioEngine.state.modifiers.similarity.seed = Math.floor(Math.random() * 100000);
      this.renderStudio();
      this.showToast("Shuffled Visual Kinship Family");
    });

    // ------------------------------------------------------------
    // Gradation Modifier (Chapter 6)
    // ------------------------------------------------------------
    const gradToggle = document.getElementById("mod-gradation-toggle");
    const gradAccordion = document.getElementById("accordion-gradation");

    gradToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.gradation.enabled = isChecked;
      if (isChecked) {
        gradAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Gradation requires a progression of modules. Activate 'Repetition' or 'Radiation' to display dynamic transition on canvas.", 4200);
        } else {
          this.showToast("Gradation Modifier Activated (Progressive Dynamics)");
        }
      } else {
        gradAccordion?.classList.add("hidden");
        this.showToast("Gradation Modifier Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("grad-type")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.type = e.target.value;
      this.renderStudio();
    });

    document.getElementById("grad-pathway")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.pathway = e.target.value;
      this.renderStudio();
    });

    const gradRange = document.getElementById("input-grad-range");
    const valGradRange = document.getElementById("val-grad-range");
    gradRange?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.gradation.range = v;
      if (valGradRange) valGradRange.textContent = `${v}°`;
      this.renderStudio();
    });

    const gradCycles = document.getElementById("input-grad-cycles");
    const valGradCycles = document.getElementById("val-grad-cycles");
    gradCycles?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.gradation.steps = v;
      if (valGradCycles) valGradCycles.textContent = `${v}x`;
      this.renderStudio();
    });

    document.getElementById("check-grad-reverse")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.gradation.reverse = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Radiation Modifier (Chapter 7)
    // ------------------------------------------------------------
    const radToggle = document.getElementById("mod-radiation-toggle");
    const radAccordion = document.getElementById("accordion-radiation");

    radToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.radiation.enabled = isChecked;
      if (isChecked) {
        radAccordion?.classList.remove("hidden");
        const hadCartesian = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.structure.enabled;

        if (this.studioEngine.state.modifiers.repetition.enabled) {
          this.studioEngine.state.modifiers.repetition.enabled = false;
          const repToggleEl = document.getElementById("mod-repetition-toggle");
          if (repToggleEl) repToggleEl.checked = false;
          document.getElementById("accordion-repetition")?.classList.add("hidden");
        }
        if (this.studioEngine.state.modifiers.structure.enabled) {
          this.studioEngine.state.modifiers.structure.enabled = false;
          const structToggleEl = document.getElementById("mod-structure-toggle");
          if (structToggleEl) structToggleEl.checked = false;
          document.getElementById("accordion-structure")?.classList.add("hidden");
        }

        if (hadCartesian) {
          this.showToast("Radiation active: switched to polar system (Repetition and Structure deactivated).", 4000);
        } else {
          this.showToast("Radiation Active: Polar Structural Framework");
        }
      } else {
        radAccordion?.classList.add("hidden");
        this.showToast("Radiation Deactivated: Reverted to Base Study");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("rad-scheme")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.radiation.scheme = val;
      const twistBox = document.getElementById("rad-twist-box");
      if (twistBox) {
        if (val === "spiral") twistBox.classList.remove("opacity-40");
        else twistBox.classList.add("opacity-40");
      }
      this.renderStudio();
    });

    const radRays = document.getElementById("input-rad-rays");
    const valRadRays = document.getElementById("val-rad-rays");
    radRays?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.rays = v;
      if (valRadRays) valRadRays.textContent = `${v} rays`;
      this.renderStudio();
    });

    const radRings = document.getElementById("input-rad-rings");
    const valRadRings = document.getElementById("val-rad-rings");
    radRings?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.rings = v;
      if (valRadRings) valRadRings.textContent = `${v} rings`;
      this.renderStudio();
    });

    const radTwist = document.getElementById("input-rad-twist");
    const valRadTwist = document.getElementById("val-rad-twist");
    radTwist?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.radiation.spiralTwist = v;
      if (valRadTwist) valRadTwist.textContent = `${v}°`;
      this.renderStudio();
    });

    document.getElementById("check-rad-show-rays")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.radiation.showRays = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-rad-show-rings")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.radiation.showRings = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Anomaly Modifier (Chapter 8)
    // ------------------------------------------------------------
    const anomToggle = document.getElementById("mod-anomaly-toggle");
    const anomAccordion = document.getElementById("accordion-anomaly");

    anomToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.anomaly.enabled = isChecked;
      if (isChecked) {
        anomAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Anomaly introduces an irregular disruption. Activate 'Repetition' or 'Radiation' to establish the regular discipline.", 4500);
        } else {
          this.showToast("Anomaly Active: Irregularity Focal Tension");
        }
      } else {
        anomAccordion?.classList.add("hidden");
        this.showToast("Anomaly Deactivated: Regularity Restored");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("anom-type")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.anomaly.type = val;
      const shapeBox = document.getElementById("anom-shape-box");
      if (shapeBox) {
        if (val === "focal") shapeBox.classList.remove("hidden");
        else shapeBox.classList.add("hidden");
      }
      this.renderStudio();
    });

    const anomX = document.getElementById("input-anom-x");
    const anomY = document.getElementById("input-anom-y");
    const valAnomCoords = document.getElementById("val-anom-coords");

    const updateAnomCoordsUI = () => {
      const x = Math.round(this.studioEngine.state.modifiers.anomaly.epicenterX * 100);
      const y = Math.round(this.studioEngine.state.modifiers.anomaly.epicenterY * 100);
      if (anomX) anomX.value = x;
      if (anomY) anomY.value = y;
      if (valAnomCoords) valAnomCoords.textContent = `${x}%, ${y}%`;
    };

    anomX?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.anomaly.epicenterX = parseInt(e.target.value, 10) / 100;
      updateAnomCoordsUI();
      this.renderStudio();
    });

    anomY?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.anomaly.epicenterY = parseInt(e.target.value, 10) / 100;
      updateAnomCoordsUI();
      this.renderStudio();
    });

    const anomRadius = document.getElementById("input-anom-radius");
    const valAnomRadius = document.getElementById("val-anom-radius");
    anomRadius?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.anomaly.radius = v;
      if (valAnomRadius) valAnomRadius.textContent = `${v}px`;
      this.renderStudio();
    });

    const anomIntensity = document.getElementById("input-anom-intensity");
    const valAnomIntensity = document.getElementById("val-anom-intensity");
    anomIntensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.anomaly.intensity = v;
      if (valAnomIntensity) valAnomIntensity.textContent = `${v}%`;
      this.renderStudio();
    });

    document.getElementById("anom-shape")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.anomalousShape = e.target.value;
      this.renderStudio();
    });

    document.getElementById("check-anom-highlight")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.highlightColor = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-anom-reticle")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.anomaly.showReticle = e.target.checked;
      this.renderStudio();
    });

    // Interactive canvas click to reposition Anomaly Epicenter or Concentration Attractor
    this.studioCanvas?.addEventListener("click", (e) => {
      const rect = this.studioCanvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      const concAcc = document.getElementById("accordion-concentration");
      const anomAcc = document.getElementById("accordion-anomaly");

      // Prioritize the modifier whose accordion is visibly expanded
      if (this.studioEngine.state.modifiers.concentration.enabled && concAcc && !concAcc.classList.contains("hidden")) {
        this.studioEngine.state.modifiers.concentration.attractorX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.concentration.attractorY = Math.max(0.05, Math.min(0.95, clickY));
        updateConcCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.anomaly.enabled && anomAcc && !anomAcc.classList.contains("hidden")) {
        this.studioEngine.state.modifiers.anomaly.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.anomaly.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
        updateAnomCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.concentration.enabled) {
        this.studioEngine.state.modifiers.concentration.attractorX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.concentration.attractorY = Math.max(0.05, Math.min(0.95, clickY));
        updateConcCoordsUI();
        this.renderStudio();
      } else if (this.studioEngine.state.modifiers.anomaly.enabled) {
        this.studioEngine.state.modifiers.anomaly.epicenterX = Math.max(0.05, Math.min(0.95, clickX));
        this.studioEngine.state.modifiers.anomaly.epicenterY = Math.max(0.05, Math.min(0.95, clickY));
        updateAnomCoordsUI();
        this.renderStudio();
      }
    });

    // ------------------------------------------------------------
    // Contrast Modifier (Chapter 9)
    // ------------------------------------------------------------
    const contrastToggle = document.getElementById("mod-contrast-toggle");
    const contrastAccordion = document.getElementById("accordion-contrast");

    contrastToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.contrast.enabled = isChecked;
      if (isChecked) {
        contrastAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Contrast establishes visual disparity (majority vs. minority). Activate 'Repetition' or 'Radiation' to distribute across modules.", 4500);
        } else {
          this.showToast("Contrast Active: Visual Disparity & Dominance");
        }
      } else {
        contrastAccordion?.classList.add("hidden");
        this.showToast("Contrast Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("contrast-dimension")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.contrast.dimension = val;
      const scaleBox = document.getElementById("contrast-scale-box");
      const shapeBox = document.getElementById("contrast-shape-box");
      const angleBox = document.getElementById("contrast-angle-box");

      if (scaleBox) scaleBox.classList.toggle("hidden", val !== "scale");
      if (shapeBox) shapeBox.classList.toggle("hidden", val !== "shape");
      if (angleBox) angleBox.classList.toggle("hidden", val !== "direction");

      this.renderStudio();
    });

    const contrastDominance = document.getElementById("input-contrast-dominance");
    const valContrastDominance = document.getElementById("val-contrast-dominance");
    contrastDominance?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.contrast.dominanceRatio = v;
      if (valContrastDominance) valContrastDominance.textContent = `${v}%`;
      this.renderStudio();
    });

    const contrastScale = document.getElementById("input-contrast-scale");
    const valContrastScale = document.getElementById("val-contrast-scale");
    contrastScale?.addEventListener("input", (e) => {
      const v = parseFloat(e.target.value);
      this.studioEngine.state.modifiers.contrast.scaleFactor = v;
      if (valContrastScale) valContrastScale.textContent = `${v.toFixed(1)}x`;
      this.renderStudio();
    });

    document.getElementById("contrast-shape")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.contrast.contrastShape = e.target.value;
      this.renderStudio();
    });

    const contrastAngle = document.getElementById("input-contrast-angle");
    const valContrastAngle = document.getElementById("val-contrast-angle");
    contrastAngle?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.contrast.angle = v;
      if (valContrastAngle) valContrastAngle.textContent = `${v}°`;
      this.renderStudio();
    });

    document.getElementById("check-contrast-highlight")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.contrast.highlightContrast = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Concentration Modifier (Chapter 10)
    // ------------------------------------------------------------
    const concToggle = document.getElementById("mod-concentration-toggle");
    const concAccordion = document.getElementById("accordion-concentration");

    concToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.concentration.enabled = isChecked;
      if (isChecked) {
        concAccordion?.classList.remove("hidden");
        const hasGrid = this.studioEngine.state.modifiers.repetition.enabled || this.studioEngine.state.modifiers.radiation.enabled;
        if (!hasGrid) {
          this.showToast("Concentration gathers modules into focal clusters. Activate 'Repetition' or 'Radiation' to establish the modular field.", 4500);
        } else {
          this.showToast("Concentration Active: Gravitational Field & Density");
        }
      } else {
        concAccordion?.classList.add("hidden");
        this.showToast("Concentration Deactivated");
      }
      this.updateModifierDependencyWarnings();
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("conc-mode")?.addEventListener("change", (e) => {
      const val = e.target.value;
      this.studioEngine.state.modifiers.concentration.mode = val;
      const lineBox = document.getElementById("conc-line-axis-box");
      if (lineBox) lineBox.classList.toggle("hidden", val !== "line");
      this.renderStudio();
    });

    document.getElementById("conc-line-axis")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.lineAxis = e.target.value;
      this.renderStudio();
    });

    const updateConcCoordsUI = () => {
      const xPct = Math.round(this.studioEngine.state.modifiers.concentration.attractorX * 100);
      const yPct = Math.round(this.studioEngine.state.modifiers.concentration.attractorY * 100);
      const valCoords = document.getElementById("val-conc-coords");
      if (valCoords) valCoords.textContent = `${xPct}%, ${yPct}%`;
      const inputX = document.getElementById("input-conc-x");
      const inputY = document.getElementById("input-conc-y");
      if (inputX) inputX.value = xPct;
      if (inputY) inputY.value = yPct;
    };

    document.getElementById("input-conc-x")?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.concentration.attractorX = parseInt(e.target.value, 10) / 100;
      updateConcCoordsUI();
      this.renderStudio();
    });

    document.getElementById("input-conc-y")?.addEventListener("input", (e) => {
      this.studioEngine.state.modifiers.concentration.attractorY = parseInt(e.target.value, 10) / 100;
      updateConcCoordsUI();
      this.renderStudio();
    });

    const concPower = document.getElementById("input-conc-power");
    const valConcPower = document.getElementById("val-conc-power");
    concPower?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.concentration.power = v;
      if (valConcPower) valConcPower.textContent = `${v}%`;
      this.renderStudio();
    });

    const concRadius = document.getElementById("input-conc-radius");
    const valConcRadius = document.getElementById("val-conc-radius");
    concRadius?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.concentration.radius = v;
      if (valConcRadius) valConcRadius.textContent = `${v}px`;
      this.renderStudio();
    });

    document.getElementById("check-conc-align")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.alignToField = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-conc-scale")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.densityScale = e.target.checked;
      this.renderStudio();
    });

    document.getElementById("check-conc-guide")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.concentration.showAttractor = e.target.checked;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Texture Modifier (Chapter 11)
    // ------------------------------------------------------------
    const textToggle = document.getElementById("mod-texture-toggle");
    const textAccordion = document.getElementById("accordion-texture");

    textToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.texture.enabled = isChecked;
      if (isChecked) {
        textAccordion?.classList.remove("hidden");
        this.showToast("Texture Active: Visual Surface & Tactile Grain");
      } else {
        textAccordion?.classList.add("hidden");
        this.showToast("Texture Deactivated");
      }
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("text-target")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.texture.target = e.target.value;
      this.renderStudio();
    });

    document.getElementById("text-mode")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.texture.mode = e.target.value;
      this.renderStudio();
    });

    const textDensity = document.getElementById("input-text-density");
    const valTextDensity = document.getElementById("val-text-density");
    textDensity?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.density = v;
      if (valTextDensity) valTextDensity.textContent = `${v}%`;
      this.renderStudio();
    });

    const textScale = document.getElementById("input-text-scale");
    const valTextScale = document.getElementById("val-text-scale");
    textScale?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.scale = v;
      if (valTextScale) valTextScale.textContent = `${v}px`;
      this.renderStudio();
    });

    const textContrast = document.getElementById("input-text-contrast");
    const valTextContrast = document.getElementById("val-text-contrast");
    textContrast?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.texture.contrast = v;
      if (valTextContrast) valTextContrast.textContent = `${v}%`;
      this.renderStudio();
    });

    // ------------------------------------------------------------
    // Space Modifier (Chapter 12)
    // ------------------------------------------------------------
    const spaceToggle = document.getElementById("mod-space-toggle");
    const spaceAccordion = document.getElementById("accordion-space");

    spaceToggle?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.studioEngine.state.modifiers.space.enabled = isChecked;
      if (isChecked) {
        spaceAccordion?.classList.remove("hidden");
        this.showToast("Space Active: Illusory Depth & Isometric Planes");
      } else {
        spaceAccordion?.classList.add("hidden");
        this.showToast("Space Deactivated: Restored to Flat 2D Picture Plane");
      }
      this.updateStudioColophon();
      this.renderStudio();
    });

    document.getElementById("space-mode")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.space.mode = e.target.value;
      this.renderStudio();
    });

    const spaceDepth = document.getElementById("input-space-depth");
    const valSpaceDepth = document.getElementById("val-space-depth");
    spaceDepth?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.space.depth = v;
      if (valSpaceDepth) valSpaceDepth.textContent = `${v}px`;
      this.renderStudio();
    });

    const spaceAngle = document.getElementById("input-space-angle");
    const valSpaceAngle = document.getElementById("val-space-angle");
    spaceAngle?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.space.angle = v;
      if (valSpaceAngle) valSpaceAngle.textContent = `${v}°`;
      this.renderStudio();
    });

    const spaceShading = document.getElementById("input-space-shading");
    const valSpaceShading = document.getElementById("val-space-shading");
    spaceShading?.addEventListener("input", (e) => {
      const v = parseInt(e.target.value, 10);
      this.studioEngine.state.modifiers.space.shading = v;
      if (valSpaceShading) valSpaceShading.textContent = `${v}%`;
      this.renderStudio();
    });

    document.getElementById("check-space-isoguides")?.addEventListener("change", (e) => {
      this.studioEngine.state.modifiers.space.showIsoGuides = e.target.checked;
      this.renderStudio();
    });

    // Studio Canvas Toolbar Actions
    document.getElementById("studio-bounds-toggle")?.addEventListener("click", () => {
      this.studioEngine.state.showSafeBounds = !this.studioEngine.state.showSafeBounds;
      this.renderStudio();
    });

    document.getElementById("studio-invert-toggle")?.addEventListener("click", () => {
      this.studioEngine.state.invertFigureGround = !this.studioEngine.state.invertFigureGround;
      this.renderStudio();
    });

    document.getElementById("studio-reset-btn")?.addEventListener("click", () => {
      this.studioEngine.state = JSON.parse(JSON.stringify(defaultStudioState));
      this.syncStudioControlsFromState();
      this.renderStudio();
      this.showToast("Studio Parameters Reset");
    });

    document.getElementById("studio-copy-svg-btn")?.addEventListener("click", () => {
      const dataUrl = this.studioCanvas.toDataURL("image/png");
      navigator.clipboard.writeText(dataUrl).then(() => {
        this.showToast("Canvas image copied to clipboard");
      });
    });
  }

  syncStudioControlsFromState() {
    const s = this.studioEngine.state;
    // Sliders
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setText = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setVal("input-form-a-scale", s.formA.scale);
    setText("val-form-a-scale", s.formA.scale);
    setVal("input-form-a-rotation", s.formA.rotation);
    setText("val-form-a-rotation", `${s.formA.rotation}°`);
    setVal("input-form-a-offset-x", s.formA.offsetX || 0);
    setText("val-form-a-offset-x", `${s.formA.offsetX || 0}px`);
    setVal("input-form-a-offset-y", s.formA.offsetY || 0);
    setText("val-form-a-offset-y", `${s.formA.offsetY || 0}px`);

    setVal("input-form-b-scale", s.formB.scale);
    setText("val-form-b-scale", s.formB.scale);
    setVal("input-form-b-rotation", s.formB.rotation);
    setText("val-form-b-rotation", `${s.formB.rotation}°`);
    setVal("input-form-b-offset-x", s.formB.offsetX);
    setText("val-form-b-offset-x", `${s.formB.offsetX}px`);
    setVal("input-form-b-offset-y", s.formB.offsetY);
    setText("val-form-b-offset-y", `${s.formB.offsetY}px`);

    const toggleFormBBtn = document.getElementById("toggle-form-b-btn");
    if (toggleFormBBtn) {
      toggleFormBBtn.innerHTML = s.formB.enabled
        ? `<i data-lucide="minus" class="w-3.5 h-3.5"></i>`
        : `<i data-lucide="plus" class="w-3.5 h-3.5"></i>`;
      toggleFormBBtn.title = s.formB.enabled ? "Deactivate Form B" : "Activate Form B";
    }

    setVal("interrelation-select", s.interrelation);

    const repToggle = document.getElementById("mod-repetition-toggle");
    if (repToggle) repToggle.checked = s.modifiers.repetition.enabled;

    const repAccordion = document.getElementById("accordion-repetition");
    if (repAccordion) {
      if (s.modifiers.repetition.enabled) repAccordion.classList.remove("hidden");
      else repAccordion.classList.add("hidden");
    }

    setVal("rep-grid-type", s.modifiers.repetition.gridType);
    setVal("input-rep-cols", s.modifiers.repetition.cols);
    setText("val-rep-cols", s.modifiers.repetition.cols);
    setVal("input-rep-rows", s.modifiers.repetition.rows);
    setText("val-rep-rows", s.modifiers.repetition.rows);

    const checkActive = document.getElementById("check-rep-active");
    if (checkActive) checkActive.checked = s.modifiers.repetition.activeClipping;
    const checkVis = document.getElementById("check-rep-visible");
    if (checkVis) checkVis.checked = s.modifiers.repetition.showGridLines;
    const checkCheck = document.getElementById("check-rep-checker");
    if (checkCheck) checkCheck.checked = s.modifiers.repetition.checkerInvert;

    // Structure sync
    const structToggle = document.getElementById("mod-structure-toggle");
    if (structToggle) structToggle.checked = s.modifiers.structure.enabled;
    const structAccordion = document.getElementById("accordion-structure");
    if (structAccordion) {
      if (s.modifiers.structure.enabled) structAccordion.classList.remove("hidden");
      else structAccordion.classList.add("hidden");
    }
    setVal("struct-mode", s.modifiers.structure.mode);
    setVal("input-struct-col-ratio", s.modifiers.structure.colRatio);
    setText("val-struct-col-ratio", `${s.modifiers.structure.colRatio.toFixed(1)}x`);
    setVal("input-struct-row-ratio", s.modifiers.structure.rowRatio);
    setText("val-struct-row-ratio", `${s.modifiers.structure.rowRatio.toFixed(1)}x`);
    const checkBands = document.getElementById("check-struct-bands");
    if (checkBands) checkBands.checked = s.modifiers.structure.showBands;
    const bandBox = document.getElementById("struct-band-box");
    if (bandBox) {
      if (s.modifiers.structure.showBands) bandBox.classList.remove("hidden");
      else bandBox.classList.add("hidden");
    }
    setVal("input-struct-band-thick", s.modifiers.structure.bandThickness);
    setText("val-struct-band-thick", `${s.modifiers.structure.bandThickness}px`);

    // Similarity sync
    const simToggle = document.getElementById("mod-similarity-toggle");
    if (simToggle) simToggle.checked = s.modifiers.similarity.enabled;
    const simAccordion = document.getElementById("accordion-similarity");
    if (simAccordion) {
      if (s.modifiers.similarity.enabled) simAccordion.classList.remove("hidden");
      else simAccordion.classList.add("hidden");
    }
    setVal("sim-kinship-type", s.modifiers.similarity.kinshipType);
    setVal("input-sim-intensity", s.modifiers.similarity.intensity);
    setText("val-sim-intensity", `${s.modifiers.similarity.intensity}%`);
    setVal("input-sim-jitter", s.modifiers.similarity.cellJitter);
    setText("val-sim-jitter", `${s.modifiers.similarity.cellJitter}px`);

    // Gradation sync
    const gradToggle = document.getElementById("mod-gradation-toggle");
    if (gradToggle) gradToggle.checked = s.modifiers.gradation.enabled;
    const gradAccordion = document.getElementById("accordion-gradation");
    if (gradAccordion) {
      if (s.modifiers.gradation.enabled) gradAccordion.classList.remove("hidden");
      else gradAccordion.classList.add("hidden");
    }
    setVal("grad-type", s.modifiers.gradation.type);
    setVal("grad-pathway", s.modifiers.gradation.pathway);
    setVal("input-grad-range", s.modifiers.gradation.range);
    setText("val-grad-range", `${s.modifiers.gradation.range}°`);
    setVal("input-grad-cycles", s.modifiers.gradation.steps);
    setText("val-grad-cycles", `${s.modifiers.gradation.steps}x`);
    const checkGradRev = document.getElementById("check-grad-reverse");
    if (checkGradRev) checkGradRev.checked = s.modifiers.gradation.reverse;

    // Radiation sync
    const radToggle = document.getElementById("mod-radiation-toggle");
    if (radToggle) radToggle.checked = s.modifiers.radiation.enabled;
    const radAccordion = document.getElementById("accordion-radiation");
    if (radAccordion) {
      if (s.modifiers.radiation.enabled) radAccordion.classList.remove("hidden");
      else radAccordion.classList.add("hidden");
    }
    setVal("rad-scheme", s.modifiers.radiation.scheme);
    setVal("input-rad-rays", s.modifiers.radiation.rays);
    setText("val-rad-rays", `${s.modifiers.radiation.rays} rays`);
    setVal("input-rad-rings", s.modifiers.radiation.rings);
    setText("val-rad-rings", `${s.modifiers.radiation.rings} rings`);
    setVal("input-rad-twist", s.modifiers.radiation.spiralTwist);
    setText("val-rad-twist", `${s.modifiers.radiation.spiralTwist}°`);
    const checkRadRays = document.getElementById("check-rad-show-rays");
    if (checkRadRays) checkRadRays.checked = s.modifiers.radiation.showRays;
    const checkRadRings = document.getElementById("check-rad-show-rings");
    if (checkRadRings) checkRadRings.checked = s.modifiers.radiation.showRings;
    const twistBox = document.getElementById("rad-twist-box");
    if (twistBox) {
      if (s.modifiers.radiation.scheme === "spiral") twistBox.classList.remove("opacity-40");
      else twistBox.classList.add("opacity-40");
    }

    // Anomaly sync
    const anomToggle = document.getElementById("mod-anomaly-toggle");
    if (anomToggle) anomToggle.checked = s.modifiers.anomaly.enabled;
    const anomAccordion = document.getElementById("accordion-anomaly");
    if (anomAccordion) {
      if (s.modifiers.anomaly.enabled) anomAccordion.classList.remove("hidden");
      else anomAccordion.classList.add("hidden");
    }
    setVal("anom-type", s.modifiers.anomaly.type);
    const shapeBox = document.getElementById("anom-shape-box");
    if (shapeBox) {
      if (s.modifiers.anomaly.type === "focal") shapeBox.classList.remove("hidden");
      else shapeBox.classList.add("hidden");
    }
    const xPct = Math.round((s.modifiers.anomaly.epicenterX ?? 0.5) * 100);
    const yPct = Math.round((s.modifiers.anomaly.epicenterY ?? 0.5) * 100);
    setVal("input-anom-x", xPct);
    setVal("input-anom-y", yPct);
    setText("val-anom-coords", `${xPct}%, ${yPct}%`);
    setVal("input-anom-radius", s.modifiers.anomaly.radius);
    setText("val-anom-radius", `${s.modifiers.anomaly.radius}px`);
    setVal("input-anom-intensity", s.modifiers.anomaly.intensity);
    setText("val-anom-intensity", `${s.modifiers.anomaly.intensity}%`);
    setVal("anom-shape", s.modifiers.anomaly.anomalousShape);
    const checkAnomHl = document.getElementById("check-anom-highlight");
    if (checkAnomHl) checkAnomHl.checked = s.modifiers.anomaly.highlightColor;
    const checkAnomRet = document.getElementById("check-anom-reticle");
    if (checkAnomRet) checkAnomRet.checked = s.modifiers.anomaly.showReticle;

    // Contrast sync
    const contrastToggle = document.getElementById("mod-contrast-toggle");
    if (contrastToggle) contrastToggle.checked = s.modifiers.contrast.enabled;
    const contrastAccordion = document.getElementById("accordion-contrast");
    if (contrastAccordion) {
      if (s.modifiers.contrast.enabled) contrastAccordion.classList.remove("hidden");
      else contrastAccordion.classList.add("hidden");
    }
    setVal("contrast-dimension", s.modifiers.contrast.dimension);
    const scaleBox = document.getElementById("contrast-scale-box");
    const cShapeBox = document.getElementById("contrast-shape-box");
    const angleBox = document.getElementById("contrast-angle-box");
    if (scaleBox) scaleBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "scale");
    if (cShapeBox) cShapeBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "shape");
    if (angleBox) angleBox.classList.toggle("hidden", s.modifiers.contrast.dimension !== "direction");

    setVal("input-contrast-dominance", s.modifiers.contrast.dominanceRatio);
    setText("val-contrast-dominance", `${s.modifiers.contrast.dominanceRatio}%`);
    setVal("input-contrast-scale", s.modifiers.contrast.scaleFactor);
    setText("val-contrast-scale", `${s.modifiers.contrast.scaleFactor.toFixed(1)}x`);
    setVal("contrast-shape", s.modifiers.contrast.contrastShape);
    setVal("input-contrast-angle", s.modifiers.contrast.angle);
    setText("val-contrast-angle", `${s.modifiers.contrast.angle}°`);
    const checkContrastHl = document.getElementById("check-contrast-highlight");
    if (checkContrastHl) checkContrastHl.checked = s.modifiers.contrast.highlightContrast;

    // Concentration sync
    const concToggle = document.getElementById("mod-concentration-toggle");
    if (concToggle) concToggle.checked = s.modifiers.concentration.enabled;
    const concAccordion = document.getElementById("accordion-concentration");
    if (concAccordion) {
      if (s.modifiers.concentration.enabled) concAccordion.classList.remove("hidden");
      else concAccordion.classList.add("hidden");
    }
    setVal("conc-mode", s.modifiers.concentration.mode);
    const lineAxisBox = document.getElementById("conc-line-axis-box");
    if (lineAxisBox) lineAxisBox.classList.toggle("hidden", s.modifiers.concentration.mode !== "line");
    setVal("conc-line-axis", s.modifiers.concentration.lineAxis || "horizontal");

    const concXPct = Math.round((s.modifiers.concentration.attractorX ?? 0.5) * 100);
    const concYPct = Math.round((s.modifiers.concentration.attractorY ?? 0.5) * 100);
    setVal("input-conc-x", concXPct);
    setVal("input-conc-y", concYPct);
    setText("val-conc-coords", `${concXPct}%, ${concYPct}%`);

    setVal("input-conc-power", s.modifiers.concentration.power);
    setText("val-conc-power", `${s.modifiers.concentration.power}%`);
    setVal("input-conc-radius", s.modifiers.concentration.radius);
    setText("val-conc-radius", `${s.modifiers.concentration.radius}px`);

    const checkConcAlign = document.getElementById("check-conc-align");
    if (checkConcAlign) checkConcAlign.checked = s.modifiers.concentration.alignToField;
    const checkConcScale = document.getElementById("check-conc-scale");
    if (checkConcScale) checkConcScale.checked = s.modifiers.concentration.densityScale;
    const checkConcGuide = document.getElementById("check-conc-guide");
    if (checkConcGuide) checkConcGuide.checked = s.modifiers.concentration.showAttractor;

    // Texture sync
    const textToggle = document.getElementById("mod-texture-toggle");
    if (textToggle) textToggle.checked = s.modifiers.texture.enabled;
    const textAccordion = document.getElementById("accordion-texture");
    if (textAccordion) {
      if (s.modifiers.texture.enabled) textAccordion.classList.remove("hidden");
      else textAccordion.classList.add("hidden");
    }
    setVal("text-target", s.modifiers.texture.target || "shapes");
    setVal("text-mode", s.modifiers.texture.mode);
    setVal("input-text-density", s.modifiers.texture.density);
    setText("val-text-density", `${s.modifiers.texture.density}%`);
    setVal("input-text-scale", s.modifiers.texture.scale);
    setText("val-text-scale", `${s.modifiers.texture.scale}px`);
    setVal("input-text-contrast", s.modifiers.texture.contrast);
    setText("val-text-contrast", `${s.modifiers.texture.contrast}%`);

    // Space sync
    const spaceToggle = document.getElementById("mod-space-toggle");
    if (spaceToggle) spaceToggle.checked = s.modifiers.space?.enabled ?? false;
    const spaceAccordion = document.getElementById("accordion-space");
    if (spaceAccordion) {
      if (s.modifiers.space?.enabled) spaceAccordion.classList.remove("hidden");
      else spaceAccordion.classList.add("hidden");
    }
    setVal("space-mode", s.modifiers.space?.mode || "isometric");
    setVal("input-space-depth", s.modifiers.space?.depth ?? 35);
    setText("val-space-depth", `${s.modifiers.space?.depth ?? 35}px`);
    setVal("input-space-angle", s.modifiers.space?.angle ?? 30);
    setText("val-space-angle", `${s.modifiers.space?.angle ?? 30}°`);
    setVal("input-space-shading", s.modifiers.space?.shading ?? 65);
    setText("val-space-shading", `${s.modifiers.space?.shading ?? 65}%`);
    const checkIso = document.getElementById("check-space-isoguides");
    if (checkIso) checkIso.checked = s.modifiers.space?.showIsoGuides ?? false;

    this.initStudioShapePickers();
    this.updateModifierDependencyWarnings();
    this.updateStudioColophon();
  }

  updateModifierDependencyWarnings() {
    const s = this.studioEngine.state;
    const hasRep = s.modifiers.repetition.enabled;
    const hasRad = s.modifiers.radiation.enabled;
    const hasGrid = hasRep || hasRad;

    const warnStruct = document.getElementById("dep-warning-structure");
    if (warnStruct) {
      if (!hasRep) {
        warnStruct.classList.remove("hidden");
      } else {
        warnStruct.classList.add("hidden");
      }
    }

    const warnSim = document.getElementById("dep-warning-similarity");
    if (warnSim) {
      if (!hasGrid) {
        warnSim.classList.remove("hidden");
      } else {
        warnSim.classList.add("hidden");
      }
    }

    const warnGrad = document.getElementById("dep-warning-gradation");
    if (warnGrad) {
      if (!hasGrid) {
        warnGrad.classList.remove("hidden");
      } else {
        warnGrad.classList.add("hidden");
      }
    }

    const warnAnom = document.getElementById("dep-warning-anomaly");
    if (warnAnom) {
      if (!hasGrid) {
        warnAnom.classList.remove("hidden");
      } else {
        warnAnom.classList.add("hidden");
      }
    }

    const warnContrast = document.getElementById("dep-warning-contrast");
    if (warnContrast) {
      if (!hasGrid) {
        warnContrast.classList.remove("hidden");
      } else {
        warnContrast.classList.add("hidden");
      }
    }

    const warnConc = document.getElementById("dep-warning-concentration");
    if (warnConc) {
      if (!hasGrid) {
        warnConc.classList.remove("hidden");
      } else {
        warnConc.classList.add("hidden");
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  updateStudioColophon() {
    const colophon = document.getElementById("studio-colophon-text");
    if (colophon) {
      colophon.textContent = this.studioEngine.getColophonString();
    }
  }

  renderStudio() {
    if (!this.studioCanvas) return;
    const palette = CanvasUtils.palettes[this.currentPaletteKey] || CanvasUtils.palettes.monochrome;
    this.studioEngine.render(palette);
    this.updateStudioColophon();
  }

  // ============================================================
  // THEORY: HANDBOOK, READING & CLASSICAL REFERENCE PLATE
  // ============================================================
  initTheorySidebar() {
    const list = document.getElementById("chapters-nav-list");
    if (!list) return;

    list.innerHTML = "";
    chaptersContent.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = `w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ch-nav-btn ${
        ch.id === this.currentChapterId 
          ? 'bg-[var(--bg-secondary)] border-accent font-medium shadow-sm' 
          : 'border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
      }`;
      btn.dataset.id = ch.id;

      btn.innerHTML = `
        <span class="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-accent">${ch.number}</span>
        <div class="flex-1 overflow-hidden">
          <div class="text-xs font-semibold truncate text-[var(--text-primary)]">${ch.title}</div>
          <div class="text-[10px] text-[var(--text-muted)] truncate">${ch.keyConcepts.slice(0, 2).join(' • ')}</div>
        </div>
      `;

      btn.addEventListener("click", () => {
        this.loadTheoryChapter(ch.id);
      });

      list.appendChild(btn);
    });
  }

  initTheoryDropdown() {
    const dropdown = document.getElementById("chapter-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";
    chaptersContent.forEach(ch => {
      const opt = document.createElement("option");
      opt.value = ch.id;
      opt.textContent = `Ch ${ch.number}: ${ch.title}`;
      dropdown.appendChild(opt);
    });

    dropdown.addEventListener("change", (e) => {
      this.loadTheoryChapter(parseInt(e.target.value, 10));
    });
  }

  loadTheoryChapter(id) {
    this.currentChapterId = id;

    // Update Dropdown & Sidebar active highlights
    const dropdown = document.getElementById("chapter-dropdown");
    if (dropdown) dropdown.value = id;

    document.querySelectorAll(".ch-nav-btn").forEach(btn => {
      if (parseInt(btn.dataset.id, 10) === id) {
        btn.className = "w-full text-left p-2.5 rounded-lg border border-accent bg-[var(--bg-secondary)] font-medium shadow-sm flex items-start gap-2.5 ch-nav-btn";
      } else {
        btn.className = "w-full text-left p-2.5 rounded-lg border border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] flex items-start gap-2.5 ch-nav-btn";
      }
    });

    const content = chaptersContent.find(c => c.id === id);
    if (!content) return;

    // Render Text Pedagogy
    document.getElementById("ch-number-badge").textContent = `CHAPTER ${content.number}`;
    document.getElementById("ch-read-time").textContent = content.readingTime;
    document.getElementById("ch-title").textContent = content.title;
    document.getElementById("ch-subtitle").textContent = content.subtitle;
    document.getElementById("ch-summary").textContent = content.summary;

    // Badges
    const conceptsBox = document.getElementById("ch-concepts-container");
    if (conceptsBox) {
      conceptsBox.innerHTML = "";
      content.keyConcepts.forEach(k => {
        const tag = document.createElement("span");
        tag.className = "concept-tag";
        tag.textContent = k;
        conceptsBox.appendChild(tag);
      });
    }

    // Sections
    const sectionsBox = document.getElementById("ch-sections-container");
    if (sectionsBox) {
      sectionsBox.innerHTML = "";
      content.sections.forEach(sec => {
        const div = document.createElement("div");
        div.className = "space-y-2";
        div.innerHTML = `
          <h3 class="font-display font-bold text-base text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1">${sec.heading}</h3>
          <p class="text-xs text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">${sec.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</p>
        `;
        sectionsBox.appendChild(div);
      });
    }

    // Exercise
    if (content.exercise) {
      document.getElementById("ch-exercise-title").textContent = content.exercise.title;
      document.getElementById("ch-exercise-instructions").textContent = content.exercise.instructions;
      document.getElementById("ch-exercise-goal").textContent = content.exercise.targetGoal;
    }

    const figTitle = document.getElementById("theory-fig-title");
    if (figTitle) {
      figTitle.textContent = `Ch ${content.number}: ${content.title}`;
    }

    this.renderTheoryPlate();
  }

  renderTheoryPlate() {
    if (!this.theoryCanvas) return;
    const { ctx, width, height } = CanvasUtils.setupCanvas(this.theoryCanvas);
    const module = this.chaptersMap[this.currentChapterId];
    const palette = CanvasUtils.palettes[this.currentPaletteKey] || CanvasUtils.palettes.monochrome;

    if (module && typeof module.render === "function") {
      const params = module.presets && module.presets.length > 0
        ? { ...module.defaultParams, ...module.presets[0].params }
        : module.defaultParams;
      module.render(ctx, width, height, params, palette);
    }
  }

  stepTheoryChapter(delta) {
    let nextId = this.currentChapterId + delta;
    if (nextId < 1) nextId = 12;
    if (nextId > 12) nextId = 1;
    this.loadTheoryChapter(nextId);
  }

  // ============================================================
  // GLOBAL APPLICATION EVENTS
  // ============================================================
  initGlobalEvents() {
    window.addEventListener("resize", () => {
      this.renderCurrentView();
    });

    // Palette Dropdown
    document.getElementById("palette-dropdown")?.addEventListener("change", (e) => {
      this.currentPaletteKey = e.target.value;
      this.renderCurrentView();
    });

    // Theme Toggle
    document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    });

    // Theory Chapter Navigation Buttons
    document.getElementById("prev-ch-btn")?.addEventListener("click", () => this.stepTheoryChapter(-1));
    document.getElementById("next-ch-btn")?.addEventListener("click", () => this.stepTheoryChapter(1));
    document.getElementById("footer-prev-btn")?.addEventListener("click", () => this.stepTheoryChapter(-1));
    document.getElementById("footer-next-btn")?.addEventListener("click", () => this.stepTheoryChapter(1));

    // Keyboard Shortcuts (Arrow keys for Theory)
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (this.currentMode === "theory") {
        if (e.key === "ArrowLeft") this.stepTheoryChapter(-1);
        if (e.key === "ArrowRight") this.stepTheoryChapter(1);
      }
    });

    // Export Button
    document.getElementById("export-top-btn")?.addEventListener("click", () => {
      const canvasToExport = this.currentMode === "studio" ? this.studioCanvas : this.theoryCanvas;
      const filename = this.currentMode === "studio"
        ? `wong-studio-composition-${Date.now()}.png`
        : `wong-ch${this.currentChapterId}-plate.png`;
      CanvasUtils.exportPNG(canvasToExport, filename);
      this.showToast(`Exported ${filename}`);
    });
  }

  showToast(msg, duration = 2800) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("opacity-100");
      toast.classList.add("opacity-0");
    }, duration);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WongApp();
});


  if (typeof window !== 'undefined') {
    window.StudioEngine = StudioEngine;
    window.WongApp = WongApp;
  }
})();
