import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiDownload, FiShare2 } from 'react-icons/fi';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function ImageCard({
  image,
  onDelete,
  onSelect,
  isSelected,
  isOwner,
  onShare,
  onDownload,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-md bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-16 aspect-h-9">
        <LazyLoadImage
          alt={image.title}
          src={image.fileUrl}
          effect="blur"
          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Overlay with actions */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-2 right-2 flex space-x-2">
          {isOwner && (
            <>
              <Link
                to={`/media/${image._id}`}
                className="p-2 text-white hover:text-blue-400 transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
              </Link>
              <button
                onClick={() => onDelete(image._id)}
                className="p-2 text-white hover:text-red-400 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={() => onDownload(image._id)}
            className="p-2 text-white hover:text-green-400 transition-colors"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          {isOwner && (
            <button
              onClick={() => onShare(image._id)}
              className={`p-2 transition-colors ${
                image.shared ? 'text-blue-400' : 'text-white hover:text-blue-400'
              }`}
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Selection checkbox */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(image._id, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold truncate">{image.title}</h3>
          {image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-black bg-opacity-50 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
