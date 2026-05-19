export interface SampleNote {
  title: string;
  summary: string;
  author: string;
  stars: number;
}

export interface ExternalResource {
  name: string;
  url: string;
  description: string;
}

export interface Subject {
  key: string;
  label: string;
  icon: string;
  color: string;
  borderColor: string;
  glowClass: string;
  description: string;
  sampleNotes: SampleNote[];
  externalResources: ExternalResource[];
}

export const SUBJECTS: Subject[] = [
  {
    key: "mathematics",
    label: "Mathematics",
    icon: "∑",
    color: "text-secondary",
    borderColor: "border-secondary/40",
    glowClass: "shadow-[0_0_18px_oklch(0.6_0.28_300/0.35)]",
    description:
      "Master calculus, algebra, statistics and beyond with peer-curated notes.",
    sampleNotes: [
      {
        title: "Calculus II — Integration Techniques",
        summary:
          "Complete guide to integration by parts, partial fractions, and trigonometric substitution with solved examples.",
        author: "Marcus T.",
        stars: 5,
      },
      {
        title: "Linear Algebra Fundamentals",
        summary:
          "Vectors, matrices, determinants, eigenvalues and eigenvectors with visual explanations.",
        author: "Emma W.",
        stars: 4,
      },
      {
        title: "Statistics & Probability Mastery",
        summary:
          "Distributions, hypothesis testing, Bayesian methods, and real-world data analysis.",
        author: "Tom H.",
        stars: 4,
      },
      {
        title: "Differential Equations — Complete Guide",
        summary:
          "First and second order ODEs, Laplace transforms, and system of equations.",
        author: "Sarah K.",
        stars: 5,
      },
    ],
    externalResources: [
      {
        name: "Khan Academy",
        url: "https://www.khanacademy.org/math",
        description: "Free video lessons covering all levels of mathematics",
      },
      {
        name: "Coursera — Mathematics for ML",
        url: "https://www.coursera.org/specializations/mathematics-machine-learning",
        description: "Linear algebra and calculus for machine learning",
      },
      {
        name: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu/courses/mathematics/",
        description: "Free MIT mathematics course materials",
      },
    ],
  },
  {
    key: "cybersecurity",
    label: "Cybersecurity",
    icon: "🛡",
    color: "text-primary",
    borderColor: "border-primary/40",
    glowClass: "shadow-[0_0_18px_oklch(0.78_0.18_200/0.35)]",
    description:
      "Explore network security, ethical hacking, cryptography and digital defense.",
    sampleNotes: [
      {
        title: "Network Security Fundamentals",
        summary:
          "Firewalls, VPNs, intrusion detection systems and secure network architecture design.",
        author: "Jamie L.",
        stars: 5,
      },
      {
        title: "Ethical Hacking — Penetration Testing",
        summary:
          "Reconnaissance, exploitation techniques, and responsible disclosure practices.",
        author: "Alex R.",
        stars: 5,
      },
      {
        title: "Cryptography Essentials",
        summary:
          "Symmetric and asymmetric encryption, hashing, digital signatures, and PKI.",
        author: "Priya M.",
        stars: 4,
      },
      {
        title: "OWASP Top 10 Web Vulnerabilities",
        summary:
          "SQL injection, XSS, CSRF, and how to defend against the most critical web security risks.",
        author: "Marcus T.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "GeeksForGeeks",
        url: "https://www.geeksforgeeks.org/cybersecurity/",
        description: "Comprehensive cybersecurity tutorials and guides",
      },
      {
        name: "Coursera — IBM Cybersecurity",
        url: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
        description: "Professional cybersecurity analyst certificate",
      },
      {
        name: "TryHackMe",
        url: "https://tryhackme.com",
        description: "Interactive cybersecurity learning platform with labs",
      },
    ],
  },
  {
    key: "physics",
    label: "Physics",
    icon: "⚛",
    color: "text-accent",
    borderColor: "border-accent/40",
    glowClass: "shadow-[0_0_18px_oklch(0.85_0.22_145/0.35)]",
    description:
      "From quantum mechanics to thermodynamics — understand the universe's rules.",
    sampleNotes: [
      {
        title: "Quantum Mechanics — Wave Functions",
        summary:
          "Wave-particle duality, Schrödinger equation, quantum tunneling and measurement problem.",
        author: "Sarah K.",
        stars: 5,
      },
      {
        title: "Thermodynamics & Statistical Mechanics",
        summary:
          "Laws of thermodynamics, entropy, heat engines, and Boltzmann distribution.",
        author: "Emma W.",
        stars: 4,
      },
      {
        title: "Electromagnetism — Maxwell's Equations",
        summary:
          "Electric and magnetic fields, induction, electromagnetic waves and applications.",
        author: "Luis P.",
        stars: 5,
      },
      {
        title: "Special Relativity Explained",
        summary:
          "Time dilation, length contraction, mass-energy equivalence and spacetime geometry.",
        author: "Nadia F.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "Khan Academy Physics",
        url: "https://www.khanacademy.org/science/physics",
        description: "Free interactive physics lessons from mechanics to waves",
      },
      {
        name: "Studocu Physics Notes",
        url: "https://www.studocu.com/en-us/subject/physics",
        description: "Thousands of student-shared physics notes and summaries",
      },
      {
        name: "HyperPhysics",
        url: "http://hyperphysics.phy-astr.gsu.edu",
        description:
          "Concept maps and reference material for all physics topics",
      },
    ],
  },
  {
    key: "computer-science",
    label: "Computer Science",
    icon: "⌨",
    color: "text-primary",
    borderColor: "border-primary/40",
    glowClass: "shadow-[0_0_18px_oklch(0.78_0.18_200/0.35)]",
    description:
      "Data structures, algorithms, machine learning and modern software engineering.",
    sampleNotes: [
      {
        title: "Data Structures Complete Guide",
        summary:
          "Arrays, linked lists, trees, graphs, hash tables and complexity analysis with implementations.",
        author: "Sarah K.",
        stars: 5,
      },
      {
        title: "Machine Learning Fundamentals",
        summary:
          "Supervised learning, neural networks, gradient descent and model evaluation with scikit-learn.",
        author: "Jamie L.",
        stars: 5,
      },
      {
        title: "Algorithm Design Patterns",
        summary:
          "Dynamic programming, greedy algorithms, divide-and-conquer and backtracking strategies.",
        author: "Marcus T.",
        stars: 5,
      },
      {
        title: "React & TypeScript: Modern Web Dev",
        summary:
          "Hooks, context, TypeScript types, performance optimization and testing strategies.",
        author: "Priya M.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "GeeksForGeeks CS",
        url: "https://www.geeksforgeeks.org/computer-science-projects/",
        description: "Tutorials, problems and interview preparation",
      },
      {
        name: "Coursera — CS Specializations",
        url: "https://www.coursera.org/browse/computer-science",
        description: "University-level computer science courses",
      },
      {
        name: "CS50 by Harvard",
        url: "https://cs50.harvard.edu",
        description: "Free world-class introduction to computer science",
      },
    ],
  },
  {
    key: "history",
    label: "History",
    icon: "📜",
    color: "text-chart-4",
    borderColor: "border-chart-4/40",
    glowClass: "shadow-[0_0_18px_oklch(0.75_0.18_50/0.35)]",
    description:
      "Explore world history from ancient civilizations to modern geopolitics.",
    sampleNotes: [
      {
        title: "World War II — Complete Timeline",
        summary:
          "Key events, battles, political decisions and consequences of WWII with maps.",
        author: "Alex R.",
        stars: 4,
      },
      {
        title: "Cold War: Geopolitics & Proxy Wars",
        summary:
          "US-Soviet rivalry, nuclear arms race, Korean War, Vietnam, Berlin Wall and détente.",
        author: "Luis P.",
        stars: 5,
      },
      {
        title: "Ancient Civilizations Survey",
        summary:
          "Mesopotamia, Egypt, Greece, Rome — political systems, culture and lasting legacies.",
        author: "Emma W.",
        stars: 4,
      },
      {
        title: "The French Revolution",
        summary:
          "Causes, radical phases, Reign of Terror, Napoleon and its global impact.",
        author: "Chris O.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "Studocu History",
        url: "https://www.studocu.com/en-us/subject/history",
        description: "Peer-shared history notes and study guides",
      },
      {
        name: "Khan Academy World History",
        url: "https://www.khanacademy.org/humanities/world-history",
        description: "Free video lessons on world history",
      },
      {
        name: "Crash Course History",
        url: "https://www.youtube.com/@crashcourse",
        description: "Fast-paced engaging history video series",
      },
    ],
  },
  {
    key: "science",
    label: "Biology & Science",
    icon: "🧬",
    color: "text-accent",
    borderColor: "border-accent/40",
    glowClass: "shadow-[0_0_18px_oklch(0.85_0.22_145/0.35)]",
    description: "Cell biology, genetics, organic chemistry and life sciences.",
    sampleNotes: [
      {
        title: "Cell Biology & Division",
        summary:
          "Mitosis, meiosis, Mendelian genetics and DNA replication explained with diagrams.",
        author: "Nadia F.",
        stars: 4,
      },
      {
        title: "Genetics & Molecular Biology",
        summary:
          "DNA structure, transcription, translation, gene regulation and CRISPR technology.",
        author: "Priya M.",
        stars: 5,
      },
      {
        title: "Organic Chemistry Reactions",
        summary:
          "SN1/SN2, elimination, addition, and aromatic chemistry with arrow-pushing mechanisms.",
        author: "Tom H.",
        stars: 5,
      },
      {
        title: "Human Anatomy & Physiology",
        summary:
          "Major organ systems, homeostasis, nervous system and circulatory system overview.",
        author: "Sarah K.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "Khan Academy Biology",
        url: "https://www.khanacademy.org/science/biology",
        description: "Comprehensive free biology lessons",
      },
      {
        name: "Coursera Biosciences",
        url: "https://www.coursera.org/browse/life-sciences",
        description: "University bioscience and health courses",
      },
      {
        name: "Crash Course Biology",
        url: "https://www.youtube.com/@crashcourse",
        description: "Engaging biology video series",
      },
    ],
  },
  {
    key: "english",
    label: "English",
    icon: "✍",
    color: "text-chart-5",
    borderColor: "border-chart-5/40",
    glowClass: "shadow-[0_0_18px_oklch(0.7_0.2_330/0.35)]",
    description:
      "Literature analysis, creative writing, grammar and academic communication.",
    sampleNotes: [
      {
        title: "Shakespeare Tragedies — Deep Analysis",
        summary:
          "Hamlet, Othello, Macbeth, King Lear — themes, symbolism and character studies.",
        author: "Jamie L.",
        stars: 4,
      },
      {
        title: "Creative Writing: Finding Your Voice",
        summary:
          "Narrative techniques, character development, dialogue and workshop exercises.",
        author: "Alex R.",
        stars: 4,
      },
      {
        title: "Advanced Grammar & Style Guide",
        summary:
          "Complex sentence structures, punctuation mastery and academic writing conventions.",
        author: "Chris O.",
        stars: 3,
      },
      {
        title: "Essay Writing Masterclass",
        summary:
          "Thesis construction, argumentation, evidence and polishing your academic essays.",
        author: "Emma W.",
        stars: 5,
      },
    ],
    externalResources: [
      {
        name: "Studocu English Notes",
        url: "https://www.studocu.com/en-us/subject/english-literature",
        description: "Thousands of student-shared English literature notes",
      },
      {
        name: "Purdue OWL Writing",
        url: "https://owl.purdue.edu/owl/purdue_owl.html",
        description: "Free comprehensive writing and grammar guide",
      },
      {
        name: "SparkNotes Literature",
        url: "https://www.sparknotes.com",
        description: "Literature summaries and analysis guides",
      },
    ],
  },
  {
    key: "economics",
    label: "Economics",
    icon: "📈",
    color: "text-secondary",
    borderColor: "border-secondary/40",
    glowClass: "shadow-[0_0_18px_oklch(0.6_0.28_300/0.35)]",
    description:
      "Micro and macroeconomics, game theory, financial markets and policy analysis.",
    sampleNotes: [
      {
        title: "Microeconomics — Supply & Demand",
        summary:
          "Market equilibrium, elasticity, consumer theory, production costs and market structures.",
        author: "Marcus T.",
        stars: 5,
      },
      {
        title: "Macroeconomics Fundamentals",
        summary:
          "GDP, inflation, unemployment, monetary policy, fiscal policy and international trade.",
        author: "Luis P.",
        stars: 4,
      },
      {
        title: "Game Theory & Strategic Thinking",
        summary:
          "Nash equilibrium, prisoner's dilemma, auction theory and bargaining models.",
        author: "Nadia F.",
        stars: 5,
      },
      {
        title: "Behavioral Economics",
        summary:
          "Cognitive biases, prospect theory, nudge theory and real-world decision making.",
        author: "Tom H.",
        stars: 4,
      },
    ],
    externalResources: [
      {
        name: "Coursera Economics",
        url: "https://www.coursera.org/browse/social-sciences/economics",
        description: "University-level economics courses online",
      },
      {
        name: "Khan Academy Economics",
        url: "https://www.khanacademy.org/economics-finance-domain",
        description: "Free micro and macroeconomics video lessons",
      },
      {
        name: "The Economics Network",
        url: "https://www.economicsnetwork.ac.uk",
        description: "Resources and guides for economics students",
      },
    ],
  },
];
