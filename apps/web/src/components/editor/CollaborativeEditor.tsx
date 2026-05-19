"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";
import { Users } from "lucide-react";
import { useCollaboration } from "@/lib/collaboration";

interface CollaborativeEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function CollaborativeEditor({
  content = "",
  onChange,
  placeholder = "开始写作...",
}: CollaborativeEditorProps) {
  const { ydoc, isConnected, connectedUsers } = useCollaboration();

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <EditorToolbar editor={editor} />
        <div className="flex items-center gap-2 px-2">
          {isConnected ? (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              <span>实时协作中</span>
              {connectedUsers.length > 1 && (
                <div className="flex items-center gap-1 ml-2 text-primary-600">
                  <Users className="w-4 h-4" />
                  <span>{connectedUsers.length} 人在线</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span>本地模式</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
