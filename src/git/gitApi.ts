// API intégré de vscode pour interagir avec Git
import * as vscode from "vscode";

// Types basiques pour l’API Git intégrée
export type BuiltInGitApi = {
  state: "uninitialized" | "initialized";
  repositories: Repository[];
  onDidOpenRepository: vscode.Event<Repository>;
  onDidCloseRepository: vscode.Event<Repository>;
  // ... selon git.d.ts exposé par l’extension intégrée
};

// Type basique pour un Repository
export type Repository = {
  rootUri: vscode.Uri;
  // HEAD, refs, state, etc. dépendent de l’API
  // (tu peux typer au fur et à mesure)
};

// Fonction pour obtenir l’API Git intégrée
export async function getBuiltInGitApi(): Promise<BuiltInGitApi | undefined> {
  const ext = vscode.extensions.getExtension("vscode.git");
  if (!ext) {
    return undefined;
  }
  const exports = ext.isActive ? ext.exports : await ext.activate();
  return exports?.getAPI(1); // v1
}
