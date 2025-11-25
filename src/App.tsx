import { useState } from 'react';
import { DocumentManager } from './components/DocumentManager';
import { KnowledgeGapManager } from './components/KnowledgeGapManager';

export default function App() {
  const [activeView, setActiveView] = useState<'documents' | 'gaps'>('documents');

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">文档管理系统</h1>
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActiveView('documents')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'documents'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                文档管理
              </button>
              <button
                type="button"
                onClick={() => setActiveView('gaps')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeView === 'gaps'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                知识缺口中心
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 - 铺满剩余空间 */}
      <main className="flex-1 overflow-auto">
        <div className="h-full px-6 lg:px-8 py-6">
          {activeView === 'documents' ? <DocumentManager /> : <KnowledgeGapManager />}
        </div>
      </main>
    </div>
  );
}