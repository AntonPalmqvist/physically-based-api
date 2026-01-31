# Contributing to Physically Based

Contributions of all kinds are welcome, such as pull requests and issues!

If you have any questions or need guidance in addition to the guidelines outlined in this document, feel free to use the contact form at: [https://physicallybased.info/about/](https://physicallybased.info/about/)

## Developer Setup

The API consists of 3 JSON files:

- [materials.json](deploy/v2/materials.json)

- [lightsources.json](deploy/v2/lightsources.json)

- [cameras.json](deploy/v2/cameras.json)

With corresponding schemas:

- [Material.json](schemas/components/schemas/Material.json)

- [Lightsource.json](schemas/components/schemas/Lightsource.json)

- [Camera.json](schemas/components/schemas/Camera.json)

### Schemas

If you're using Visual Studio Code, the json schemas will work automatically.

### Installation

If you want to contribute to something other than the database files, make sure you have Node.js installed and then run ```npm install``` to get the development environment set up.

### Formatting and linting

This project uses [Biome](https://biomejs.dev/) for both formatting and linting.
