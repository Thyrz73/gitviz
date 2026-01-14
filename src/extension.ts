import * as vscode from "vscode";
import { GraphViewProvider } from "/home/guigui/dev/gitviz/src/ui/graphView/provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// Register commands and the Webview view provider in the activate function
export function activate(context: vscode.ExtensionContext) {
  console.log("gitviz active");

  // Register a simple command hello world!
  context.subscriptions.push(
    vscode.commands.registerCommand("gitviz.helloWorld", async () => {
      await vscode.window.showInformationMessage("Hello World from GitViz!");
    })
  );

  // Register the Graph View provider --> Display the view when opened
  const provider = new GraphViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GraphViewProvider.viewType,
      provider
    )
  );

  // Command to open the Graph View
  context.subscriptions.push(
    vscode.commands.registerCommand("gitviz.revealGraphView", async () => {
      await vscode.commands.executeCommand("gitviz.graphView.focus"); // ouvre le Panel si nécessaire
      await vscode.window.showInformationMessage("Graph View revealed!");
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
