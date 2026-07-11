import fs from "node:fs";
import path from "node:path";
import { imageSizeFromFile } from 'image-size/fromFile'

async function generateManifest() {
  const ROOT = path.join(process.cwd(), "public/assets/portfolio");

  const manifest: Record<
    string,
    {
      width: number;
      height: number;
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
      };
    }
  }

  fs.writeFileSync(
    path.join(process.cwd(), "src/data/portfolio-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
}

generateManifest();