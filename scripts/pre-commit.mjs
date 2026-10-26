import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const rendersDir = path.join(repoRoot, "images", "renders", "cycles");
const imageSizes = ["300", "600"];

// Get current date as YYYYMMDDHHmm
function getCurrentDateAsNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return parseInt(`${year}${month}${day}${hours}${minutes}`, 10);
}

async function updateDatabaseVersion(filePath) {
  try {
    let data = await readFile(filePath, "utf8");
    const newVersion = getCurrentDateAsNumber();
    data = data.replace(/"updated":\s*\d+,/, `"updated": ${newVersion},`);
    await writeFile(filePath, data, "utf8");
    console.log(`Updated database version in ${filePath}`);
  } catch (err) {
    console.error(`Error updating ${filePath}:`, err);
    process.exit(1);
  }
}

// Check that every image referenced in materials.json exists under images/renders/cycles
async function validateMaterialImages(filePath) {
  let materials;
  try {
    const data = JSON.parse(await readFile(filePath, "utf8"));
    materials = data.data ?? [];
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
    process.exit(1);
  }

  const existingFiles = new Map();
  for (const size of imageSizes) {
    try {
      existingFiles.set(
        size,
        new Set(await readdir(path.join(rendersDir, size))),
      );
    } catch (err) {
      console.error(`Error reading ${path.join(rendersDir, size)}:`, err);
      process.exit(1);
    }
  }

  const missing = [];
  for (const material of materials) {
    for (const image of material.images ?? []) {
      for (const size of imageSizes) {
        const url = image[size];
        if (!url) continue;
        const marker = "images/renders/cycles/";
        const markerIndex = url.indexOf(marker);
        const relativePath =
          markerIndex === -1 ? null : url.slice(markerIndex + marker.length);
        const fileName = path.basename(relativePath ?? "");
        if (!relativePath || !existingFiles.get(size)?.has(fileName)) {
          missing.push(`${material.name}: ${url}`);
        }
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      `Found ${missing.length} material image(s) without a corresponding file in ${rendersDir}:`,
    );
    for (const entry of missing) {
      console.error(`  ${entry}`);
    }
    process.exit(1);
  }
  console.log(
    `All material images in ${filePath} have corresponding files in ${rendersDir}`,
  );
}

// Only process files passed as arguments (from lint-staged)
async function main() {
  const args = process.argv.slice(2);
  const stagedFlag = args.includes("--staged");
  const filePaths = args.filter((arg) => !arg.startsWith("--"));

  if (stagedFlag && filePaths.length > 0) {
    for (const file of filePaths) {
      if (path.basename(file) === "materials.json") {
        await validateMaterialImages(file);
      }
      await updateDatabaseVersion(file);
    }
  } else {
    console.log("No staged files to process or --staged flag not set.");
  }
}

main();
