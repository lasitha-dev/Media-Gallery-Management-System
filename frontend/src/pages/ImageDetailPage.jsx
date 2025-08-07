import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSave, FiTrash2, FiShare2 } from 'react-icons/fi';
import { updateMedia, deleteMedia } from '../services/mediaService';

export default function ImageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    shared: false
  });

  useEffect(() => {
    fetchImageDetails();
  }, [id]);

  const fetchImageDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/media/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        setImage(data);
        setFormData({
          title: data.title,
          description: data.description || '',
          tags: data.tags.join(', '),
          shared: data.shared
        });
      } else {
        toast.error('Error fetching image details');
        navigate('/media');
      }
    } catch (error) {
      toast.error('Error fetching image details');
      navigate('/media');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateMedia(id, {
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        shared: formData.shared
      });
      
      toast.success('Image updated successfully');
      navigate('/media');
    } catch (error) {
      toast.error('Error updating image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteMedia(id);
      toast.success('Image deleted successfully');
      navigate('/media');
    } catch (error) {
      toast.error('Error deleting image');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!image) {
    return <div>Image not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <img
                src={image.fileUrl}
                alt={image.title}
                className="object-contain w-full h-full"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="shared"
                  id="shared"
                  checked={formData.shared}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="shared" className="ml-2 block text-sm text-gray-900">
                  Share this image publicly
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5 mr-2" />
                  Delete
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex items-center px-6 py-2 rounded-md text-white ${
                    saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <FiSave className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
