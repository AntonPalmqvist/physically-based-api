import fs from "node:fs";
import path from "node:path";

// Copies the prebuilt standalone ESM build of @scalar/api-reference from
// node_modules into deploy/assets/js, so the static pages can self-host it
// without a build step. Re-run after updating the dependency.
const packageDir = "./node_modules/@scalar/api-reference/";
const browserDir = path.join(packageDir, "dist/browser");
const targetDir = "./deploy/assets/js";

const { version } = JSON.parse(
  fs.readFileSync(path.join(packageDir, "package.json"), "utf8"),
);

fs.copyFileSync(
  path.join(browserDir, "standalone.esm.js"),
  path.join(targetDir, "api-reference.js"),
);

// Chunk filenames are content-hashed and change between versions, so replace the folder
const targetChunks = path.join(targetDir, "chunks");
fs.rmSync(targetChunks, { recursive: true, force: true });
fs.mkdirSync(targetChunks, { recursive: true });
const chunks = fs
  .readdirSync(path.join(browserDir, "chunks"))
  .filter((file) => file.endsWith(".js"));
for (const chunk of chunks) {
  fs.copyFileSync(
    path.join(browserDir, "chunks", chunk),
    path.join(targetChunks, chunk),
  );
}

console.log(
  `Synced @scalar/api-reference@${version}: api-reference.js + ${chunks.length} chunks -> ${targetDir}`,
);
