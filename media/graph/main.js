const vscode = acquireVsCodeApi();

window.addEventListener("message", (e) => {
  const { type, payload } = e.data || {};
  if (type === "LOAD_COMMITS") {
    document.getElementById(
      "app"
    ).textContent = `Commits chargés: ${payload.length}`;
    // TODO: dessiner nodes/edges en SVG
  }
});
