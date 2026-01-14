// Types (CommitNode, RepoInfo, FileChange...)

// Interfaice basique pour un Commit dans le graphe
export interface CommitNode {
  hash: string;
  parents: string[];
  author: string;
  date: string; // ISO
  subject: string;
}

// Parse le résultat brut de git log en CommitNode[]
export function parseLog(raw: string): CommitNode[] {
  return raw
    .trim()
    .split("\n")
    .map((line) => {
      const [h, p, a, d, s] = line.split("|");
      return {
        hash: h,
        parents: p ? p.split(" ") : [],
        author: a,
        date: d,
        subject: s,
      };
    });
}
