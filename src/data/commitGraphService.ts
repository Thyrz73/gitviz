// construction DAG, pagination, filtres

import { gitLog } from "../git/gitCli";
import { parseLog, CommitNode } from "../git/models";

// Service pour construire et gérer le graphe des commits
export class CommitGraphService {
  private commits: CommitNode[] = [];
  private windowSize = 200; // MVP : fenêtre de 200
  private lastLoaded = 0;

  async loadInitial(root: string): Promise<CommitNode[]> {
    const raw = await gitLog(root, this.windowSize);
    this.commits = parseLog(raw);
    this.lastLoaded = this.commits.length;
    return this.commits;
  }

  // Plus tard: filtres (auteur, branche, texte), pagination supplémentaire...
}
