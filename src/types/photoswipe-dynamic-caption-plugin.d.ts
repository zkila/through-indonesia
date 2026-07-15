declare module "photoswipe-dynamic-caption-plugin" {
  import type PhotoSwipeLightbox from "photoswipe/lightbox";

  interface DynamicCaptionOptions {
    type?: "auto" | "below" | "aside";
    mobileLayoutBreakpoint?: number;
    horizontalEdgeThreshold?: number;
    verticalEdgeThreshold?: number;
  }

  export default class PhotoSwipeDynamicCaption {
    constructor(
      lightbox: PhotoSwipeLightbox,
      options?: DynamicCaptionOptions
    );
  }
}