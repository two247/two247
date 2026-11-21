/**
 * =========================================================================
 * TWO247 — Cloudinary Media Configuration & Upload Helper
 * Handles direct, unsigned image/video uploads and CDN transformations
 * =========================================================================
 */

export const cloudinaryConfig = {
  cloudName: "n4bywdyq",
  uploadPreset: "two247",
  assetFolder: "travel/images",
  uploadUrl: "https://api.cloudinary.com/v1_1/n4bywdyq/auto/upload",
  imageUrl: "https://api.cloudinary.com/v1_1/n4bywdyq/image/upload",
  videoUrl: "https://api.cloudinary.com/v1_1/n4bywdyq/video/upload",
  deliveryBase: "https://res.cloudinary.com/n4bywdyq"
};

/**
 * Upload a media file directly to Cloudinary using the unsigned preset
 * @param {File|Blob|string} file - File object, Blob, or base64 data URL
 * @param {Function} [onProgress] - Optional upload progress callback (0-100)
 * @returns {Promise<Object>} Upload response with secure_url, public_id, width, height, format
 */
export async function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", cloudinaryConfig.assetFolder);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response"));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.open("POST", cloudinaryConfig.uploadUrl);
    xhr.send(formData);
  });
}

/**
 * Generate an optimized Cloudinary delivery URL with auto-format and auto-compression
 * @param {string} url - Original Cloudinary media URL
 * @param {Object} [options] - Transformation options (width, quality, crop)
 */
export function getOptimizedMediaUrl(url, { width = 1200, quality = "auto", crop = "limit" } = {}) {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.*)$/);
  if (!match) return url;
  const [, prefix, type, rest] = match;
  // If already transformed, return as is
  if (rest.startsWith("q_") || rest.startsWith("w_")) return url;
  return `${prefix}q_${quality},f_auto,w_${width},c_${crop}/${rest}`;
}

if (typeof window !== "undefined") {
  window.two247Cloudinary = { cloudinaryConfig, uploadToCloudinary, getOptimizedMediaUrl };
}
