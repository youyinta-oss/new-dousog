"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Users, Settings, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SpacePage({ params }: { params: { id: string } }) {
  const [documents] = useState([
    { id: "1", title: "Q2 产品规划", author: "张三", updatedAt: "2小时前", tags: ["规划", "产品"] },
    { id: "2", title: "产品需求文档", author: "李四", updatedAt: "昨天", tags: ["需求", "PRD"] },
    { id: "3", title: "用户调研总结", author: "王五", updatedAt: "3天前", tags: ["调研", "用户"] },
  ]);

  const [members] = useState([
    { id: "1", name: "张三", role: "管理员", avatar: "张" },
    { id: "2", name: "李四", role: "编辑者", avatar: "李" },
    { id: "3", name: "王五", role: "查看者", avatar: "王" },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold">团</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">团队空间</h1>
          </div>
          <p className="text-gray-600">团队知识沉淀与协作</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Users className="w-4 h-4 mr-2" />
            成员
          </Button>
          <Button variant="ghost">
            <Settings className="w-4 h-4 mr-2" />
            设置
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建文档
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">文档数</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">成员数</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">本周更新</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">文档</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="搜索文档..."
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{doc.author}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{doc.updatedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">成员</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div key={member.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">{member.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <Button variant="ghost" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  邀请成员
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
