// src/ui/graphview/provider.ts
import * as vscode from "vscode";
import { readFile } from "fs/promises";

export class GraphViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "gitviz.graphView";

  constructor(private readonly context: vscode.ExtensionContext) {}

  async resolveWebviewView(view: vscode.WebviewView) {
    const { webview } = view;

    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    webview.html = await getHtmlFromFile(webview, this.context);
  }
}

async function getHtmlFromFile(
  webview: vscode.Webview,
  ctx: vscode.ExtensionContext
) {
  const nonce = String(Date.now());

  // Construit des URIs “webview” pour tes ressources
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

  // Lis le HTML du disque
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
