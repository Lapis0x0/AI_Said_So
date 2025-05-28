import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
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

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">上传图片</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="mb-4">拖放图片到这里，或点击选择文件</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                选择图片
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-gray-600">
        <p>© {new Date().getFullYear()} 跟我的 ai 说去吧! | AI Said So</p>
      </footer>
    </div>
  );
}
