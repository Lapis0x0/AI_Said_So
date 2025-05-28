import { useState, useRef } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file) => {
    // 检查文件类型是否为支持的格式
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('请上传JPG、PNG或WEBP格式的图片');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreview(imageUrl);
      
      // 将图片传递给父组件
      if (onImageUpload) {
        onImageUpload(imageUrl, file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">上传图片</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${preview ? 'pb-4' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!preview ? (
          <>
            <p className="mb-4">拖放图片到这里，或点击选择文件</p>
            <p className="text-sm text-gray-500 mb-4">支持JPG、PNG、WEBP格式</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              onClick={handleButtonClick}
            >
              选择图片
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 max-w-full">
              <img
                src={preview}
                alt="预览图"
                className="max-h-64 max-w-full object-contain rounded"
              />
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                onClick={handleButtonClick}
              >
                更换图片
              </button>
              {preview && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  onClick={() => {
                    setPreview(null);
                    if (onImageUpload) onImageUpload(null);
                  }}
                >
                  移除图片
                </button>
              )}
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUploader;
