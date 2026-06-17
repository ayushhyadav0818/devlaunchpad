// Mock database layer representing startup projects and portfolios

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "DevSync AI",
    tagline: "Collaborative real-time AI code reviewer for high-performance teams",
    description: "DevSync AI connects directly to your repository workflow, automatically analyzing code quality, design pattern violations, and security issues before merge requests. It learns from your codebase's architectural patterns.",
    creator: "Ayush Yadav",
    creatorGithub: "ayushhyadav0818",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    tags: ["AI", "SaaS", "Developer Tools"],
    upvotes: 42,
    hasVoted: false,
    github: "https://github.com/ayushhyadav0818/devsync-ai",
    website: "https://devsync-ai.vercel.app",
    comments: [
      { id: "c1", user: "Samir K.", text: "This is exactly what our remote team needed! Clean UI." },
      { id: "c2", user: "Elena P.", text: "Does it support custom linters?" }
    ],
    analytics: {
      views: 310,
      dailyUpvotes: [12, 19, 3, 5, 2, 3, 42]
    }
  },
  {
    id: "proj-2",
    name: "PromptVault",
    tagline: "Secure, collaborative database for your company's AI prompts",
    description: "Manage, version-control, and share premium system prompts across your organization. Integration ready with OpenAI, Anthropic, and Gemini SDKs directly.",
    creator: "Rohan Sharma",
    creatorGithub: "rohan-dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    tags: ["Productivity", "SaaS", "AI"],
    upvotes: 29,
    hasVoted: false,
    github: "https://github.com/rohan-dev/prompt-vault",
    website: "https://promptvault.io",
    comments: [
      { id: "c3", user: "Vikram S.", text: "Version control for prompts is awesome. Solves a major headache." }
    ],
    analytics: {
      views: 185,
      dailyUpvotes: [5, 8, 2, 4, 1, 9, 29]
    }
  },
  {
    id: "proj-3",
    name: "QueryFlow",
    tagline: "Visual SQL query builder and database schema modeling tool",
    description: "Design relational database schemas visually and get production-ready SQL queries instantly. Supports PostgreSQL, MySQL, and SQLite export schemas.",
    creator: "Tanya Verma",
    creatorGithub: "tanya-queries",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    tags: ["Developer Tools", "Database"],
    upvotes: 18,
    hasVoted: false,
    github: "https://github.com/tanya-queries/queryflow",
    website: "https://queryflow.net",
    comments: [],
    analytics: {
      views: 95,
      dailyUpvotes: [2, 3, 1, 2, 5, 2, 18]
    }
  }
];

export const getProjects = () => {
  const localData = localStorage.getItem("dev_launchpad_projects");
  if (!localData) {
    localStorage.setItem("dev_launchpad_projects", JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  return JSON.parse(localData);
};

export const saveProjects = (projects) => {
  localStorage.setItem("dev_launchpad_projects", JSON.stringify(projects));
};

export const addProject = (projectData) => {
  const projects = getProjects();
  const newProject = {
    id: `proj-${Date.now()}`,
    name: projectData.name,
    tagline: projectData.tagline,
    description: projectData.description,
    creator: projectData.creator || "Anonymous Developer",
    creatorGithub: projectData.creatorGithub || "ayushhyadav0818",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    tags: projectData.tags || ["General"],
    upvotes: 1,
    hasVoted: true, // Auto upvoted by creator
    github: projectData.github || "https://github.com",
    website: projectData.website || "",
    comments: [],
    analytics: {
      views: 12,
      dailyUpvotes: [1]
    }
  };
  projects.unshift(newProject);
  saveProjects(projects);
  return projects;
};

export const upvoteProject = (id) => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    const proj = projects[index];
    if (proj.hasVoted) {
      proj.upvotes -= 1;
      proj.hasVoted = false;
    } else {
      proj.upvotes += 1;
      proj.hasVoted = true;
    }
    projects[index] = proj;
    saveProjects(projects);
  }
  return projects;
};

export const addComment = (projectId, commentText, author) => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    const newComment = {
      id: `c-${Date.now()}`,
      user: author || "Anonymous Peer",
      text: commentText
    };
    projects[index].comments.push(newComment);
    saveProjects(projects);
  }
  return projects;
};
