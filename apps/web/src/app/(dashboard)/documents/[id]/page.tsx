"use client";

import { useState } from "react";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Button } from "@/components/ui/Button";
import { Save, MoreVertical, Share, History, Tag } from "lucide-react";

export default function DocumentEditPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("Q2 产品规划");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // 这里会调用 API 保存文档
    setTimeout(() => {
      setIsSaving(false);
      alert("文档已保存！");
    }, 1000);
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
            <Button variant="ghost" size="sm">
              <Tag className="w-4 h-4 mr-2" />
              标签
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4 mr-2" />
              历史
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>最后编辑于 2 小时前</span>
          <span>•</span>
          <span>团队空间</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <TipTapEditor
            content={content}
            onChange={setContent}
            placeholder="开始写作..."
          />
        </div>
      </div>
    </div>
  );
}
