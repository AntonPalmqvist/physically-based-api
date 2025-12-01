import { readFile, writeFile } from "fs/promises";
import process from "process";

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
    process.exit(1);
  }
}

// Only process files passed as arguments (from lint-staged)
async function main() {
  const args = process.argv.slice(2);
  const stagedFlag = args.includes("--staged");
  const filePaths = args.filter((arg) => !arg.startsWith("--"));

  if (stagedFlag && filePaths.length > 0) {
    for (const file of filePaths) {
      await updateDatabaseVersion(file);
    }
  } else {
    console.log("No staged files to process or --staged flag not set.");
  }
}

main();
