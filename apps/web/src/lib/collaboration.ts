"use client";

import { useEffect, useRef, useState, createContext, useContext, ReactNode } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface CollaborationContextType {
  ydoc: Y.Doc | null;
  provider: WebsocketProvider | null;
  isConnected: boolean;
  connectedUsers: string[];
}

const CollaborationContext = createContext<CollaborationContextType>({
  ydoc: null,
  provider: null,
  isConnected: false,
  connectedUsers: [],
});

export function useCollaboration() {
  return useContext(CollaborationContext);
}

interface CollaborationProviderProps {
  roomId: string;
  userName: string;
  children: ReactNode;
}

export function CollaborationProvider({
  roomId,
  userName,
  children,
}: CollaborationProviderProps) {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:1234";
    
    const newProvider = new WebsocketProvider(wsUrl, roomId, ydoc, {
      params: { userName },
    });

    newProvider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected");
    });

    newProvider.awareness.setLocalStateField("user", {
      name: userName,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    });

    const updateUsers = () => {
      const states = newProvider.awareness.getStates();
      const users: string[] = [];
      states.forEach((state) => {
        if (state.user?.name) {
          users.push(state.user.name);
        }
      });
      setConnectedUsers(users);
    };

    newProvider.awareness.on("change", updateUsers);
    updateUsers();

    setProvider(newProvider);

    return () => {
      newProvider.awareness.off("change", updateUsers);
      newProvider.destroy();
    };
  }, [roomId, userName, ydoc]);

  return (
    <CollaborationContext.Provider
      value={{
        ydoc,
        provider,
        isConnected,
        connectedUsers,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}
