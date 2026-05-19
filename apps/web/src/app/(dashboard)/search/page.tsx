"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, FileText, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>("");

  const [searchResults] = useState([
    { 
      id: "1", 
      title: "Q2 产品规划", 
      space: "团队空间", 
      author: "张三",
      updatedAt: "2小时前",
      tags: ["规划", "产品"],
      snippet: "本文档包含Q2季度产品规划的核心内容，包括产品目标、功能优先级..."
    },
    { 
      id: "2", 
      title: "用户调研总结", 
      space: "产品文档", 
      author: "李四",
      updatedAt: "昨天",
      tags: ["调研", "用户"],
      snippet: "针对目标用户群体进行了深入调研，收集了100+份有效问卷..."
    },
    { 
      id: "3", 
      title: "设计系统规范", 
      space: "设计资料", 
      author: "王五",
      updatedAt: "3天前",
      tags: ["设计", "规范"],
      snippet: "统一的设计语言和规范，包括颜色、字体、间距等..."
    },
  ]);

  const [recentSearches] = useState([
    "产品规划",
    "用户调研",
    "API文档",
  ]);

  const availableTags = [
    { id: "1", name: "规划", color: "#3B82F6" },
    { id: "2", name: "产品", color: "#10B981" },
    { id: "3", name: "Q2", color: "#F59E0B" },
    { id: "4", name: "调研", color: "#EF4444" },
    { id: "5", name: "设计", color: "#8B5CF6" },
  ];

  const availableSpaces = [
    { id: "1", name: "团队空间" },
    { id: "2", name: "产品文档" },
    { id: "3", name: "设计资料" },
  ];

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">搜索</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="搜索文档、标题、内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {!searchQuery && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近搜索</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">筛选条件</span>
          </div>
        </div>

        {/* Space Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">空间</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpace("")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                !selectedSpace
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              全部
            </button>
            {availableSpaces.map((space) => (
              <button
                key={space.id}
                onClick={() => setSelectedSpace(space.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedSpace === space.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {space.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{
                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {searchQuery ? `搜索结果: "${searchQuery}"` : "所有文档"}
        </h2>
        <div className="space-y-4">
          {searchResults.map((result) => (
            <Link
              key={result.id}
              href={`/documents/${result.id}`}
              className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500">{result.space} · {result.author}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{result.snippet}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {result.tags.map((tag) => {
                        const tagInfo = availableTags.find((t) => t.name === tag);
                        return (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full text-white"
                            style={{ backgroundColor: tagInfo?.color || "#6B7280" }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {result.updatedAt}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
