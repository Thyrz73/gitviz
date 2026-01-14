// sélection repo, HEAD, events

import * as vscode from "vscode";
import { getBuiltInGitApi, Repository } from "../git/gitApi";

// Service pour gérer le repository Git courant
export class RepositoryService {
  private repo: Repository | undefined;

  async init(): Promise<void> {
    const api = await getBuiltInGitApi();
    if (!api || api.repositories.length === 0) {
      return;
    }

    this.repo = api.repositories[0]; // MVP: premier repo
    // TODO: écouter api.onDidOpenRepository / onDidCloseRepository
    // TODO: exposer onHeadChanged si l’API le propose
  }

  getRoot(): string | undefined {
    return this.repo?.rootUri.fsPath;
  }
}
