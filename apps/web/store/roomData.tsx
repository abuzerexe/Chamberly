import { create } from "zustand";

type RoomData = {
    userName: string;
    userId: string;
    roomName: string;
    roomId: string;
    userCount: number;
    createdBy: string;
    socket: WebSocket | null;
    setSocket: (socket: WebSocket | null) => void;
    increaseUserCount: () => void;
    decreaseUserCount: () => void;
    updateUserName: (userName: string) => void;
    updateUserId: (userId: string) => void;
    updateRoomName: (roomName: string) => void;
    updateRoomId: (roomId: string) => void;
    updateCreatedBy: (createdBy: string) => void;
    updateSocket: (socket: WebSocket | null) => void;
    updateUserCount: (userCount: number) => void;
};

export const useRoomStore = create<RoomData>((set) => ({
    userName: "",
    userId: "",
    roomName: "",
    roomId: "",
    userCount: 0,
    createdBy: "",
    socket: null,
    setSocket: (socket) => set({ socket }),
    increaseUserCount: () => set((state) => ({ userCount: state.userCount + 1 })),
    decreaseUserCount: () => set((state) => ({ userCount: Math.max(0, state.userCount - 1) })),
    updateUserName: (userName) => set(() => ({ userName })),
    updateUserId: (userId) => set(() => ({ userId })),
    updateRoomName: (roomName) => set(() => ({ roomName })),
    updateRoomId: (roomId) => set(() => ({ roomId })),
    updateCreatedBy: (createdBy) => set(() => ({ createdBy })),
    updateSocket: (socket) => set(() => ({ socket })),
    updateUserCount : (userCount) => set(()=> ({userCount}))
}));