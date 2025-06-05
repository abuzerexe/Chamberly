"use client"
import { useEffect } from "react";
import { useRoomStore } from "@/store/roomData";
import { toast } from "sonner";

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const setSocket = useRoomStore((s) => s.setSocket);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
      toast.info("You disconnected.")
    };
  }, [setSocket]);

  return <>{children}</>;
}