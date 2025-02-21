const Image = require('../../models/Image');

const getImages = async (req, res) => {
    try {
        const images = await Image.findAll();

        const formattedImages = images.map(image => ({
            id: image.id,
            title: image.title,
            image: `${req.protocol}://${req.get('host')}${image.path}`,
            createdAt: image.created_at
        }));

        return res.status(200).json({
            success: true,
            count: images.length,
            data: formattedImages
        });

    } catch (error) {
        console.error('Error fetching images:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching images',
            error: error.message
        });
    }
};

module.exports = getImages; 