// Single source of truth for every word on the site.

/** Public Unicorn Studio embed id (not a secret). Empty = the built-in shader fallback renders. */
export const unicornProjectId = "";

export const profile = {
  name: "Vinay Kumar",
  firstName: "Vinay",
  lastName: "Kumar",
  title: "GenAI Engineer",
  oneLiner:
    "I build multi-agent and RAG systems that answer from real data, and I care about what happens after the demo.",
  email: "ursvinu18@gmail.com",
  /** Your portrait, e.g. "/images/vinay.jpg" (put the file in public/images). Empty = placeholder frame. */
  photo: "",
  links: {
    github: "https://github.com/vinu0404",
    linkedin: "https://linkedin.com/in/vinay-kumar-a4470a262/",
  },
  education: {
    degree: "B.Tech in Computer Science and Design",
    school: "RGIPT",
    grade: "CGPA 8.08",
  },
  about: [
    "I'm a GenAI engineer. I design multi-agent workflows and RAG pipelines, then measure what the agents actually say with evaluation tools instead of trusting a good-looking demo. I also build everything around the model: the APIs, databases, queues and deployment that keep it running.",
    "I have also done research in reinforcement learning, and that work is published at ACM. What I enjoy most is the step after the prototype: turning something that works once into something a business can rely on every day.",
  ],
} as const;

export const stats = [
  { value: 4, label: "roles" },
  { value: 4, label: "projects" },
  { value: 1, label: "ACM paper" },
] as const;

export type Experience = {
  company: string;
  role: string;
  lines: [string, string];
  detail: string[];
};

export const experience: Experience[] = [
  {
    company: "Newtuple Technologies",
    role: "Software Engineer, GenAI",
    lines: [
      "Designs prompt strategies and RAG architectures that ground LLM output on domain knowledge bases.",
      "Built gaugetuple, an AI evaluation tool that is now the baseline for an agent-based product.",
    ],
    detail: ["Evaluates agent output with DeepEval and Lighteval.", "Builds client prototypes."],
  },
  {
    company: "Steps AI",
    role: "GenAI Intern",
    lines: [
      "Built GitHub and Salesforce agents with scraping pipelines that fill vector knowledge bases.",
      "Added long-term memory with a persistent Milvus store, and short-term memory inside LangGraph workflows.",
    ],
    detail: [
      "Tuned chunking and embedding choices to improve retrieval precision.",
      "Helped build an end-to-end RAG pipeline for Coal India.",
    ],
  },
  {
    company: "Emitrr",
    role: "Software Engineer Intern",
    lines: [
      "Built Spring Security and JWT authentication with role-based access, plus the React frontend for it.",
      "Improved voice agent retrieval through prompt optimization, cutting irrelevant matches in production.",
    ],
    detail: ["Wrote unit tests with JUnit and Mockito."],
  },
  {
    company: "IITRAM",
    role: "Research Intern",
    lines: [
      "Built single-agent reinforcement learning policies for autonomous intersection management.",
      "Reward shaping raised average vehicle throughput by 23% over rule-based controllers. Published at ACM.",
    ],
    detail: ["Simulated 15+ traffic scenarios in SUMO."],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  flagship?: boolean;
  stack: string[];
  code?: string;
  demo?: string;
  problem: string;
  built: string[];
  outcome: string;
  /** Which product picture the card shows. */
  visual: "waves" | "chat" | "player" | "memory";
};

export const projects: Project[] = [
  {
    slug: "toposort-rag",
    name: "TopoSort RAG",
    tagline: "Multi-agent RAG that runs independent agents in parallel.",
    summary:
      "Agents are ordered with Kahn's topological sort, so anything that doesn't depend on something else runs at the same time.",
    flagship: true,
    stack: ["Python", "FastAPI", "Qdrant", "PostgreSQL", "Redis", "Celery", "MCP"],
    code: "https://github.com/vinu0404/TopoSort-RAG",
    demo: "https://toposort-rag-1.onrender.com",
    problem:
      "Most multi-agent setups run agents in a fixed chain. Every agent waits for the one before it, even when it doesn't need that agent's output. A question that touches your email, your code and your documents ends up paying for each step in turn. Frameworks like LangChain and LangGraph also hide the routing, which makes it hard to see why an agent ran.",
    built: [
      "A router that picks only the agents a query needs, written without LangChain or LangGraph.",
      "A scheduler that treats agents as a dependency graph and orders them with Kahn's topological sort. Agents with no unmet dependencies run in parallel, wave by wave.",
      "Gmail and GitHub connectors through MCP, so agents can read real mail and real repositories.",
      "Human-in-the-loop approval steps before any agent takes an action that matters.",
      "Recurring jobs you create in plain English, run in the background with Celery and Redis.",
      "Retrieval over Qdrant, with PostgreSQL for state.",
    ],
    outcome:
      "Independent agents no longer wait in line. The routing is plain code you can read, every action that matters has a human check, and the whole thing runs as a live demo you can try.",
    visual: "waves",
  },
  {
    slug: "gitspeak",
    name: "GitSpeak",
    tagline: "Ask questions about a GitHub codebase and get grounded answers.",
    summary: "A chatbot that answers from retrieved code, not from memory, and can draw the answer as a diagram.",
    stack: ["LangChain", "LangGraph", "FAISS", "OpenAI", "Chainlit", "LangSmith"],
    code: "https://github.com/vinu0404/mini_mini",
    problem:
      "Reading an unfamiliar repository is slow, and a general chatbot will happily make up functions that don't exist. Answers about code are only useful if they come from the code.",
    built: [
      "An indexing pipeline that embeds a repository into FAISS so answers are grounded in retrieved code.",
      "Support for Python, C/C++ and Jupyter notebooks.",
      "Mermaid diagram output, so structural questions get a picture instead of a paragraph.",
      "LangGraph workflow with LangSmith tracing to see what was retrieved and why.",
      "A Chainlit chat interface.",
    ],
    outcome: "You can point it at a repository and ask how things fit together, with the retrieved code behind every answer.",
    visual: "chat",
  },
  {
    slug: "framebus",
    name: "FrameBus",
    tagline: "A video streaming backend built as microservices.",
    summary: "Uploads, streaming and a recommendation engine for personalised videos, split into services.",
    stack: ["Spring Boot", "PostgreSQL", "Docker"],
    code: "https://github.com/vinu0404/FrameBus",
    problem:
      "A video platform has very different jobs: taking uploads, serving streams and deciding what to show next. Putting them in one service couples things that scale in different ways.",
    built: [
      "Separate Spring Boot services for uploads, streaming and recommendations.",
      "A recommendation engine that personalises the video feed.",
      "PostgreSQL for data and Docker for running the services together.",
    ],
    outcome: "Each part of the platform can change and scale on its own.",
    visual: "player",
  },
  {
    slug: "llama-2-qlora",
    name: "LLaMA 2 fine-tune",
    tagline: "LLaMA 2 7B Chat fine-tuned with QLoRA under 16 GB of GPU memory.",
    summary: "4-bit NF4 quantisation and LoRA adapters (rank 64, scaling 16) to fine-tune a 7B model on a single GPU.",
    stack: ["Transformers", "HuggingFace", "QLoRA"],
    problem: "Fine-tuning a 7B model normally needs far more GPU memory than a single consumer or free-tier card has.",
    built: [
      "Loaded LLaMA 2 7B Chat in 4-bit NF4 quantisation.",
      "Trained LoRA adapters with rank 64 and scaling 16 on top of the frozen base model.",
      "Kept the whole run under 16 GB of GPU memory.",
    ],
    outcome: "A working fine-tune of a 7B chat model on hardware that would not fit it in full precision.",
    visual: "memory",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "SQL", "MongoDB"] },
  {
    group: "AI and GenAI",
    items: [
      "Prompt engineering",
      "Context engineering",
      "RAG pipelines",
      "LangGraph",
      "LangChain",
      "LangSmith",
      "MCP",
      "HuggingFace",
      "scikit-learn",
      "n8n",
      "Azure AI Foundry",
      "DeepEval",
      "Lighteval",
    ],
  },
  {
    group: "Backend and infra",
    items: ["FastAPI", "Spring Boot", "Kafka", "Celery", "Docker", "PostgreSQL", "Qdrant", "Milvus", "FAISS"],
  },
  { group: "DevOps", items: ["GitHub Actions", "Git", "ELK Stack", "AWS SDK"] },
  { group: "Frontend and other", items: ["React", "Power BI", "SUMO"] },
];

export const certifications = [
  { name: "OpenAI API Deployment Practitioner", issuer: "OpenAI", date: "Aug 2026" },
  { name: "OpenAI Technical Practitioner", issuer: "OpenAI", date: "Aug 2026" },
];

export const publication = {
  title: "Optimizing Autonomous Intersection Control Using Single Agent Reinforcement Learning",
  venue: "ICDCN '25, ACM",
  url: "https://doi.org/10.1145/3700838.3703668",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
