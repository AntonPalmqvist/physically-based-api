import fs from "node:fs";
import util from "node:util";
import AdmZip from "adm-zip";

const usdVersion = "1.0";
const outputFile = `USD-v ${usdVersion}.zip`;
const tempFolder = "./tmp/";

// Promisify the fs functions
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);

async function processJson(file) {
  try {
    // Create directories if they don't exist
    await mkdir("./tmp/json/full", { recursive: true });
    await mkdir("./tmp/json/mini", { recursive: true });
    await mkdir("./tmp/json/nano", { recursive: true });
  } catch (err) {
    console.error("Error creating directories:", err);
  }

  // Remove all 'references' keys from an object
  function removeReferences(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map((item) => removeReferences(item));
    if (obj.hasOwnProperty("references")) delete obj.references;
    for (const key in obj) obj[key] = removeReferences(obj[key]);
    return obj;
  }

  // Remove all 'description' keys from an object
  function removeDescriptions(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map((item) => removeDescriptions(item));
    if (obj.hasOwnProperty("description")) delete obj.description;
    for (const key in obj) obj[key] = removeDescriptions(obj[key]);
    return obj;
  }

  async function fullJson(file) {
    try {
      const data = await readFile(`./deploy/v2/${file}.json`, "utf8");
      const jsonData = JSON.parse(data);
      await writeFile(
        `./tmp/json/full/${file}.json`,
        JSON.stringify(jsonData),
        "utf8"
      );
      const stats = await stat(`./tmp/json/full/${file}.json`);
      const originalStats = await stat(`./deploy/v2/${file}.json`);
      console.log(
        "Full: copied " +
          file +
          ".json " +
          Math.round(stats.size / 1024) +
          " kB (" +
          (Math.round(stats.size / 1024) -
            Math.round(originalStats.size / 1024)) +
          " kB)"
      );
    } catch (err) {
      console.error("Error in fullJson:", err);
    }
  }

  async function miniJson(file) {
    try {
      const data = await readFile(`./deploy/v2/${file}.json`, "utf8");
      const jsonData = JSON.parse(data);
      const cleanedData = removeReferences(jsonData);
      await writeFile(
        `./tmp/json/mini/${file}.json`,
        JSON.stringify(cleanedData),
        "utf8"
      );
      const stats = await stat(`./tmp/json/mini/${file}.json`);
      const originalStats = await stat(`./deploy/v2/${file}.json`);
      console.log(
        "Mini: references removed from " +
          file +
          ".json " +
          Math.round(stats.size / 1024) +
          " kB (" +
          (Math.round(stats.size / 1024) -
            Math.round(originalStats.size / 1024)) +
          " kB)"
      );
    } catch (err) {
      console.error("Error in miniJson:", err);
    }
  }

  async function nanoJson(file) {
    try {
      const data = await readFile(`./deploy/v2/${file}.json`, "utf8");
      const jsonData = JSON.parse(data);
      const referencesRemoved = removeReferences(jsonData);
      const cleanedData = removeDescriptions(referencesRemoved);
      await writeFile(
        `./tmp/json/nano/${file}.json`,
        JSON.stringify(cleanedData),
        "utf8"
      );
      const stats = await stat(`./tmp/json/nano/${file}.json`);
      const originalStats = await stat(`./deploy/v2/${file}.json`);
      console.log(
        "Nano: references and descriptions removed from " +
          file +
          ".json " +
          Math.round(stats.size / 1024) +
          " kB (" +
          (Math.round(stats.size / 1024) -
            Math.round(originalStats.size / 1024)) +
          " kB)"
      );
    } catch (err) {
      console.error("Error in nanoJson:", err);
    }
  }

  async function runSequentially() {
    await fullJson(file);
    await miniJson(file);
    await nanoJson(file);
  }

  runSequentially();
}

function createCameras() {
  return new Promise((resolve, reject) => {
    fs.readFile("./deploy/v2/cameras.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      // prettier-ignore
      function makeUSD(
    hit
  ) {
    let usd = "";
    const upAxis = "Y";
    const name =
      hit.make.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "") +
      "_" +
      hit.model.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "");
    const define =
      'def Xform "' + name + '" (\n' +
      '    variants = {\n' +
      '        string sensorSize = "' + hit.sensorSize[0].format.replace(/ |-|:|\./g, "_") + '"\n' +
      '    }\n' +
      '    prepend variantSets = "sensorSize"\n' +
      ')\n' +
      '{\n' +
      '	  def Camera "' + name + '"\n' +
      '    {\n' +
      '        float2 clippingRange = (0.1, 1000)\n' +
      '        float focalLength = 50\n' +
      '        token projection = "perspective"\n' +
      '        float horizontalApertureOffset = 0\n' +
      '        float verticalApertureOffset = 0\n' +
      '    }\n\n';
    const variantSets =
      '    variantSet "sensorSize" = {\n' +
      hit.sensorSize.map((item) => (
        '        "' + item.format.replace(/ |-|:|\./g, "_") + '" {\n' +
        '            over "' + name + '"\n' +
        '            {\n'+
        '                float horizontalAperture = ' + item.size[0].toFixed(2) + '\n' +
        '                float verticalAperture = ' + item.size[1].toFixed(2) + '\n' +
        '            }\n' +
        '        }\n'
      )).join('\n') +
      '    }\n'+
      '}\n';
    
    usd =
      '#usda 1.0\n' +
      '(\n' +
      '    defaultPrim = "' + name +'"\n' +
      '    doc = "https://api.physicallybased.info"\n' +
      '    metersPerUnit = 0.01\n' +
      '    upAxis = "' + upAxis + '"\n' +
      ')\n' +
      '\n' +
      define +
      variantSets;
    return usd;
  }
      const folder = "./tmp/usd/cameras/";
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      JSON.parse(data).forEach((element) => {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        const fileName =
          folder +
          element.make.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "") +
          "_" +
          element.model.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "") +
          ".usda";
        fs.writeFile(fileName, makeUSD(element), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(`${fileName} created`);
            resolve();
          }
        });
      });
    });
  });
}

function createLightsources() {
  function lumenToNitsRect(lumen, width, height) {
    // Converts luminous flux (lm) to luminance (nits, or cd/m2). Width and height are measured in meters.
    // https://github.com/mrdoob/three.js/blob/16128f5d7236a0410dca44f9da5728633a9ef049/src/lights/RectAreaLight.js#L28
    // https://www.en.silicann.com/blog/post/nits-lux-lumen-candela-calculating-with-light-and-lighting/
    // https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine#point,spot,andrectlights
    const nits = lumen / (width * height * Math.PI); // Funkar!

    return nits;
  }

  function lumenToNitsSpot(lumen, radius, beamAngle) {
    // Converts luminous flux (lm) to luminance (nits, or cd/m2). Radius is measured in meters.
    // https://www.en.silicann.com/blog/post/nits-lux-lumen-candela-calculating-with-light-and-lighting/
    // https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine#point,spot,andrectlights
    // https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    // prettier-ignore
    const nits = lumen / (2 * Math.PI * (1 - Math.cos(beamAngle / 2 * Math.PI / 180)) * Math.pow(radius, 2)); // Funkar!

    return nits;
  }

  function lumenToNitsPoint(lumen, radius) {
    // Converts luminous flux (lm) to luminance (nits, or cd/m2). Radius is measured in meters.
    // p40 in https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    // https://www.en.silicann.com/blog/post/nits-lux-lumen-candela-calculating-with-light-and-lighting/
    // https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine#point,spot,andrectlights
    const nits = lumen / (4 * Math.pow(radius, 2) * Math.pow(Math.PI, 2)); // Correct according to the example in the Frostbite paper, but does not match Unreal

    return nits;
  }

  function lumenToNitsCylinder(lumen, radius, length) {
    // Converts luminous flux (lm) to luminance (nits, or cd/m2). Radius and length are measured in meters.
    // p40 in https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    // https://www.researchgate.net/publication/303720797_Solid_Angle_Sampling_of_Disk_and_Cylinder_Lights#pf4
    // prettier-ignore
    const nits = lumen / ((2 * Math.PI * radius * length + 4 * Math.PI * Math.pow(radius, 2)) * Math.PI); // This results in 4x intensity compared to Unreal for some reason.

    return nits;
  }

  function luxToLumen(lux, distance, beamAngle) {
    // Converts illuminance (lx) to luminous flux (lm). Distance is measured in meters.
    // https://www.bannerengineering.com/us/en/company/expert-insights/lux-lumens-calculator.html
    // https://www.rapidtables.com/calc/light/lux-to-lumen-calculator.html
    // https://www.calculator.net/surface-area-calculator.html?coneradius=0.6582&coneradiusunit=meters&coneheight=5&coneheightunit=meters&conecal=Calculate#cone
    // https://mathcentral.uregina.ca/QQ/database/QQ.09.07/s/marija1.html
    // coneAngleInRadians = coneAngle * pi / 180
    // radius = distance * tan(coneAngleInRadians)
    // surfaceArea = pi * Math.pow(distance * tan(coneAngleInradians), 2)
    // lumen = lux * surfaceArea
    // prettier-ignore
    const lumen = lux * Math.PI * Math.pow(distance * Math.tan(((beamAngle / 2) * Math.PI) / 180), 2);

    return lumen;
  }

  function roundLargeNumbers(num, threshold) {
    // If the absolute value of the number is greater than or equal to threshold, round to the nearest integer
    if (Math.abs(num) >= threshold) {
      return Math.round(num);
    } else {
      return num.toFixed(2);
    }
  }

  return new Promise((resolve, reject) => {
    fs.readFile("./deploy/v2/lightsources.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      // prettier-ignore
      function makeUSD(
    hit
  ) {
    let usd = "";
    const upAxis = "Y";
    const name = hit.name.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "");
    const type = hit.type[0] === "surface" ? "RectLight" : hit.type[0] === "directional" ? "DistantLight" : hit.type[0] === "dome" ? "DomeLight" : hit.type[0] === "cylinder" ? "CylinderLight" : "SphereLight";
    const define =
      'def Xform "' + name + '" (\n' +
      '    variants = {\n' +
      '        string lightVariant = "' + hit.variants[0].format.replace(/ |-|:|\./g, "_") + '"\n' +
      '    }\n' +
      '    prepend variantSets = "lightVariant"\n' +
      ')\n' +
      '{\n' +
      '    def ' + type + ' "' + name + '" \n' +
      (hit.type[0] === "spot" ?
      '    (\n' +
      '        prepend apiSchemas = ["ShapingAPI"]\n' +
      '    )\n' +
      '    {\n' +
      '    }\n'
      :
      '    {\n' +
      '    }\n')
      ;
    const variantSets =
      '    variantSet "lightVariant" = {\n' +
      hit.variants.map((item) => {
        const variantName = item.format.replace(/ |-|:|\./g, "_");
        const colorTemperature =
            item.temperature && item.temperature[2]
          ? '                float inputs:colorTemperature = ' + item.temperature[2] + '\n'
          : item.temperature && item.temperature[1]
          ? '                float inputs:colorTemperature = ' + item.temperature[1] + '\n'
          : item.temperature && item.temperature[0]
          ? '                float inputs:colorTemperature = ' + item.temperature[0] + '\n'
          : "";
        const enableColorTemperature = colorTemperature !== "" ? 1 : 0;
        const color = enableColorTemperature === 0 ? '                color3f inputs:color = (' + item.color[0].color[0].toFixed(3)+', '+ item.color[0].color[1].toFixed(3)+', '+ item.color[0].color[2].toFixed(3) +')\n' : '                color3f inputs:color = (1.0, 1.0, 1.0)\n';
        const intensity =
            item.intensity && item.intensity[2]
          ? item.intensity[2]
          : item.intensity && item.intensity[1]
          ? item.intensity[1]
          : item.intensity && item.intensity[0]
          ? item.intensity[0]
          : item.intensity
          ? item.intensity
          : null;
        // console.log(`${name} ${intensity}`);
        const width = item.sourceSize && hit.type[0] === "surface" ? item.sourceSize[0] : item.sourceSize && hit.type[0] === "surface" ? item.sourceSize[0] : null;
        const height = item.sourceSize && hit.type[0] === "surface" ? item.sourceSize[1] : item.sourceSize && hit.type[0] === "surface" ? item.sourceSize[1] : null;
        const length = item.sourceSize && hit.type[0] === "cylinder" ? item.sourceSize[1] : item.sourceSize && hit.type[0] === "cylinder" ? item.sourceSize[1] : null;
        const radius = item.sourceSize && (hit.type[0] === "point" || hit.type[0] === "spot" || hit.type[0] === "cylinder") ? item.sourceSize[0] : item.sourceSize && (hit.type[0] === "point" || hit.type[0] === "spot" || hit.type[0] === "cylinder") ? item.sourceSize[0] : 1.00001; // 1.00001 is here to give a number as close as 1 for the conversion to work when no radius is provided, unusual enough to not be ignored if there's a light source with 1 cm radius. Further motivated by "we chose to automatically promote punctual lights to small area lights of 1 cm if the artists specify a luminance unit to control the intensity." on p39 in https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
        const treatAsPoint = item.sourceSize > 0 && (hit.type[0] === "point" || hit.type[0] === "spot") ? '                bool treatAsPoint = ' + 0 + '\n' : item.sourceSize && item.sourceSize[0] > 0 && (hit.type[0] === "point" || hit.type[0] === "spot") ? '                bool treatAsPoint = ' + 0 + '\n' : "";
        const coneAngle = item.angle && (hit.type[0] === "spot") ? item.angle / 2 : item.angle && (hit.type[0] === "spot") ? item.angle / 2 : null; // Divided by 2 because USD uses half-angle, θ, where the API uses beam angle
        const angle = item.angle && hit.type[0] === "directional" ? item.angle : item.angle && hit.type[0] === "directional" ? item.angle : null;
        // TODO: Add proper conversion for W
        const convertedIntensity =
            hit.type[0] === "directional" ? intensity
          : hit.type[0] === "surface" && hit.unit[0] === "cd/m2" ? intensity
          : hit.type[0] === "surface" && hit.unit[0] === "lm" ? lumenToNitsRect(intensity, width / 100, height / 100)
          : hit.type[0] === "spot" && hit.unit[0] === "lm" ? lumenToNitsSpot(intensity, radius / 100, coneAngle * 2)
          : hit.type[0] === "spot" && hit.unit[0] === "lx" ? lumenToNitsSpot(luxToLumen(intensity, 1, coneAngle * 2), radius / 100, coneAngle * 2)
          : hit.type[0] === "point" && hit.unit[0] === "lm" || hit.unit[0] === "W" ? lumenToNitsPoint(intensity, radius / 100)
          : hit.type[0] === "cylinder" && hit.unit[0] === "lm" ? lumenToNitsCylinder(intensity, radius / 100, length / 100)
          : hit.type[0] === "dome" ? 1
          : null;
        // console.log(name + " " + roundLargeNumbers(convertedIntensity, 10));
      return (
        '        "' + variantName + '" {\n' +
        '            over "' + name + '"\n' +
        '            {\n'+
        color +
        colorTemperature +
        '                bool inputs:enableColorTemperature = ' + enableColorTemperature +'\n' +
        '                float inputs:intensity = ' + roundLargeNumbers(convertedIntensity, 10) +'\n' +
        (width ? '                float inputs:width = ' + width + '\n' : "") +
        (height ? '                float inputs:height = ' + height + '\n' : "") +
        (length ? '                float inputs:length = ' + length + '\n' : "") +
        (radius !== 1.00001 ? '                float inputs:radius = ' + radius + '\n' : "") +
        treatAsPoint +
        (coneAngle ? '                float inputs:shaping:cone:angle = ' + coneAngle + '\n' : "") +
        (coneAngle ? '                float inputs:shaping:cone:softness = 1' + '\n' : "") +
        (angle ? '                float inputs:angle = ' + angle + '\n' : "") +
        '            }\n'
      ) +
      '        }\n'}).join('') +
      '    }\n'+
      '}';
        
    usd =
      '#usda 1.0\n' +
      '(\n' +
      '    defaultPrim = "' + name +'"\n' +
      '    doc = "https://api.physicallybased.info"\n' +
      '    metersPerUnit = 0.01\n' +
      '    upAxis = "' + upAxis + '"\n' +
      ')\n' +
      '\n' +
      define +
      '\n' +
      variantSets;
   return  usd;
  }
      const folder = "./tmp/usd/lightsources/";
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      JSON.parse(data).forEach((element) => {
        const fileName =
          folder +
          element.name.replace(/ |-|:|\./g, "_").replace(/[\[\]()º]/g, "") +
          ".usda";
        fs.writeFile(fileName, makeUSD(element), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(`${fileName} created`);
            resolve();
          }
        });
      });
    });
  });
}

function zipFiles() {
  const zip = new AdmZip();
  zip.addLocalFolder(tempFolder);
  zip.writeZip(outputFile);
}

async function main() {
  try {
    await createCameras();
    // await createLightsources();
    // processJson("materials");
    // processJson("lightsources");
    // processJson("cameras");
    // zipFiles();
    // console.log("Created " + outputFile + " successfully");

    if (fs.existsSync(tempFolder)) {
      // fs.rmSync(tempFolder, { recursive: true, force: true });
      // console.log("Deleted " + tempFolder + " folder successfully");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

main();
