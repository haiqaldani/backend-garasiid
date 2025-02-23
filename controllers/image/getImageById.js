const Image = require('../../models/Image');

const getImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Image.findById(id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        const formattedImage = {
            id: image.id,
            title: image.title,
            image: `${req.protocol}://${req.get('host')}${image.path}`,
            createdAt: image.created_at
        };

        return res.status(200).json({
            success: true,
            data: formattedImage
        });

    } catch (error) {
        console.error('Error fetching image:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching image',
            error: error.message
        });
    }
};

module.exports = getImageById; 