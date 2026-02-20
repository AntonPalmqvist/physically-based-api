# Physically Based API

A database of physically based values for CG artists.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://physicallybased.info/images/meta/database-dark.webp">
    <img alt="Screenshot of the web implementation" src="https://physicallybased.info/images/meta/database.webp">
  </picture>
</p>

<p>
  <a href="https://github.com/AntonPalmqvist/physically-based-api?tab=CC0-1.0-1-ov-file">
    <img alt="GitHub License" src="https://img.shields.io/github/license/AntonPalmqvist/physically-based-api"/>
  </a>
  <a href="https://github.com/AntonPalmqvist/physically-based-api/releases">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/AntonPalmqvist/physically-based-api"/>
  </a>
  <a href="schemas/openapi-schema-v2.json">
    <img alt="Swagger Validation" src="https://img.shields.io/swagger/valid/3.0?specUrl=https%3A%2F%2Fraw.githubusercontent.com%2FAntonPalmqvist%2Fphysically-based-api%2Frefs%2Fheads%2Fmain%2Fschemas%2Fopenapi-schema-v2.json&label=openapi%203.1"/>
  </a>
  <a href="https://mastodon.gamedev.place/@apq">
    <img alt="Follow on Mastodon" src="https://img.shields.io/badge/%40apq-blue?logo=mastodon&logoColor=%23fff&color=%236364ff"/>
  </a>
  <a href="https://biomejs.dev/">
    <img alt="Code Style" src="https://img.shields.io/badge/code_style-biome-60a5fa?logo=biome"/>
  </a>
</p>

## Features

- Open Database: Access a curated collection of physically based material values
- Lightweight: The entire dataset is optimized for quick loading and integration as presets
  - [materials.json](deploy/v2/materials.json) `161 KB`
  - [lightsources.json](deploy/v2/lightsources.json) `25 KB`
  - [cameras.json](deploy/v2/cameras.json) `159 KB`
  - [lenses.json](deploy/v2/lenses.json) (coming in v2.1)
- API Access: Connect your tools to the API to get the latest updates from the database
- Community-Driven: Contribute new materials or improve existing ones
- Free License: All data is released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

## Getting Started

Access the API and documentation at [https://api.physicallybased.info/v2](https://api.physicallybased.info/v2)

### Implementations

Explore the database through these implementations:

- Blender [Photographer 5](https://chafouin.gumroad.com/l/photographer5) by [chafouin](https://mastodon.gamedev.place/@chafouin)
- Web [MaterialXLab](https://kwokcb.github.io/MaterialXLab/javascript/PhysicallyBasedMaterialX_out.html) by [kwokcb](https://github.com/kwokcb)
- Web [Physically Based](https://physicallybased.info) by [AntonPalmqvist](https://github.com/AntonPalmqvist)
- Web [Three.js GPU Path Tracer](https://gkjohnson.github.io/three-gpu-pathtracer/example/bundle/materialDatabase.html) by [gkjohnson](https://github.com/gkjohnson)

### Contribute

Contributions are welcome! Whether you want to add new entries, corrections, or suggestions, your help is appreciated. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### License

The database is made available under the [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/legalcode) license, which means you are free to use, modify, and distribute its content without any restrictions, even for commercial purposes.

Shader ball used for renders is from [ASWF USD WG](https://github.com/usd-wg/assets/tree/main/full_assets/StandardShaderBall) and is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)


<!-- ## Shader Ball

The shaderball scene used to render the images is available to download below.

<table>
<tr>
<td align="center">
<a href="#">
<img alt="Shader ball with gold material applied." src="https://raw.githubusercontent.com/AntonPalmqvist/physically-based-api/refs/heads/main/images/renders/cycles/300/gold.webp" /></a>
<p><a href="#">Blender</a></p>
</td>
<td align="center">
<a href="#">
<img alt="Shader ball with gold material applied." src="https://raw.githubusercontent.com/AntonPalmqvist/physically-based-api/refs/heads/main/images/renders/cycles/300/gold.webp" /></a>
<p><a href="#">Maya</a></p>
</td>
<td align="center">
<a href="#">
<img alt="Shader ball with gold material applied." src="https://raw.githubusercontent.com/AntonPalmqvist/physically-based-api/refs/heads/main/images/renders/cycles/300/gold.webp" /></a>
<p><a href="#">Unreal Engine</a></p>
</td>
</tr>
</table> -->
