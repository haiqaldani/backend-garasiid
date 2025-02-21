const pool = require('../config/db');

class Image {
    // Validate file before upload
    static validateFile(file) {
        if (!file) {
            throw new Error('File is required');
        }

        if (!file.mimetype.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size cannot exceed 5MB');
        }

        return true;
    }

    // Validate title
    static validateTitle(title) {
        if (!title || title.trim().length < 2) {
            throw new Error('Title must be at least 2 characters long');
        }

        if (title.trim().length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }

        return true;
    }

    // Create new image
    static async create(imageData) {
        const sql = `
            INSERT INTO images (title, filename, path, original_name, size, mimetype)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [
            imageData.title,
            imageData.filename,
            imageData.path,
            imageData.originalName,
            imageData.size,
            imageData.mimetype
        ]);
        return result.insertId;
    }

    // Find image by ID
    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM images WHERE id = ?', [id]);
        return rows[0];
    }

    // Find image by filename
    static async findByFilename(filename) {
        const [rows] = await pool.execute('SELECT * FROM images WHERE filename = ?', [filename]);
        return rows[0];
    }

    // Get all images
    static async findAll() {
        const [rows] = await pool.execute('SELECT * FROM images ORDER BY created_at DESC');
        return rows;
    }

    // Update image
    static async update(id, updateData) {
        const allowedUpdates = ['title'];
        const updates = [];
        const values = [];

        allowedUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(updateData[field]);
            }
        });

        if (updates.length === 0) return null;

        values.push(id);
        const sql = `UPDATE images SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await pool.execute(sql, values);
        return result.affectedRows > 0;
    }

    // Delete image
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM images WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Image; 