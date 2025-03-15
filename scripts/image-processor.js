// 1. Run: "npm run image-processor [folder]" where the "folder" argument is an optional argument and defaults to "cycles". (only new or modified images are added to Git, so it's safe to run on all images)
// Optional. Assign a custom ICC profile to the original renders before doing step 1. Consider using sharp if all you need is sRGB and/or P3 https://sharp.pixelplumbing.com/api-output#withiccprofile
//           Linux:  "./exiftool "-icc_profile<=sRGB2014.icc" -overwrite_original /home/anton/Git/physically-based-web/static/images/renders/cycles/original/"
//           Mac:    "exiftool "-icc_profile<=sRGB2014.icc" -overwrite_original /Users/anton/Git/physically-based-web/static/images/renders/cycles/original"
// TODO: Render OpenEXR originals (depends on OpenEXR support in sharp) https://github.com/lovell/sharp/issues/698

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const renderFolder = process.argv[2] || "cycles";

async function processImages() {
  try {
    // Define the folder containing the original images
    const folderPath = `images/renders/${renderFolder}/original`;

    // Define the folders to save resized images
    const resizedFolderPath300 = `images/renders/${renderFolder}/300`;
    const resizedFolderPath600 = `images/renders/${renderFolder}/600`;

    // Check if the resized folders exist, if not, create them
    if (!fs.existsSync(resizedFolderPath300)) {
      fs.mkdirSync(resizedFolderPath300, { recursive: true });
    }
    if (!fs.existsSync(resizedFolderPath600)) {
      fs.mkdirSync(resizedFolderPath600, { recursive: true });
    }

    // Read the contents of the folder
    const files = await fs.promises.readdir(folderPath);

    // Loop through each file
    for (const file of files) {
      // Check if the file is an image (you may need to refine this check)
      if (file.toLowerCase().endsWith(".png")) {
        // Construct the full path to the image file
        const imagePath = path.join(folderPath, file);

        // JPEG
        // Process for JPEG 600x600
        const outputFileNameJpeg600 = `${path.parse(file).name}.jpeg`;
        const outputFileJpeg600 = path.join(
          resizedFolderPath600,
          outputFileNameJpeg600
        );

        const processJpeg600 = await sharp(imagePath)
          .withMetadata() // Keeps most metadata and adds sRGB ICC profile  https://sharp.pixelplumbing.com/api-output#withmetadata
          .resize({ width: 600, height: 600 })
          .toFormat("jpeg", { mozjpeg: true, quality: 65 })
          .toFile(outputFileJpeg600); // Save resized image with modified name

        console.log(`Processed ${file} (600x600):`, processJpeg600);

        // Process for JPEG 300x300
        const outputFileNameJpeg300 = `${path.parse(file).name}.jpeg`;
        const outputFileJpeg300 = path.join(
          resizedFolderPath300,
          outputFileNameJpeg300
        );

        const processJpeg300 = await sharp(imagePath)
          .withMetadata() // Keeps most metadata and adds sRGB ICC profile  https://sharp.pixelplumbing.com/api-output#withmetadata
          .resize({ width: 300, height: 300 })
          .toFormat("jpeg", { mozjpeg: true, quality: 65 })
          .toFile(outputFileJpeg300); // Save resized image with modified name

        console.log(`Processed ${file} (300x300):`, processJpeg300);

        // AVIF
        // Process for AVIF 600x600
        const outputFileNameAVIF600 = `${path.parse(file).name}.avif`;
        const outputFileAVIF600 = path.join(
          resizedFolderPath600,
          outputFileNameAVIF600
        );

        const processAVIF600 = await sharp(imagePath)
          .withMetadata() // Keeps most metadata and adds sRGB ICC profile  https://sharp.pixelplumbing.com/api-output#withmetadata
          .resize({ width: 600, height: 600 })
          .toFormat("avif", { quality: 50 })
          .toFile(outputFileAVIF600); // Save resized image with modified name

        console.log(`Processed ${file} (600x600):`, processAVIF600);

        // Process for AVIF 300x300
        const outputFileNameAVIF300 = `${path.parse(file).name}.avif`;
        const outputFileAVIF300 = path.join(
          resizedFolderPath300,
          outputFileNameAVIF300
        );

        const processAVIF300 = await sharp(imagePath)
          .withMetadata() // Keeps most metadata and adds sRGB ICC profile  https://sharp.pixelplumbing.com/api-output#withmetadata
          .resize({ width: 300, height: 300 })
          .toFormat("avif", { quality: 50 })
          .toFile(outputFileAVIF300); // Save resized image with modified name

        console.log(`Processed ${file} (300x300):`, processAVIF300);
      }
    }
  } catch (error) {
    console.error("Error processing images:", error);
  }
}

processImages();
