import { useRef, useEffect, useState } from 'react';

const ImageCanvas = ({ 
  imageUrl, 
  logoUrl, 
  effects = {}, 
  initialLogoPosition = { x: 0, y: 0 },
  initialLogoScale = 1.0,
  onLogoPositionChange,
  onLogoScaleChange
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [logoPosition, setLogoPosition] = useState(initialLogoPosition);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState({ width: 0, height: 0 });
  const [logoScale, setLogoScale] = useState(initialLogoScale); // 使用传入的初始缩放比例

  // 当图片URL变化时，重新绘制Canvas
  useEffect(() => {
    if (!imageUrl) return;
    
    const image = new Image();
    image.onload = () => {
      // 设置Canvas尺寸为图片尺寸
      const newDimensions = {
        width: image.width,
        height: image.height
      };
      setDimensions(newDimensions);
      
      // 如果是新图片且没有初始缩放比例，重置到默认值
      if (!initialLogoScale || initialLogoScale === 1.0) {
        setLogoScale(1.0);
        if (onLogoScaleChange) {
          onLogoScaleChange(1.0);
        }
      }
      
      // 如果是默认位置，计算并设置Logo在右下角的位置
      if ((logoPosition.x === 0 && logoPosition.y === 0) || 
          (initialLogoPosition.x === 0 && initialLogoPosition.y === 0)) {
        // 计算Logo的基础大小
        const baseLogoWidth = Math.min(newDimensions.width * 0.2, 150);
        const logoWidth = baseLogoWidth * logoScale;
        const logoHeight = (baseLogoWidth * 0.75) * logoScale; // 使用一个合理的高度估计
        
        const newPosition = {
          x: newDimensions.width - logoWidth - 10,
          y: newDimensions.height - logoHeight - 10
        };
        
        setLogoPosition(newPosition);
        
        // 通知父组件位置变化
        if (onLogoPositionChange) {
          onLogoPositionChange(newPosition);
        }
      }
    };
    image.src = imageUrl;
  }, [imageUrl, initialLogoPosition, logoScale, initialLogoScale, onLogoPositionChange, onLogoScaleChange]);
  
  // 当Canvas尺寸变化时，绘制图片
  useEffect(() => {
    if (!imageUrl || dimensions.width === 0 || dimensions.height === 0) return;
    
    // 计算显示尺寸，确保图片不会超出容器
    const calculateDisplayDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const maxHeight = window.innerHeight * 0.7; // 最大高度为窗口高度的70%
      
      let displayWidth = dimensions.width;
      let displayHeight = dimensions.height;
      
      // 如果图片宽度超过容器宽度，等比缩小
      if (displayWidth > containerWidth) {
        const ratio = containerWidth / displayWidth;
        displayWidth = containerWidth;
        displayHeight = displayHeight * ratio;
      }
      
      // 如果图片高度超过最大高度，等比缩小
      if (displayHeight > maxHeight) {
        const ratio = maxHeight / displayHeight;
        displayHeight = maxHeight;
        displayWidth = displayWidth * ratio;
      }
      
      setDisplayDimensions({
        width: displayWidth,
        height: displayHeight
      });
    };
    
    calculateDisplayDimensions();
    
    // 监听窗口大小变化
    const handleResize = () => calculateDisplayDimensions();
    window.addEventListener('resize', handleResize);
    
    const image = new Image();
    image.onload = () => {
      drawImageOnCanvas(image);
    };
    image.src = imageUrl;
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions, imageUrl, logoScale]);

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
      // 计算Logo的基础大小
      const baseLogoWidth = Math.min(width * 0.2, 150); // Logo基础宽度最大为画布宽度的20%或150px
      
      // 应用用户设置的缩放比例
      const logoWidth = baseLogoWidth * logoScale;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      
      // 保存Logo尺寸信息，但不重新计算位置
      // 位置已经在图片加载时计算好了
      
      // 保存Logo尺寸信息
      setLogoSize({
        width: logoWidth,
        height: logoHeight
      });
      
      // 设置透明度
      ctx.globalAlpha = 0.7;
      ctx.drawImage(logo, logoPosition.x, logoPosition.y, logoWidth, logoHeight);
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

  // 处理鼠标事件，实现Logo拖动功能
  const handleMouseDown = (e) => {
    if (!logoUrl || !dimensions.width) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 获取鼠标相对于Canvas的位置
    const rect = canvas.getBoundingClientRect();
    const scaleX = dimensions.width / displayDimensions.width;
    const scaleY = dimensions.height / displayDimensions.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    // 检查鼠标是否在Logo区域内
    if (
      mouseX >= logoPosition.x &&
      mouseX <= logoPosition.x + logoSize.width &&
      mouseY >= logoPosition.y &&
      mouseY <= logoPosition.y + logoSize.height
    ) {
      setIsDraggingLogo(true);
      setDragOffset({
        x: mouseX - logoPosition.x,
        y: mouseY - logoPosition.y
      });
    }
  };
  
  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (!isDraggingLogo || !logoUrl) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 获取鼠标相对于Canvas的位置
    const rect = canvas.getBoundingClientRect();
    const scaleX = dimensions.width / displayDimensions.width;
    const scaleY = dimensions.height / displayDimensions.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    // 计算新的Logo位置
    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;
    
    // 限制Logo不超出画布边界
    const boundedX = Math.max(0, Math.min(dimensions.width - logoSize.width, newX));
    const boundedY = Math.max(0, Math.min(dimensions.height - logoSize.height, newY));
    
    // 直接更新位置并重绘Canvas
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 更新位置参数，但不触发React状态更新
        logoPosition.x = boundedX;
        logoPosition.y = boundedY;
        
        // 重绘Canvas，使得Logo实时跟随鼠标移动
        // 清除画布
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        
        // 绘制原始图片
        if (imageUrl) {
          const img = new Image();
          img.src = imageUrl;
          
          // 如果图片已经加载完成，直接绘制
          if (img.complete) {
            // 绘制原始图片
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
            
            // 应用效果
            applyEffects(ctx, dimensions.width, dimensions.height);
            
            // 手动绘制Logo
            if (logoUrl) {
              const logoImg = new Image();
              logoImg.src = logoUrl;
              
              if (logoImg.complete && logoSize.width > 0 && logoSize.height > 0) {
                // 设置半透明
                ctx.globalAlpha = 0.8;
                // 绘制Logo
                ctx.drawImage(
                  logoImg,
                  logoPosition.x,
                  logoPosition.y,
                  logoSize.width,
                  logoSize.height
                );
                // 恢复透明度
                ctx.globalAlpha = 1.0;
              }
            }
          }
        }
      }
    }
  };
  
  // 处理鼠标释放事件
  const handleMouseUp = () => {
    if (isDraggingLogo) {
      // 鼠标释放时才更新状态，触发重绘
      setLogoPosition({...logoPosition});
      
      // 通知父组件位置变化
      if (onLogoPositionChange) {
        onLogoPositionChange({...logoPosition});
      }
      
      // 重新绘制Canvas
      if (imageUrl) {
        const image = new Image();
        image.onload = () => {
          drawImageOnCanvas(image);
        };
        image.src = imageUrl;
      }
    }
    setIsDraggingLogo(false);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [logoUrl, dimensions, logoSize, isDraggingLogo, dragOffset, displayDimensions, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Logo大小调节函数
  const handleLogoSizeChange = (newScale) => {
    // 保证精确到小数点后一位
    const roundedScale = Math.round(newScale * 10) / 10;
    setLogoScale(roundedScale);
    
    // 通知父组件缩放比例变化
    if (onLogoScaleChange) {
      onLogoScaleChange(roundedScale);
    }
    
    // 重新绘制Canvas
    if (imageUrl) {
      const image = new Image();
      image.onload = () => {
        drawImageOnCanvas(image);
      };
      image.src = imageUrl;
    }
  };
  
  // 获取显示的百分比文本
  const getDisplayPercentage = () => {
    return `${Math.round(logoScale * 100)}%`;
  };
  
  return (
    <div className="relative" ref={containerRef}>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="text-lg font-semibold">处理中...</div>
        </div>
      )}
      {logoUrl && (
        <div className="mb-4 text-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">提示：可以直接拖动Logo调整位置</p>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Logo大小：</span>
              <button 
                onClick={() => handleLogoSizeChange(Math.max(0.2, logoScale - 0.2))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l"
                disabled={logoScale <= 0.2}
              >
                -
              </button>
              <span className="px-2 py-1 bg-gray-100">{getDisplayPercentage()}</span>
              <button 
                onClick={() => handleLogoSizeChange(Math.min(3, logoScale + 0.2))}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r"
                disabled={logoScale >= 3}
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="relative">
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={logoScale}
                onChange={(e) => handleLogoSizeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20%</span>
                <span style={{ position: 'absolute', left: 'calc((0.5 - 0.2) / 2.8 * 100% - 12px)' }}>50%</span>
                <span style={{ position: 'absolute', left: 'calc((1.0 - 0.2) / 2.8 * 100% - 12px)' }}>100%</span>
                <span style={{ position: 'absolute', left: 'calc((2.0 - 0.2) / 2.8 * 100% - 12px)' }}>200%</span>
                <span>300%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: displayDimensions.width > 0 ? displayDimensions.width : 'auto',
          height: displayDimensions.height > 0 ? displayDimensions.height : 'auto',
          cursor: isDraggingLogo ? 'grabbing' : (logoUrl ? 'grab' : 'default')
        }}
        className="border rounded shadow-sm"
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
