import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "vite";

// configure-pages supplies the path for the selected repository or custom domain.
const requestedBase = process.env.PAGES_BASE_PATH ?? "/studyflow/";
if (!requestedBase.startsWith("/") || requestedBase.startsWith("//") || /[?#\\]|\.\./.test(requestedBase)) {
  throw new Error("PAGES_BASE_PATH must be an absolute URL path, such as /studyflow/.");
}
const base = requestedBase.endsWith("/") ? requestedBase : `${requestedBase}/`;
const root = fileURLToPath(new URL("../", import.meta.url));

await build({ root, base, build: { outDir: "dist/pages" } });
await writeFile(new URL("../dist/pages/.nojekyll", import.meta.url), "");
console.log(`GitHub Pages build ready: dist/pages (base ${base})`);
