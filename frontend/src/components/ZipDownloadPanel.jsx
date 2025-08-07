import { useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { downloadMediaAsZip } from '../services/mediaService';
import { toast } from 'react-hot-toast';

export default function ZipDownloadPanel({ selectedImages, onClose }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (selectedImages.length === 0) {
      toast.error('No images selected');
      return;
    }

    try {
      setDownloading(true);
      const response = await downloadMediaAsZip(selectedImages);
      
      // Create blob from response and download
      const blob = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `media-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Download started');
      onClose();
    } catch (error) {
      toast.error('Error downloading files');
      console.error('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4">
        <span className="text-gray-600">
          {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
        </span>
        <button
          onClick={handleDownload}
          disabled={downloading || selectedImages.length === 0}
          className={`flex items-center px-4 py-2 rounded-md text-white ${
            downloading || selectedImages.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <FiDownload className="w-5 h-5 mr-2" />
          {downloading ? 'Downloading...' : 'Download ZIP'}
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
