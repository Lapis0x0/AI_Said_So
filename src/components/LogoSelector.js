import { useState } from 'react';

const LogoSelector = ({ onLogoSelect }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  
  // AI工具Logo列表
  const logos = [
    { id: 'midjourney', name: 'Midjourney', path: '/images/logos/midjourney.png' },
    { id: 'dalle', name: 'DALL-E', path: '/images/logos/dalle.png' },
    { id: 'stable-diffusion', name: 'Stable Diffusion', path: '/images/logos/stable-diffusion.png' },
    { id: 'leonardo', name: 'Leonardo AI', path: '/images/logos/leonardo.png' },
    { id: 'none', name: '不添加Logo', path: null }
  ];

  // 选择Logo时的处理函数
  const handleLogoSelect = (logo) => {
    setSelectedLogo(logo.id);
    if (onLogoSelect) {
      onLogoSelect(logo.path);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h3 className="text-xl font-semibold mb-4">选择AI工具Logo</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {logos.map((logo) => (
          <button
            key={logo.id}
            className={`p-3 rounded-lg border transition ${
              selectedLogo === logo.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleLogoSelect(logo)}
          >
            <div className="flex flex-col items-center">
              {logo.path ? (
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <div className="text-xs text-gray-500">[Logo占位]</div>
                </div>
              ) : (
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <span className="text-sm">{logo.name}</span>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        注意：Logo将以半透明水印形式添加到图片右下角
      </p>
    </div>
  );
};

export default LogoSelector;
