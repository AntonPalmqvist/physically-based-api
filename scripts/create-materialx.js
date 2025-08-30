const fs = require("node:fs");
const AdmZip = require("adm-zip");

const materialxVersion = "1.39";
const outputFile = "MaterialX-v" + materialxVersion + "_OpenPBR.zip";
const tempFolder = "./tmp/";

function createFiles() {
  return new Promise((resolve, reject) => {
    fs.readFile("./deploy/v2/materials.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      // prettier-ignore
      function makeMaterialX(
    hit
  ) {
    const baseColor = JSON.stringify(hit.color[0].color) !== JSON.stringify([0.8, 0.8, 0.8]) && !hit.transmission && !hit.subsurfaceRadius ? '    <input name="base_color" type="color3" value="'+ hit.color[0].color[0].toFixed(3)+', '+ hit.color[0].color[1].toFixed(3)+', '+ hit.color[0].color[2].toFixed(3) +'" />\n' : "";
    const metalness = hit.metalness > 0 ? '    <input name="base_metalness" type="float" value="'+ hit.metalness.toFixed(1) +'" />\n' : "";
    const specularColor = hit.specularColor ? '    <input name="specular_color" type="color3" value="'+ hit.specularColor[0].color[0].color[0]+', '+ hit.specularColor[0].color[0].color[1]+', '+ hit.specularColor[0].color[0].color[2] +'" />\n' : "";
    const roughness = hit.roughness != 0.3 ? '    <input name="specular_roughness" type="float" value="'+ hit.roughness.toFixed(1) +'" />\n' : "";
    const specularIor = hit.ior && hit.metalness < 1 && hit.ior != 1.5 ? '    <input name="specular_ior" type="float" value="'+ hit.ior.toFixed(2) +'" />\n' : "";
    const transmission = hit.transmission ? '    <input name="transmission_weight" type="float" value="'+ hit.transmission.toFixed(1) +'" />\n' : "";
    const transmissionColor = hit.transmission && JSON.stringify(hit.color[0].color) !== JSON.stringify([1, 1, 1]) ? '    <input name="transmission_color" type="color3" value="'+ hit.color[0].color[0].toFixed(3)+', '+ hit.color[0].color[1].toFixed(3)+', '+ hit.color[0].color[2].toFixed(3) +'" />\n' : "";
    const transmissionDispersion = hit.transmissionDispersion ? '    <input name="transmission_dispersion_scale" type="float" value="1.0" />\n' : "";
    const transmissionDispersionAbbeNumber = hit.transmissionDispersion ? '    <input name="transmission_dispersion_abbe_number" type="float" value="'+ hit.transmissionDispersion +'" />\n' : "";
    const subsurface = hit.subsurfaceRadius ? '    <input name="subsurface_weight" type="float" value="1.0" />\n' : "";  
    const subsurfaceColor = hit.subsurfaceRadius ? '    <input name="subsurface_color" type="color3" value="'+ hit.color[0].color[0].toFixed(3)+', '+ hit.color[0].color[1].toFixed(3)+', '+ hit.color[0].color[2].toFixed(3) +'" />\n' : "";
    const subsurfaceRadiusScale = hit.subsurfaceRadius ? '    <input name="subsurface_radius_scale" type="color3" value="'+ hit.subsurfaceRadius[0]+', '+ hit.subsurfaceRadius[1]+', '+ hit.subsurfaceRadius[2] +'" />\n' : "";
    const thinFilmWeight = hit.thinFilmThickness ? '    <input name="thin_film_weight" type="float" value="1.0" />\n' : "";
    const thinFilmThickness = hit.thinFilmThickness && hit.thinFilmThickness[2] ? '    <input name="thin_film_thickness" type="float" value="'+ hit.thinFilmThickness[2]/1000 +'" />\n' : hit.thinFilmThickness && hit.thinFilmThickness[0] ? '    <input name="thin_film_thickness" type="float" value="'+ hit.thinFilmThickness[0]/1000 +'" />\n' : "";  
    const thinFilmIor = hit.thinFilmIor ? '    <input name="thin_film_ior" type="float" value="'+ hit.thinFilmIor.toFixed(2) +'" />\n' : "";
    const thinWalled = hit.thinFilmThickness && hit.transmission ? '    <input name="geometry_thin_walled" type="boolean" value="true" />\n' : "";
    let xml =
        // Commented lines are values that are not used and therefore removed to follow best practices for MaterialX "preset" functionality https://academysoftwarefdn.slack.com/archives/C0230LWBE2X/p1660682953141679?thread_ts=1660168970.997769&cid=C0230LWBE2X
        '<?xml version="1.0"?>\n' +
        '<materialx version="'+ materialxVersion +'" colorspace="lin_rec709">\n' +
        '  <surfacematerial name="'+ hit.name.replace(/ |-|\./g, "_").replace(/[()]/g, "") +'" type="material">\n' +
        '    <input name="surfaceshader" type="surfaceshader" nodename="open_pbr_surface_surfaceshader" />\n' +
        '  </surfacematerial>\n' +
        '  <open_pbr_surface name="open_pbr_surface_surfaceshader" type="surfaceshader">\n' +
        baseColor +
        //'    <input name="base_diffuse_roughness" type="float" value="0.0" />\n' +
        metalness +
        //'    <input name="specular_weight" type="float" value="1" />\n' +
        specularColor +
        roughness +
        specularIor +
        // '    <input name="specular_roughness_anisotropy" type="float" value="0" />\n' +
        transmission +
        transmissionColor +
        //'    <input name="transmission_depth" type="float" value="0.0" />\n' +
        //'    <input name="transmission_scatter" type="color3" value="0, 0, 0" />\n' +
        //'    <input name="transmission_scatter_anisotropy" type="float" value="0" />\n' +
        transmissionDispersion +
        transmissionDispersionAbbeNumber +
        subsurface +
        subsurfaceColor +
        //'    <input name="subsurface_radius" type="float" value="1.0" />\n' +
        subsurfaceRadiusScale +
        //'    <input name="subsurface_scatter_anisotropy" type="float" value="0.0" />\n' +
        //'    <input name="coat_color" type="color3" value="1, 1, 1" />\n' +
        //'    <input name="coat_roughness_anisotropy" type="float" value="0.0" />\n' +
        //'    <input name="coat_ior" type="float" value="1.6" />\n' +
        //'    <input name="coat_darkening" type="float" value="1.0" />\n' +
        thinFilmWeight +
        thinFilmThickness +
        thinFilmIor +
        //'    <input name="geometry_opacity" type="float" value="1" />\n' +
        thinWalled +
        '  </open_pbr_surface>\n' +
        '</materialx>';

    return xml;
  }

      JSON.parse(data).forEach((element) => {
        if (!fs.existsSync(tempFolder)) {
          fs.mkdirSync(tempFolder, { recursive: true });
        }
        const fileName =
          tempFolder +
          element.name.replace(/ |-|\./g, "_").replace(/[()]/g, "") +
          ".mtlx";
        fs.writeFile(fileName, makeMaterialX(element), (err) => {
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
