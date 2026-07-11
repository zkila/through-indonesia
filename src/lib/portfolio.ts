const R2_BASE = import.meta.env.PUBLIC_R2_URL;

import manifestJson from "../data/portfolio-manifest.json";

const manifest = manifestJson as Record<
  string,
  {
    width: number;
    height: number;
  }
>;

// console.log(import.meta.env.PUBLIC_R2_URL);

export interface GalleryImage {
  url: string;
  filename: string;
  width: number;
  height: number;
}


export interface Portfolio {
  slug: string;
  title: string;
  images: GalleryImage[];
}

export function createGalleryImages(
  folder: string,
  files: string[]
): GalleryImage[] {
  return files.map((file) => {
    const dimensions = manifest[`${folder}/${file}`];

    return {
      url: `${R2_BASE}/assets/portfolio/${folder}/${file}`,
      filename: file.replace(/\.[^/.]+$/, ""),
      width: dimensions.width,
      height: dimensions.height,
    };
  });
}

const portfolios: Record<string, Omit<Portfolio, "slug">> = {

  bali: {
    title: "Bali",

    images: createGalleryImages("bali", [
  "bali1.jpg",
  "bali2.jpg",
  "bali3.jpg",
  "bali4.jpg",
  "bali5.jpg",
])
  },
  java:{
    title: "Java",
    images: createGalleryImages("java", [
      "ijen1.jpg",
      "ijen2.jpg",
      "kuda1.jpg",
      "kuda2.jpg",
      "pantai1.jpg",
      "semeru1.jpg",
      "semeru2.jpg",
      "semeru3.jpg",
      "trawas1.jpg",])
  },
  borneo: {
    title: "Borneo",
    images: createGalleryImages("borneo", [
      "simpanse1.jpg",
      "orangutan1.jpg",
      "orangutan2.jpg",
      "orangutan3.jpg",
      "buaya1.jpg",])
    },
    buton: {
      title: "Buton",
      images: createGalleryImages("buton",[
        "buton6.jpg",
        "buton1.jpg",
        "buton2.jpg",
        "buton3.jpg",
        "buton4.jpg",
        "buton5.jpg",
        "buton7.jpg"
      ])
    },
    lombok:{
      title:"Lombok",
      images:createGalleryImages("lombok",[
        "lombok1.jpg",
        "lombok2.jpg",
        "lombok3.jpg",
        "lombok4.jpg",
        "lombok5.jpg",
        "lombok6.jpg",
        "lombok7.jpg",
      ])
    },
    sumba:{
      title: "Sumba",
      images:createGalleryImages("sumba",[
        "sumba1.jpg",
        "sumba2.jpg",
        "sumba3.jpg",
        "sumba4.jpg",
      ])
    }

};



export function getPortfolio(
  slug: string
): Portfolio | null {

  const item = portfolios[slug];

  if (!item) return null;

  return {
    slug,
    title: item.title,
    images: item.images,
  };
}


export function getAllPortfolios() {
  return Object.entries(portfolios).map(
    ([slug, data]) => ({
      slug,
      title: data.title,
      thumbnail: data.images[0],
    })
  );
}