import { useState, useEffect } from 'react';
import { getMediaFiles, deleteMedia } from '../services/mediaService';
import { toast } from 'react-hot-toast';

export default function MediaGallery() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTags, setSelectedTags] = useState('');

  const fetchMedia = async () => {
    try {
      const data = await getMediaFiles(page, 12, selectedTags);
      setMediaFiles(data.mediaFiles);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Error fetching media files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [page, selectedTags]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return;
    }

    try {
      await deleteMedia(id);
      toast.success('Media deleted successfully');
      fetchMedia(); // Refresh the gallery
    } catch (error) {
      toast.error('Error deleting media');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tags filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by tags (comma-separated)"
          value={selectedTags}
          onChange={(e) => setSelectedTags(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Media grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaFiles.map((media) => (
          <div
            key={media._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-w-16 aspect-h-9">
              <img
                src={media.fileUrl}
                alt={media.title}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => handleDelete(media._id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{media.title}</h3>
              {media.description && (
                <p className="text-gray-600 text-sm mb-2">{media.description}</p>
              )}
              {media.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {media.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Uploaded by: {media.uploadedBy.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
