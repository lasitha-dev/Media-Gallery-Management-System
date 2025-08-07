import cloudinary from '../utils/cloudinary.js';
import Media from '../models/Media.js';
import archiver from 'archiver';
import axios from 'axios';

export const uploadMedia = async (req, res) => {
  try {
    const files = req.files;
    const { title, description, tags } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Process each file
    const uploadPromises = files.map(async (file) => {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        folder: 'media_gallery'
      });

      // Create media document
      return Media.create({
        title: title || file.originalname,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        fileUrl: result.secure_url,
        publicId: result.public_id,
        uploadedBy: req.user._id,
        fileType: file.mimetype,
        fileSize: file.size,
        shared: false
      });
    });

    // Wait for all uploads to complete
    const mediaFiles = await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: mediaFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading files',
      error: error.message
    });
  }
};

export const getOwnMedia = async (req, res) => {
  try {
    const { page = 1, limit = 12, tags } = req.query;
    const query = { uploadedBy: req.user._id };

    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }

    const mediaFiles = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('uploadedBy', 'name email');

    const total = await Media.countDocuments(query);

    res.status(200).json({
      mediaFiles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching media files',
      error: error.message
    });
  }
};

export const getSharedMedia = async (req, res) => {
  try {
    const { page = 1, limit = 12, tags } = req.query;
    const query = { shared: true };

    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }

    const mediaFiles = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('uploadedBy', 'name email');

    const total = await Media.countDocuments(query);

    res.status(200).json({
      mediaFiles,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching shared media files',
      error: error.message
    });
  }
};

export const updateMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, shared } = req.body;
    
    const media = await Media.findById(id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Check if user is authorized to update
    if (media.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this media' });
    }

    // Update fields
    media.title = title || media.title;
    media.description = description || media.description;
    if (tags) {
      media.tags = tags.split(',').map(tag => tag.trim());
    }
    if (typeof shared === 'boolean') {
      media.shared = shared;
    }

    await media.save();

    res.status(200).json({
      message: 'Media updated successfully',
      media
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating media',
      error: error.message
    });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Check if user is authorized to delete
    if (media.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this media' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    // Delete from database
    await media.deleteOne();

    res.status(200).json({ message: 'Media deleted successfully' });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting media',
      error: error.message
    });
  }
};

export const downloadMediaAsZip = async (req, res) => {
  try {
    const { mediaIds } = req.body;

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      return res.status(400).json({ message: 'No media files selected for download' });
    }

    // Find all media files
    const mediaFiles = await Media.find({
      _id: { $in: mediaIds },
      $or: [
        { uploadedBy: req.user._id }, // User's own files
        { shared: true } // Shared files
      ]
    });

    if (mediaFiles.length === 0) {
      return res.status(404).json({ message: 'No accessible media files found' });
    }

    // Set up ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=media-${Date.now()}.zip`);

    const archive = archiver('zip', {
      zlib: { level: 5 }
    });

    // Pipe archive data to the response
    archive.pipe(res);

    // Add files to ZIP
    for (const media of mediaFiles) {
      try {
        const response = await axios({
          method: 'get',
          url: media.fileUrl,
          responseType: 'stream'
        });

        archive.append(response.data, { 
          name: `${media.title}${getFileExtension(media.fileType)}` 
        });
      } catch (error) {
        console.error(`Error downloading file ${media._id}:`, error);
        // Continue with other files even if one fails
      }
    }

    await archive.finalize();

  } catch (error) {
    console.error('Download ZIP error:', error);
    res.status(500).json({
      message: 'Error creating ZIP file',
      error: error.message
    });
  }
};

// Helper function to get file extension
function getFileExtension(mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return '';
  }
}
