import { useEffect, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

import { responsiveImage } from "../lib/transformedImage";

interface GalleryImage {
  url: string;
  filename: string;
  width: number;
  height: number;
}

interface GalleryProps {
  images: GalleryImage[];
  masonry?: boolean;
}

export default function Gallery({ images, masonry = false }: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!galleryRef.current) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    return () => lightbox.destroy();
  }, []);

  return (
    <div
      ref={galleryRef}
      className={
        masonry
          ? "columns-2 md:columns-3 gap-2"
          : "grid grid-cols-2 md:grid-cols-3 gap-1"
      }
    >
      {images.map((img) => {
        const thumb = responsiveImage(img.url, [400, 600, 900]);
        const large = responsiveImage(img.url, [1600, 2000]);

        return (
          <a
            key={img.filename}
            href={large.src}
            data-pswp-width={img.width}
            data-pswp-height={img.height}
            className={masonry ? "mb-2 block break-inside-avoid" : ""}
          >
            <img
              src={thumb.src}
              srcSet={thumb.srcset}
              sizes="(max-width:768px) 50vw,33vw"
              alt={img.filename}
              loading="lazy"
              className={
                masonry
                  ? "w-full h-auto  transition-transform"
                  : "aspect-square w-full object-cover transition-transform"
              }
            />
          </a>
        );
      })}
    </div>
  );
}
