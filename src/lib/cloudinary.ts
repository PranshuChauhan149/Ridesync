import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadOnCloudinary = async (
  file: Blob,
): Promise<string | null> => {
  if (!file) return null;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || null);
        },
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
