import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  t: {
    uploaderClickToUpload: string;
    uploaderFormats: string;
  };
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all duration-300 cursor-pointer p-6"
      onClick={handleClick}
      aria-label="Image uploader"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Image preview" className="w-full h-64 object-cover rounded-xl" />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <UploadIcon className="w-16 h-16 text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">{t.uploaderClickToUpload}</h3>
          <p className="text-sm">{t.uploaderFormats}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;