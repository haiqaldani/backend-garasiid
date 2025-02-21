const fs = require('fs').promises;
const path = require('path');
const Image = require('../../models/Image');

const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Image.findById(id);
        
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        try {
            const filePath = path.join(__dirname, '../../public', image.path);
            await fs.unlink(filePath);
        } catch (unlinkError) {
            console.error('Error deleting physical file:', unlinkError);
        }

        await Image.delete(id);

        return res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: {
                id: image.id,
                title: image.title,
                path: image.path
            }
        });

    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting image',
            error: error.message
        });
    }
};

module.exports = deleteImage; 