import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

const folderPath = "./deploy/v2/";
const targetFiles = [
  "cameras.json",
  "materials.json",
  "lightsources.json",
  "lenses.json",
];

// Get current date as YYYYMMDDHHmm
function getCurrentDateAsNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return parseInt(`${year}${month}${day}${hours}${minutes}`);
}

async function updateDatabaseVersion(filePath) {
  try {
    let data = await readFile(filePath, "utf8");
    const newVersion = getCurrentDateAsNumber();
    data = data.replace(
      /"databaseVersion":\s*\d+,/,
      `"databaseVersion": ${newVersion},`
    );
    await writeFile(filePath, data, "utf8");
    console.log(`Updated databaseVersion in ${filePath}`);
  } catch (err) {
    console.error(`Error updating ${filePath}:`, err);
  }
}

async function main() {
  //Testing
  try {
    const files = await readdir(folderPath);
    for (const file of targetFiles) {
      if (files.includes(file)) {
        const filePath = join(folderPath, file);
        await updateDatabaseVersion(filePath);
      } else {
        console.warn(`File ${file} not found in ${folderPath}`);
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}

main();
