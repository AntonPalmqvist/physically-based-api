const fs = require("node:fs");
const AdmZip = require("adm-zip");

const usdVersion = "1.0";
const outputFile = "USD-v" + usdVersion + ".zip";
const tempFolder = "./tmp/";

function createFiles() {
  return new Promise((resolve, reject) => {
    fs.readFile("./deploy/v2/cameras.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      // prettier-ignore
      function makeUSD(
    hit, i = 0, type="camera", engine
  ) {
    let usd = "";
    let upAxis = engine == "unreal" || engine == "blender" ? "Z" : "Y";
    switch (type) {
    case "camera": { // Curly braces are here so we can scope the "name" variable to only this case
      let name = hit.name.replace(/ |-|\./g, "_").replace(/[()]/g, "") + "_" + hit.sensorSize[i].format.replace(/ |-|\./g, "_");
      usd =
        '#usda 1.0\n' +
        '(\n' +
        '    defaultPrim = "' + name +'"\n' +
        '    doc = "https://physicallybased.info"\n' +
        '    metersPerUnit = 0.01\n' +
        '    upAxis = "' + upAxis + '"\n' +
        ')\n' +
        '\n' +
        'def Camera "'+ name + '"\n' +
        '{\n' +
        '    float2 clippingRange = (0.1, 1000)\n' +
        '    float focalLength = 50\n' +
        '    token projection = "perspective"\n' +
        '    float horizontalAperture = '+ hit.sensorSize[i].size[0].toFixed(2)+'\n' +
        '    float horizontalApertureOffset = 0\n' +
        '    float verticalAperture = '+ hit.sensorSize[i].size[1].toFixed(2)+'\n' +
        '    float verticalApertureOffset = 0\n' +
        '}';
      break;
    }
    case "light": { // Curly braces are here so we can scope the "name" variable to only this case
      let name = hit.variants ? hit.name.replace(/ |-|\./g, "_").replace(/[()]/g, "") + "_" + hit.variants[i].format.replace(/ |-|\./g, "_").replace(/[()]/g, "") : hit.name.replace(/ |-|\./g, "_").replace(/[()]/g, "");
      let type = hit.type == "surface" ? "RectLight" : hit.type == "directional" ? "DistantLight" : hit.type == "dome" ? "DomeLight" : hit.type == "cylinder" ? "CylinderLight" : "SphereLight";
      let apiSchemas = hit.type == "spot" ?
        'def ' + type + ' "'+ name +'" (\n' +
        '    prepend apiSchemas = ["ShapingAPI"]\n' +
        ')\n'
        :
        'def ' + type + ' "'+ name +'"\n';
      let colorTemperature =
          hit.variants && hit.variants[i] && hit.variants[i].temperature ? '    float inputs:colorTemperature = ' + hit.variants[i].temperature + '\n'
        : hit.temperature && hit.temperature[2] ? '    float inputs:colorTemperature = ' + hit.temperature[2] + '\n'
        : hit.temperature && hit.temperature[0] ? '    float inputs:colorTemperature = ' + hit.temperature[0] + '\n'
        : "";
      let enableColorTemperature = colorTemperature !== "" && (engine == "unreal" || engine == "blender") ? 1 : 0;
      let color =
          hit.variants && enableColorTemperature === 0 ? '    color3f inputs:color = ('+ hit.variants[i].color[0].color[0].toFixed(3)+', '+ hit.variants[i].color[0].color[1].toFixed(3)+', '+ hit.variants[i].color[0].color[2].toFixed(3)+')\n'
        : enableColorTemperature === 0 ? '    color3f inputs:color = (' + hit.color[0].color[0].toFixed(3)+', '+ hit.color[0].color[1].toFixed(3)+', '+ hit.color[0].color[2].toFixed(3) +')\n' : '    color3f inputs:color = (1.0, 1.0, 1.0)\n';
      let intensity =
          hit.intensity && hit.intensity[2]
        ? hit.intensity[2]
        : hit.intensity && hit.intensity[1]
        ? hit.intensity[1]
        : hit.intensity && hit.intensity[0]
        ? hit.intensity[0]
        : hit.variants
        ? hit.variants[i].intensity
        : hit.intensity
        ? hit.intensity
        : null;
      // console.log(colorTemperature === "");
      let width = hit.variants && hit.variants[i] && hit.variants[i].sourceSize && hit.type == "surface" ? hit.variants[i].sourceSize[0] : hit.sourceSize && hit.type == "surface" ? hit.sourceSize[0] : null;
      let height = hit.variants && hit.variants[i] && hit.variants[i].sourceSize && hit.type == "surface" ? hit.variants[i].sourceSize[1] : hit.sourceSize && hit.type == "surface" ? hit.sourceSize[1] : null;
      let length = hit.variants && hit.variants[i] && hit.variants[i].sourceSize && hit.type == "cylinder" ? hit.variants[i].sourceSize[1] : hit.sourceSize && hit.type == "cylinder" ? hit.sourceSize[1] : null;
      let radius = hit.variants && hit.variants[i] && hit.variants[i].sourceSize && (hit.type == "point" || hit.type == "spot" || hit.type == "cylinder") ? hit.variants[i].sourceSize[0] : hit.sourceSize && (hit.type == "point" || hit.type == "spot" || hit.type == "cylinder") ? hit.sourceSize[0] : 1.00001; // 1.00001 is here to give a number as close as 1 for the conversion to work when no radius is provided, unusual enough to not be ignored if there's a light source with 1 cm radius. Further motivated by "we chose to automatically promote punctual lights to small area lights of 1 cm if the artists specify a luminance unit to control the intensity." on p39 in https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
      let treatAsPoint = hit.variants && hit.variants[i] && hit.variants[i].sourceSize > 0 && (hit.type == "point" || hit.type == "spot") ? '    bool treatAsPoint = ' + 0 + '\n' : hit.sourceSize && hit.sourceSize[0] > 0 && (hit.type == "point" || hit.type == "spot") ? '    bool treatAsPoint = ' + 0 + '\n' : "";
      let coneAngle = hit.variants && hit.variants[i] && hit.variants[i].angle && (hit.type == "spot") ? hit.variants[i].angle / 2 : hit.angle && (hit.type == "spot") ? hit.angle / 2 : null; // Divided by 2 because USD uses half-angle, θ, where the API uses beam angle
      let angle = hit.variants && hit.variants[i] && hit.variants[i].angle && hit.type == "directional" ? hit.variants[i].angle : hit.angle && hit.type == "directional" ? hit.angle : null;
      let convertedIntensity =
          hit.type == "directional" ? intensity
        : hit.type == "surface" && hit.unit == "cd/m2" ? intensity
        : hit.type == "surface" && hit.unit == "lm" ? lumenToNitsRect(intensity, width / 100, height / 100)
        : hit.type == "spot" && hit.unit == "lm" ? lumenToNitsSpot(intensity, radius / 100, coneAngle * 2)
        : hit.type == "spot" && hit.unit == "lx" ? lumenToNitsSpot(luxToLumen(intensity, 1, coneAngle * 2), radius / 100, coneAngle * 2)
        : hit.type == "point" && hit.unit == "lm" ? lumenToNitsPoint(intensity, radius / 100)
        : hit.type == "cylinder" && hit.unit == "lm" ? lumenToNitsCylinder(intensity, radius / 100, length / 100)
        : hit.type == "dome" ? 1
        : null;
      // console.log(radius);
      usd =
        '#usda 1.0\n' +
        '(\n' +
        '    defaultPrim = "' + name +'"\n' +
        '    doc = "https://physicallybased.info"\n' +
        '    metersPerUnit = 0.01\n' +
        '    upAxis = "' + upAxis + '"\n' +
        ')\n' +
        '\n' +
        apiSchemas +
        '{\n' +
        color +
        colorTemperature +
        '    bool inputs:enableColorTemperature = ' + enableColorTemperature +'\n' +
        '    float inputs:intensity = ' + convertedIntensity +'\n' +
        (width ? '    float inputs:width = ' + width + '\n' : "") +
        (height ? '    float inputs:height = ' + height + '\n' : "") +
        (length ? '    float inputs:length = ' + length + '\n' : "") +
        (radius != 1.00001 ? '    float inputs:radius = ' + radius + '\n' : "") +
        treatAsPoint +
        (coneAngle ? '    float inputs:shaping:cone:angle = ' + coneAngle + '\n' : "") +
        (coneAngle ? '    float inputs:shaping:cone:softness = 1' + '\n' : "") +
        (angle ? '    float inputs:angle = ' + angle + '\n' : "") +
        '}';
      // console.log(usd);
      break;
    }
  }
    return usd;
  }

      JSON.parse(data).forEach((element) => {
        if (!fs.existsSync(tempFolder)) {
          fs.mkdirSync(tempFolder, { recursive: true });
        }
        const fileName =
          tempFolder +
          element.name.replace(/ |-|\./g, "_").replace(/[()]/g, "") +
          ".usda";
        fs.writeFile(fileName, makeUSD(element), (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            console.log(fileName + " created");
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
    await createFiles();
    zipFiles();
    console.log("Created " + outputFile + " successfully");

    if (fs.existsSync(tempFolder)) {
      fs.rmSync(tempFolder, { recursive: true, force: true });
      console.log("Deleted " + tempFolder + " folder successfully");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

main();
