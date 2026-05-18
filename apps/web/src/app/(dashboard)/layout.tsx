import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar spaces={[
        { id: "1", name: "团队空间", color: "#3B82F6" },
        { id: "2", name: "产品文档", color: "#10B981" },
        { id: "3", name: "设计资料", color: "#F59E0B" },
      ]} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
