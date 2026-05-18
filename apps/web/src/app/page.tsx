import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            TeamMind
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            团队知识管理与协作平台，让知识沉淀更简单
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              开始使用
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
