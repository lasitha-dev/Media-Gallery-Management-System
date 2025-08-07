import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

export default function DropZone({ onFilesSelected }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <FiUpload className="w-12 h-12 mb-4 text-gray-400" />
      {isDragActive ? (
        <p className="text-blue-500">Drop the files here...</p>
      ) : (
        <div className="text-center">
          <p className="mb-2 text-gray-500">
            Drag &amp; drop images here, or click to select
          </p>
          <p className="text-sm text-gray-400">
            JPG or PNG only, max 5MB per file
          </p>
        </div>
      )}
    </div>
  );
}
