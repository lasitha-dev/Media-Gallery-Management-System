import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ImageSlider({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-90" />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <FiX className="w-8 h-8" />
        </button>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 text-white hover:text-gray-300 transition-colors"
        >
          <FiChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 text-white hover:text-gray-300 transition-colors"
        >
          <FiChevronRight className="w-8 h-8" />
        </button>

        {/* Current image */}
        <div className="max-w-[90vw] max-h-[90vh]">
          <img
            src={images[currentIndex].fileUrl}
            alt={images[currentIndex].title}
            className="max-w-full max-h-[90vh] object-contain"
          />

          {/* Image info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">
              {images[currentIndex].title}
            </h3>
            {images[currentIndex].description && (
              <p className="text-sm text-gray-300 mb-2">
                {images[currentIndex].description}
              </p>
            )}
            <div className="flex justify-center gap-2">
              {images[currentIndex].tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-black bg-opacity-50 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
