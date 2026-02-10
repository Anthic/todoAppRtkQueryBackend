import { v2 as cloudinary } from "cloudinary";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  imageUrl: string;
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "todos",
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err) {
          reject(err);
        } else if (result?.secure_url && result?.public_id) {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            imageUrl: result.secure_url,
          });
        } else {
          reject(
            new Error(
              "Upload succeeded but required Cloudinary fields missing",
            ),
          );
        }
      },
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      console.error(`Failed to delete from Cloudinary: ${result.result}`);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    // Optionally re-throw if callers need to handle this
  }
};
export { cloudinary };
