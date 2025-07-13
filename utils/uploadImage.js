const ImageKit = require("imagekit");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Uploads an image buffer to ImageKit cloud
 * @param {Buffer} fileBuffer - The image file buffer
 * @param {String} folder - Folder name under ImageKit (e.g., "profiles", "products")
 * @returns {Promise<String>} - URL of the uploaded image
 */
const uploadImageToCloud = async (fileBuffer, folder) => {
    try {
        const result = await imagekit.upload({
            file: fileBuffer,
            fileName: uuid(),
            folder: folder
        });
        return result.url;
    } catch (error) {
        throw new Error("Image upload failed: " + error.message);
    }
};

module.exports = { uploadImageToCloud };


