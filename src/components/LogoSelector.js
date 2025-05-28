import { useState, useEffect } from 'react';

const LogoSelector = ({ onLogoSelect, initialLogoUrl = null }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  
  // 当初始Logo URL变化时设置选中状态
  useEffect(() => {
    if (initialLogoUrl) {
      // 查找匹配的Logo
      const matchedLogo = logos.find(logo => logo.path === initialLogoUrl);
      if (matchedLogo) {
        setSelectedLogo(matchedLogo.id);
      }
    }
  }, [initialLogoUrl]);
  
  // AI工具Logo列表
  const logos = [
    { id: 'doubao', name: '豆包AI', path: '/images/logos/doubao_ai.png' },
    { id: 'gemini', name: 'Gemini', path: '/images/logos/gemini.png' },
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
                  <img 
                    src={logo.path} 
                    alt={logo.name} 
                    className="max-h-full max-w-full object-contain"
                  />
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
