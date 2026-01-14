// src/ui/graphview/provider.ts
import * as vscode from "vscode";
import { readFile } from "fs/promises";

import { RepositoryService } from "../../data/repositoryService";
import { CommitGraphService } from "../../data/commitGraphService";

export class GraphViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "gitviz.graphView";

  constructor(private readonly context: vscode.ExtensionContext) {}

  async resolveWebviewView(view: vscode.WebviewView) {
    const repoService = new RepositoryService();
    await repoService.init();
    const root = repoService.getRoot();

    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    view.webview.html = await getHtmlFromFile(view.webview, this.context);

    // Charger les commits et envoyer à la webview
    if (root) {
      const graphService = new CommitGraphService();
      const commits = await graphService.loadInitial(root);

      view.webview.postMessage({ type: "LOAD_COMMITS", payload: commits });
    } else {
      view.webview.postMessage({ type: "LOAD_COMMITS", payload: [] });
    }

    // Réception d’actions (clic sur nœud, demandes de page, filtres)
    view.webview.onDidReceiveMessage(async (msg) => {
      switch (msg?.type) {
        case "NODE_CLICK":
          // ex. ouvrir diff du commit
          await vscode.commands.executeCommand(
            "vscode.open" /* Uri vers diff */
          );
          break;
      }
    });
  }
}

async function getHtmlFromFile(
  webview: vscode.Webview,
  ctx: vscode.ExtensionContext
) {
  const nonce = String(Date.now());

  // Construit des URIs “webview” pour tes ressources --> media/graph/main.js, styles.css
  const mediaRoot = vscode.Uri.joinPath(ctx.extensionUri, "media", "graph");
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(mediaRoot, "main.js")
  );
  const stylesUri = webview.asWebviewUri(
    vscode.Uri.joinPath(mediaRoot, "styles.css")
  );

  // CSP stricte : pas de remote, scripts/styles autorisés via nonce, images locales autorisées
  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource}`,
    `style-src ${webview.cspSource} 'nonce-${nonce}'`,
    `script-src 'nonce-${nonce}'`,
  ].join("; ");

  // Lis le HTML du disque --> media/graph/index.html
  const htmlPath = vscode.Uri.joinPath(mediaRoot, "index.html");
  let html = await readFile(htmlPath.fsPath, "utf-8");

  // Remplacements “tag -> valeur”
  html = html
    .replace("$$CSP$$", csp)
    .replaceAll("$$NONCE$$", nonce)
    .replace("$$SCRIPT$$", String(scriptUri))
    .replace("$$STYLES$$", String(stylesUri));

  return html;
}
