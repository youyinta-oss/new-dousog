"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { CollaborativeEditor } from "@/components/editor/CollaborativeEditor";
import { Button } from "@/components/ui/Button";
import { 
  Save, 
  MoreVertical, 
  Share, 
  History, 
  Tag,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Users,
  Loader2
} from "lucide-react";

interface DocumentVersion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface AISummary {
  summary: string;
  isLoading: boolean;
}

export default function DocumentEditPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("Q2 产品规划");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [enableCollaboration, setEnableCollaboration] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary>({ summary: "", isLoading: false });

  const [versions] = useState<DocumentVersion[]>([
    { id: "1", title: "Q2 产品规划", content: "第一版内容", createdAt: "2024-01-15 10:30", author: { name: "张三" } },
    { id: "2", title: "Q2 产品规划", content: "第二版内容", createdAt: "2024-01-14 15:20", author: { name: "李四" } },
    { id: "3", title: "Q2 产品规划", content: "第三版内容", createdAt: "2024-01-13 09:15", author: { name: "王五" } },
  ]);

  const [tags] = useState<Tag[]>([
    { id: "1", name: "规划", color: "#3B82F6" },
    { id: "2", name: "产品", color: "#10B981" },
    { id: "3", name: "Q2", color: "#F59E0B" },
  ]);

  const [selectedTags, setSelectedTags] = useState<string[]>(["1", "2"]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        alert("文档已保存！");
        
        await fetch(`/api/documents/${params.id}/versions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      }
    } catch (error) {
      console.error("保存失败:", error);
      alert("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    setAiSummary({ summary: "", isLoading: true });
    
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary({ summary: data.summary, isLoading: false });
      } else {
        setAiSummary({
          summary: "本文档主要包含以下要点：\n\n1. Q2 季度产品目标\n2. 核心功能优先级\n3. 团队分工安排\n4. 关键里程碑",
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("生成摘要失败:", error);
      setAiSummary({
        summary: "本文档主要包含以下要点：\n\n1. Q2 季度产品目标\n2. 核心功能优先级\n3. 团队分工安排\n4. 关键里程碑",
        isLoading: false,
      });
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const restoreVersion = (version: DocumentVersion) => {
    if (confirm(`确定要恢复到 ${version.createdAt} 的版本吗？`)) {
      setContent(version.content);
      setTitle(version.title);
      setShowVersions(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 w-full focus:outline-none border-none bg-transparent"
              placeholder="文档标题"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Tags Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTags(!showTags);
                  setShowVersions(false);
                }}
              >
                <Tag className="w-4 h-4 mr-2" />
                标签
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              {showTags && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">选择标签</p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
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
              )}
            </div>

            {/* Versions Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowVersions(!showVersions);
                  setShowTags(false);
                }}
              >
                <History className="w-4 h-4 mr-2" />
                历史
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              {showVersions && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">版本历史</p>
                    <div className="space-y-2">
                      {versions.map((version, index) => (
                        <div
                          key={version.id}
                          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                版本 {versions.length - index}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {version.createdAt} · {version.author.name}
                              </p>
                            </div>
                            <button
                              onClick={() => restoreVersion(version)}
                              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                            >
                              <RotateCcw className="w-4 h-4" />
                              恢复
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>最后编辑于 2 小时前</span>
          <span>•</span>
          <span>团队空间</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return tag ? (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs rounded-full text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="border-b border-gray-200 px-6 py-3 bg-gradient-to-r from-primary-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">AI 助手</span>
          </div>
          {!aiSummary.summary && !aiSummary.isLoading && (
            <Button variant="ghost" size="sm" onClick={handleGenerateSummary}>
              <Sparkles className="w-4 h-4 mr-2" />
              生成摘要
            </Button>
          )}
          {aiSummary.isLoading && (
            <div className="flex items-center gap-2 text-sm text-primary-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              正在生成摘要...
            </div>
          )}
        </div>
        {aiSummary.summary && (
          <div className="mt-2 p-3 bg-white rounded-lg border border-primary-100">
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {aiSummary.summary}
            </div>
          </div>
        )}
      </div>

      {/* Collaboration Status Bar */}
      <div className="border-b border-gray-200 px-6 py-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={enableCollaboration}
                onChange={(e) => setEnableCollaboration(e.target.checked)}
                className="rounded text-primary-600"
              />
              启用实时协作
            </label>
            {enableCollaboration && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <Users className="w-4 h-4" />
                <span>2 人在线</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          {enableCollaboration ? (
            <CollaborativeEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
            />
          ) : (
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="开始写作..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
