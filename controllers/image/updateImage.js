const Image = require('../../models/Image');

const updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        try {
            Image.validateTitle(title);
        } catch (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError.message
            });
        }

        const success = await Image.update(id, { title: title.trim() });

        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        const updatedImage = await Image.findById(id);

        return res.status(200).json({
            success: true,
            message: 'Title updated successfully',
            data: {
                id: updatedImage.id,
                title: updatedImage.title,
                image: `${req.protocol}://${req.get('host')}${updatedImage.path}`
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating image title',
            error: error.message
        });
    }
};

module.exports = updateImage; 