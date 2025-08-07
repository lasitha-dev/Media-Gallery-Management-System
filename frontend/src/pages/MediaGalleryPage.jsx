import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiList } from 'react-icons/fi';
import Select from 'react-select';
import Masonry from 'react-masonry-css';
import { toast } from 'react-hot-toast';
import { getOwnMedia, getSharedMedia, deleteMedia, updateMedia } from '../services/mediaService';
import ImageCard from '../components/ImageCard';
import ImageSlider from '../components/ImageSlider';
import ZipDownloadPanel from '../components/ZipDownloadPanel';

export default function MediaGalleryPage() {
  const [view, setView] = useState('grid');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [showZipPanel, setShowZipPanel] = useState(false);
  const [filters, setFilters] = useState({
    type: 'own', // 'own' or 'shared'
    tags: [],
    search: '',
    page: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedia();
  }, [filters]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const fetchFn = filters.type === 'own' ? getOwnMedia : getSharedMedia;
      const response = await fetchFn(
        filters.page,
        12,
        filters.tags.map(t => t.value).join(',')
      );
      setMedia(response.mediaFiles);
    } catch (error) {
      toast.error('Error fetching media files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteMedia(id);
      toast.success('Image deleted successfully');
      fetchMedia();
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  const handleShare = async (id) => {
    try {
      const image = media.find(img => img._id === id);
      await updateMedia(id, { shared: !image.shared });
      toast.success(image.shared ? 'Image unshared' : 'Image shared');
      fetchMedia();
    } catch (error) {
      toast.error('Error updating share status');
    }
  };

  const handleImageSelect = (id, selected) => {
    setSelectedImages(prev => {
      if (selected) {
        return [...prev, id];
      }
      return prev.filter(imageId => imageId !== id);
    });
    setShowZipPanel(true);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Select
          value={{ value: filters.type, label: filters.type === 'own' ? 'My Media' : 'Shared Media' }}
          onChange={(option) => setFilters(prev => ({ ...prev, type: option.value, page: 1 }))}
          options={[
            { value: 'own', label: 'My Media' },
            { value: 'shared', label: 'Shared Media' }
          ]}
          className="w-48"
        />

        <Select
          isMulti
          value={filters.tags}
          onChange={(tags) => setFilters(prev => ({ ...prev, tags, page: 1 }))}
          options={Array.from(new Set(media.flatMap(m => m.tags))).map(tag => ({
            value: tag,
            label: tag
          }))}
          placeholder="Filter by tags..."
          className="w-64"
        />

        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />

        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${
              view === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${
              view === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gallery */}
      <Masonry
        breakpointCols={view === 'grid' ? breakpointColumns : { default: 1 }}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {media.map((image) => (
          <div key={image._id} className="mb-4">
            <ImageCard
              image={image}
              onDelete={handleDelete}
              onSelect={handleImageSelect}
              isSelected={selectedImages.includes(image._id)}
              isOwner={filters.type === 'own'}
              onShare={handleShare}
              onDownload={() => setCurrentSlide(image)}
            />
          </div>
        ))}
      </Masonry>

      {/* Image Slider */}
      {currentSlide && (
        <ImageSlider
          images={media}
          initialIndex={media.findIndex(img => img._id === currentSlide._id)}
          onClose={() => setCurrentSlide(null)}
        />
      )}

      {/* ZIP Download Panel */}
      {showZipPanel && selectedImages.length > 0 && (
        <ZipDownloadPanel
          selectedImages={selectedImages}
          onClose={() => {
            setShowZipPanel(false);
            setSelectedImages([]);
          }}
        />
      )}
    </div>
  );
}
