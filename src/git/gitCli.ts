// CLI git + parseur pour récuperer les données manquantes à la main

import { execFile } from "child_process";

// Wrapper pour execFile en Promise
function execFileAsync(
  cmd: string,
  args: string[],
  cwd?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { cwd }, (err, out) =>
      err ? reject(err) : resolve(out)
    );
  });
}

// Exécute git log et retourne le résultat brut
export async function gitLog(root: string, max = 200): Promise<string> {
  // Hash | Parents | Author | Date | Subject
  return execFileAsync(
    "git",
    ["log", `--max-count=${max}`, "--pretty=%H|%P|%an|%ad|%s", "--date=iso"],
    root
  );
}

// Exécute git show pour un commit donné et retourne le résultat brut
export async function gitShow(root: string, hash: string): Promise<string> {
  return execFileAsync(
    "git",
    ["show", "--name-status", "--pretty=fuller", hash],
    root
  );
}

// Exécute git blame en mode porcelain pour un fichier donné et retourne le résultat brut
export async function gitBlamePorcelain(
  root: string,
  filePath: string
): Promise<string> {
  return execFileAsync("git", ["blame", "--line-porcelain", filePath], root);
}
