import { readFile, writeFile } from "fs/promises";
const filePath = "./deploy/v2/cameras.json";

// Function to get current date as YYYYMMDDHHmm
function getCurrentDateAsNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return parseInt(`${year}${month}${day}${hours}${minutes}`);
}

async function updateDatabaseVersion() {
  try {
    // Read the JSON file
    let data = await readFile(filePath, "utf8");

    // Replace only the databaseVersion value using regex
    const newVersion = getCurrentDateAsNumber();
    data = data.replace(
      /"databaseVersion":\s*\d+,/,
      `"databaseVersion": ${newVersion},`
    );

    // Write the updated content back to the file
    await writeFile(filePath, data, "utf8");
    // console.log(data);
    console.log("pre-commit.mjs: databaseVersion updated successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

// Run the function
updateDatabaseVersion();
