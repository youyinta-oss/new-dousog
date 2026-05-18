"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Calendar, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  const [recentDocs] = useState([
    { id: "1", title: "Q2 产品规划", space: "团队空间", updatedAt: "2小时前" },
    { id: "2", title: "用户调研总结", space: "产品文档", updatedAt: "昨天" },
    { id: "3", title: "设计系统规范", space: "设计资料", updatedAt: "3天前" },
    { id: "4", title: "开发流程指南", space: "团队空间", updatedAt: "1周前" },
  ]);

  const [stats] = useState([
    { label: "文档总数", value: "128", icon: FileText, color: "blue" },
    { label: "本月新增", value: "24", icon: Plus, color: "green" },
    { label: "活跃协作者", value: "16", icon: TrendingUp, color: "purple" },
    { label: "最近更新", value: "8", icon: Clock, color: "orange" },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">欢迎回来！</h1>
          <p className="text-gray-600 mt-1">继续您的工作或创建新文档</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          新建文档
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-100 text-blue-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600",
            orange: "bg-orange-100 text-orange-600",
          };
          
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">最近文档</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="block p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{doc.space}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {doc.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  打开
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
