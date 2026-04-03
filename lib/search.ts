import { projects, type Project } from "./projects";

type WeightedField = {
  text: string;
  weight: number;
};

function getWeightedFields(p: Project): WeightedField[] {
  return [
    { text: p.title, weight: 10 },
    { text: p.subtitle, weight: 6 },
    { text: p.category, weight: 5 },
    { text: p.tags.join(" "), weight: 8 },
    { text: p.techStack.join(" "), weight: 6 },
    { text: p.description, weight: 4 },
    { text: p.impact, weight: 3 },
    ...p.workflowSteps.map((s) => ({ text: `${s.step} ${s.detail}`, weight: 2 })),
    ...p.benefits.map((b) => ({ text: `${b.label}${b.info ? ` ${b.info}` : ""}`, weight: 2 })),
  ];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreProject(project: Project, queryTerms: string[]): number {
  const fields = getWeightedFields(project);
  let score = 0;

  for (const term of queryTerms) {
    for (const field of fields) {
      const fieldTokens = tokenize(field.text);
      if (fieldTokens.some((t) => t.includes(term))) {
        score += field.weight;
      }
    }
  }

  for (const term of queryTerms) {
    if (project.title.toLowerCase().includes(term)) {
      score += 5;
    }
  }

  for (const tag of project.tags) {
    const tagLower = tag.toLowerCase();
    for (const term of queryTerms) {
      if (tagLower.includes(term) || term.includes(tagLower)) {
        score += 4;
      }
    }
  }

  return score;
}

const PROJECT_LIST_KEYWORDS = [
  "all projects",
  "every project",
  "list projects",
  "show projects",
  "your projects",
  "what projects",
  "portfolio",
  "all your work",
  "everything you",
  "showcase",
  "all of them",
  "every single",
];

export interface SearchResult {
  projects: Project[];
  isFiltered: boolean;
}

export function searchProjects(query: string, topK = 5): SearchResult {
  const q = query.toLowerCase().trim();

  if (PROJECT_LIST_KEYWORDS.some((k) => q.includes(k))) {
    return { projects, isFiltered: false };
  }

  const queryTerms = tokenize(query);

  if (queryTerms.length === 0) {
    return { projects, isFiltered: false };
  }

  const scored = projects.map((p) => ({
    project: p,
    score: scoreProject(p, queryTerms),
  }));

  scored.sort((a, b) => b.score - a.score);

  const matches = scored.filter((s) => s.score > 0).slice(0, topK);

  if (matches.length > 0) {
    return { projects: matches.map((m) => m.project), isFiltered: true };
  }

  return { projects, isFiltered: false };
}
