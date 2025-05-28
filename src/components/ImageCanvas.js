import { useRef, useEffect, useState } from 'react';

const ImageCanvas = ({ imageUrl, logoUrl, effects = {} }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // 当图片URL变化时，重新绘制Canvas
  useEffect(() => {
    if (!imageUrl) return;
    
    const image = new Image();
    image.onload = () => {
      // 设置Canvas尺寸为图片尺寸
      setDimensions({
        width: image.width,
        height: image.height
      });
    };
    image.src = imageUrl;
  }, [imageUrl]);
  
  // 当Canvas尺寸变化时，绘制图片
  useEffect(() => {
    if (!imageUrl || dimensions.width === 0 || dimensions.height === 0) return;
    
    const image = new Image();
    image.onload = () => {
      drawImageOnCanvas(image);
    };
    image.src = imageUrl;
  }, [dimensions, imageUrl]);

  // 当Logo URL或效果变化时，重新绘制Canvas
  useEffect(() => {
    if (!imageUrl || dimensions.width === 0 || dimensions.height === 0) return;
    
    const image = new Image();
    image.onload = () => {
      drawImageOnCanvas(image);
    };
    image.src = imageUrl;
  }, [logoUrl, effects, dimensions]);

  // 在Canvas上绘制图片
  const drawImageOnCanvas = (image) => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width <= 0 || canvas.height <= 0) return;

    setIsProcessing(true);
    
    try {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制原始图片
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      // 应用效果
      applyEffects(ctx, canvas.width, canvas.height);
      
      // 添加Logo水印
      if (logoUrl) {
        addLogoWatermark(ctx, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error('绘制图片时出错:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 应用各种效果
  const applyEffects = (ctx, width, height) => {
    // 应用黄色/棕褐色调滤镜
    if (effects.yellowFilter && effects.yellowFilterIntensity > 0) {
      applyYellowFilter(ctx, width, height, effects.yellowFilterIntensity);
    }
    
    // 其他效果可以在这里添加
  };

  // 应用黄色/棕褐色调滤镜
  const applyYellowFilter = (ctx, width, height, intensity = 0.3) => {
    // 确保宽度和高度都大于0
    if (width <= 0 || height <= 0) return;
    
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // 增加红色和绿色通道，创建黄色效果
        data[i] = Math.min(255, data[i] + (255 - data[i]) * intensity * 0.7); // R
        data[i + 1] = Math.min(255, data[i + 1] + (255 - data[i + 1]) * intensity * 0.5); // G
        // 蓝色通道略微降低，增强黄色效果
        data[i + 2] = Math.max(0, data[i + 2] - data[i + 2] * intensity * 0.3); // B
      }
      
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('应用滤镜时出错:', error);
    }
  };

  // 添加Logo水印
  const addLogoWatermark = (ctx, width, height) => {
    if (!logoUrl) return;
    
    const logo = new Image();
    logo.onload = () => {
      // 计算Logo的位置和大小
      const logoWidth = Math.min(width * 0.2, 150); // Logo宽度最大为画布宽度的20%或150px
      const logoHeight = (logo.height / logo.width) * logoWidth;
      
      // 在右下角绘制Logo，留出10px的边距
      const x = width - logoWidth - 10;
      const y = height - logoHeight - 10;
      
      // 设置透明度
      ctx.globalAlpha = 0.7;
      ctx.drawImage(logo, x, y, logoWidth, logoHeight);
      ctx.globalAlpha = 1.0;
    };
    logo.src = logoUrl;
  };

  // 下载处理后的图片
  const downloadImage = (format = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let mimeType = 'image/png';
    let fileExtension = 'png';
    let quality = 1;
    
    if (format.toLowerCase() === 'jpg' || format.toLowerCase() === 'jpeg') {
      mimeType = 'image/jpeg';
      fileExtension = 'jpg';
      quality = 0.9; // JPEG质量
    }
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `ai-said-so.${fileExtension}`;
    link.href = canvas.toDataURL(mimeType, quality);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="text-lg font-semibold">处理中...</div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-full h-auto border rounded shadow-sm"
      />
      {imageUrl && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => downloadImage('png')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            disabled={isProcessing}
          >
            下载PNG
          </button>
          <button
            onClick={() => downloadImage('jpg')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            disabled={isProcessing}
          >
            下载JPG
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
