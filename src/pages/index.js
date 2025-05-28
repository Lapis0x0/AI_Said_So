import Head from 'next/head';
import { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImageCanvas from '../components/ImageCanvas';
import EffectsPanel from '../components/EffectsPanel';
import LogoSelector from '../components/LogoSelector';

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [effects, setEffects] = useState({
    yellowFilter: true,
    yellowFilterIntensity: 0.3,
    resolutionScale: 1,
    aspectRatio: 'original'
  });

  // 处理图片上传
  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  // 处理Logo选择
  const handleLogoSelect = (url) => {
    setLogoUrl(url);
  };

  // 处理效果变化
  const handleEffectsChange = (newEffects) => {
    setEffects(newEffects);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>跟我的 ai 说去吧! | AI Said So</title>
        <meta name="description" content="一款有趣的纯前端在线图片处理工具，可以为真实图片添加AI绘画工具的Logo水印，制作出AI生成风格的图片。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">跟我的 ai 说去吧!</h1>
        <p className="text-center text-lg mb-8">
          上传真实图片，添加AI绘画工具Logo水印，轻松制作"AI生成风格"图片
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧控制面板 */}
            <div className="lg:col-span-1">
              <ImageUploader onImageUpload={handleImageUpload} />
              
              {imageUrl && (
                <>
                  <LogoSelector onLogoSelect={handleLogoSelect} />
                  <EffectsPanel onEffectsChange={handleEffectsChange} />
                </>
              )}
            </div>
            
            {/* 右侧预览和处理区域 */}
            <div className="lg:col-span-2">
              {imageUrl ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4">效果预览</h2>
                  <ImageCanvas 
                    imageUrl={imageUrl} 
                    logoUrl={logoUrl} 
                    effects={effects} 
                  />
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">请先上传图片</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 mt-12 text-gray-600 border-t">
        <p>© {new Date().getFullYear()} 跟我的 ai 说去吧! | AI Said So！</p>
        <p className="text-sm mt-2">纯前端图片处理工具，所有操作均在浏览器中完成，不会上传您的图片</p>
      </footer>
    </div>
  );
}