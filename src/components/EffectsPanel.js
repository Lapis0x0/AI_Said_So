import { useState } from 'react';

const EffectsPanel = ({ onEffectsChange }) => {
  const [yellowFilterIntensity, setYellowFilterIntensity] = useState(0.3);
  const [resolutionScale, setResolutionScale] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('original');

  // 当效果参数变化时，通知父组件
  const handleEffectChange = (name, value) => {
    if (name === 'yellowFilterIntensity') {
      setYellowFilterIntensity(value);
    } else if (name === 'resolutionScale') {
      setResolutionScale(value);
    } else if (name === 'aspectRatio') {
      setAspectRatio(value);
    }

    // 将所有当前效果参数传递给父组件
    if (onEffectsChange) {
      onEffectsChange({
        yellowFilter: true,
        yellowFilterIntensity: name === 'yellowFilterIntensity' ? value : yellowFilterIntensity,
        resolutionScale: name === 'resolutionScale' ? value : resolutionScale,
        aspectRatio: name === 'aspectRatio' ? value : aspectRatio,
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">"AI味"效果控制</h3>
      
      {/* 黄色滤镜强度控制 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          屎黄色滤镜强度: {Math.round(yellowFilterIntensity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={yellowFilterIntensity}
          onChange={(e) => handleEffectChange('yellowFilterIntensity', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* 分辨率缩放控制 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          降低分辨率: {Math.round(resolutionScale * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={resolutionScale}
          onChange={(e) => handleEffectChange('resolutionScale', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* 纵横比控制 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          固定比例裁剪
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'original', label: '原始比例' },
            { value: '1:1', label: '1:1 方形' },
            { value: '4:3', label: '4:3' },
            { value: '16:9', label: '16:9' },
            { value: '9:16', label: '9:16 竖屏' },
            { value: '2:3', label: '2:3 竖屏' },
          ].map((ratio) => (
            <button
              key={ratio.value}
              className={`py-2 px-3 text-sm rounded ${
                aspectRatio === ratio.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => handleEffectChange('aspectRatio', ratio.value)}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EffectsPanel;
