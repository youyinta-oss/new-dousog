"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Home, Folder, Search, Settings } from "lucide-react";

interface Space {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface SidebarProps {
  spaces?: Space[];
}

export function Sidebar({ spaces = [] }: SidebarProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isExpanded && (
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            TeamMind
          </Link>
        )}
        {!isExpanded && <span className="text-2xl font-bold text-primary-600">T</span>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <span className="text-gray-500">{isExpanded ? '<<' : '>>'}</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <SidebarItem
          href="/dashboard"
          icon={<Home className="w-5 h-5" />}
          label="首页"
          active={pathname === "/dashboard"}
          collapsed={!isExpanded}
        />
        <SidebarItem
          href="/search"
          icon={<Search className="w-5 h-5" />}
          label="搜索"
          active={pathname === "/search"}
          collapsed={!isExpanded}
        />
        <SidebarItem
          href="/settings"
          icon={<Settings className="w-5 h-5" />}
          label="设置"
          active={pathname === "/settings"}
          collapsed={!isExpanded}
        />

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            {isExpanded && (
              <span className="text-sm font-medium text-gray-500">空间</span>
            )}
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {spaces.map((space) => (
            <SidebarItem
              key={space.id}
              href={`/spaces/${space.id}`}
              icon={<Folder className="w-5 h-5" style={{ color: space.color }} />}
              label={space.name}
              active={pathname === `/spaces/${space.id}`}
              collapsed={!isExpanded}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

function SidebarItem({ href, icon, label, active, collapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
