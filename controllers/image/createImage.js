const fs = require('fs').promises;
const path = require('path');
const Image = require('../../models/Image');

const createImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide image files" 
            });
        }

        const imageDetails = [];
        const uploadDir = path.join(__dirname, '../../public/images');
        await fs.mkdir(uploadDir, { recursive: true });

        for (let i = 0; i < req.files.length; i++) {
            const uploadedFile = req.files[i];
            const title = req.body.titles?.[i];

            try {
                Image.validateFile(uploadedFile);
                Image.validateTitle(title);

                const uniqueFilename = `${Date.now()}-${uploadedFile.originalname}`;
                const finalPath = path.join(uploadDir, uniqueFilename);

                await fs.rename(uploadedFile.path, finalPath);

                const imageId = await Image.create({
                    title: title.trim(),
                    filename: uniqueFilename,
                    path: `/images/${uniqueFilename}`,
                    originalName: uploadedFile.originalname,
                    size: uploadedFile.size,
                    mimetype: uploadedFile.mimetype
                });

                imageDetails.push({
                    id: imageId,
                    title: title.trim(),
                    image: `${req.protocol}://${req.get('host')}/images/${uniqueFilename}`
                });
            } catch (validationError) {
                await fs.unlink(uploadedFile.path);
                return res.status(400).json({
                    success: false,
                    message: validationError.message
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Images uploaded successfully',
            data: imageDetails
        });

    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                try {
                    await fs.unlink(file.path);
                } catch (unlinkError) {
                    console.error('Error deleting file:', unlinkError);
                }
            }
        }

        console.error('Error uploading images:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to upload images',
            error: error.message
        });
    }
};

module.exports = createImage; 