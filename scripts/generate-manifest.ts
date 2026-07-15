// npx tsx scripts/generate-manifest.ts

import fs from "node:fs";
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";

const CAPTIONS = [
  "Golden light over the mountains at sunrise.",
  "A quiet moment in the heart of the rainforest.",
  "Traditional life unfolding along the river.",
  "Layers of mist drifting through the valley.",
  "Local fishermen returning before dawn.",
  "Ancient temple surrounded by tropical forest.",
  "Reflections shimmering across calm waters.",
  "Daily life captured in natural light.",
  "An unforgettable landscape shaped by time.",
  "Wildlife emerging from the dense jungle."
];

function randomCaption() {
  return CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];
}

async function generateManifest() {
  const ROOT = path.join(process.cwd(), "public/assets/portfolio");

  const manifest: Record<
    string,
    {
      width: number;
      height: number;
      caption: string;
    }
  > = {};

  for (const folder of fs.readdirSync(ROOT)) {
    const folderPath = path.join(ROOT, folder);

    if (!fs.statSync(folderPath).isDirectory()) continue;

    for (const file of fs.readdirSync(folderPath)) {
      const filepath = path.join(folderPath, file);

      const { width, height } = await imageSizeFromFile(filepath);

      manifest[`${folder}/${file}`] = {
        width: width!,
        height: height!,
        caption: randomCaption(),
      };
    }
  }

  fs.writeFileSync(
    path.join(process.cwd(), "src/data/portfolio-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
}

generateManifest();