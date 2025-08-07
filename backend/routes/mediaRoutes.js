import express from 'express';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import {
  uploadMedia,
  getOwnMedia,
  getSharedMedia,
  updateMedia,
  deleteMedia,
  downloadMediaAsZip
} from '../controllers/mediaController.js';

const router = express.Router();

// Get own media files
router.get('/my', protect, getOwnMedia);

// Get shared media files
router.get('/shared', protect, getSharedMedia);

// Upload media files
router.post('/', protect, upload.array('files', 10), uploadMedia);

// Update media metadata
router.put('/:id', protect, updateMedia);

// Delete media
router.delete('/:id', protect, deleteMedia);

// Download selected media as ZIP
router.post('/download-zip', protect, downloadMediaAsZip);

export default router;
