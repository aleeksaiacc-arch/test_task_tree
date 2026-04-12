const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

type ImageOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "thumb" | "fit" | "scale";
  gravity?: "face" | "center" | "auto";
  quality?: "auto" | number;
};

/**
 * Builds an optimized Cloudinary image URL.
 *
 * If `photoUrl` is already a full URL (starts with "http"), it is returned as-is.
 * Otherwise it is treated as a Cloudinary public ID and a delivery URL is built
 * with the requested transformations.
 */
export function cloudinaryUrl(
  photoUrl: string,
  options: ImageOptions = {},
): string {
  if (!photoUrl) return "";
  if (photoUrl.startsWith("http")) return photoUrl;

  const { width, height, crop = "fill", gravity = "face", quality = "auto" } = options;

  const parts: string[] = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (width || height) {
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
  }
  parts.push(`q_${quality}`);
  parts.push("f_auto");

  const transform = parts.join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${photoUrl}`;
}
