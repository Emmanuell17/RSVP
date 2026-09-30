function trimEnv(name) {
  let raw = (process.env[name] || "").trim();
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  return raw.replace(/\/+$/, "");
}

export function galleryBaseUrl() {
  return trimEnv("REACT_APP_GALLERY_BASE_URL");
}

export function galleryManifestUrl() {
  const explicit = trimEnv("REACT_APP_GALLERY_MANIFEST_URL");
  if (explicit) return explicit;
  return "/gallery-manifest.json";
}

export function encodeGalleryPath(file) {
  return String(file)
    .replace(/^\/+/, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

export function galleryAssetUrl(file, base = galleryBaseUrl()) {
  const name = String(file || "").trim();
  if (!name) return "";
  if (/^https?:\/\//i.test(name)) return name;
  if (name.startsWith("/")) return name;
  const root = (base || "").replace(/\/+$/, "");
  const path = encodeGalleryPath(name);
  return root ? `${root}/${path}` : `/${path}`;
}

function asFileList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.files)) return data.files;
  if (Array.isArray(data?.photos)) return data.photos;
  return [];
}

export function photosFromManifest(data, base = galleryBaseUrl()) {
  return asFileList(data)
    .map((item) => {
      if (typeof item === "string") {
        const src = galleryAssetUrl(item, base);
        return src ? { src, thumb: src, alt: "Photo from the celebration" } : null;
      }
      if (item && typeof item === "object") {
        const src = galleryAssetUrl(item.src || item.file || item.url || "", base);
        if (!src) return null;
        const thumb = galleryAssetUrl(
          item.thumb || item.src || item.file || item.url || "",
          base
        );
        return {
          src,
          thumb: thumb || src,
          alt: item.alt || "Photo from the celebration",
        };
      }
      return null;
    })
    .filter(Boolean);
}

export const LOCAL_GALLERY_PHOTOS = Array.from({ length: 24 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const src = `/images/gallery/photo-${n}.jpg`;
  return { src, thumb: src, alt: "Photo from the celebration" };
});
