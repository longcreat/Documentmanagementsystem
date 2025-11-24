import { DocumentManager } from './components/DocumentManager';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-gray-900">酒店知识库管理平台</h1>
          <p className="text-gray-500 mt-1">管理和完善您的酒店信息文档</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <DocumentManager />
      </main>
    </div>
  );
}