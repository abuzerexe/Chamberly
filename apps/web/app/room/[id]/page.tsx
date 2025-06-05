"use client"

import MainCard from "@/components/MainCard"
import { Button } from "@/components/ui/button"
import { useRoomStore } from "@/store/roomData"
import { Copy,LogOut } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { FormEvent, useEffect, useRef } from "react"
import { Messages } from "@/components/Messages"
import { useRouter } from "next/navigation"

export default function ChatRoom(){
      const {
       roomId,
       roomName,
       userId,
       userCount,
       socket
      } = useRoomStore()

    const currMsg = useRef<HTMLInputElement>(null)
    const router = useRouter();

    const copyToClipboard = (text:string) =>{
        navigator.clipboard.write([
            new ClipboardItem({
                'text/plain' : new Blob([text],{type: "text/plain"}),
            }),
        ]).then(()=>{
            toast.success("Room code copied to clipboard.")
        }).catch(()=>{
            toast.error("Failed to copy room code.")
        })
    }

    const sendMsg = (e: FormEvent) =>{
        e.preventDefault()

         if (currMsg.current ) {
            if( currMsg.current.value.trim() === "") return

            const boradcastMessage = {
              type : "broadcast",
              payload : {
                roomId ,
                message : currMsg.current.value
              }
            }
            if (socket) {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(boradcastMessage));
                    currMsg.current.value = ""
                } else {
                    toast.error("Connection not established. Kindly join again.");
                }           
         } else {
              toast.error("Connection not established. Kindly join again.")
            }

    }
}
    if(socket!= null){
        socket.onmessage = (message) =>{
            const data = JSON.parse(message.data)
            if(data.type == "message"){
                const payload = data.payload
                console.log(payload)
        }
      }
    }

    useEffect(() => {
    if (!roomId || !userId) {
      router.replace("/");
    }
    }, [roomId, userId, router]);

    const LeaveRoom = ()=>{
      router.replace("/");
      const leaveMsg = {
        type: "leave-room",
            payload: {
            roomId
            }
      }
        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(leaveMsg));
                } else {
                    toast.error("Error Occured.");
                }           
         } else {
              toast.error("Error Occured.")
            }
    }

    return <div>
        <div className="fixed top-3 right-3 flex gap-2">
            <div>
                <Button size={"icon"} variant={"outline"} onClick={LeaveRoom} className="cursor-pointer">
                <LogOut/>
                </Button>
            </div>
            <ModeToggle/>
        </div>

        <MainCard> 
                <div className="mb-4 px-2">
          <h2 className="text-xl font-semibold text-center truncate" title={roomName}>
            {roomName}
          </h2>
        </div>
            <div className="flex flex-row justify-between w-full text-md text-muted-foreground bg-muted gap-2 rounded-lg p-3">
                <div className="flex items-center ">
                Room Code:  
                <div className="font-mono font-semibold">
                {roomId}
                </div>
                <Button variant={"ghost"} 
                    size={"icon"} 
                    className=" pl-3 h-6 w-6 cursor-pointer"
                    onClick={() => copyToClipboard(roomId)}>
                    <Copy className="h-3 w-3"/>
                </Button>
                </div>

                Users: {userCount} 
            </div>
          
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-2 mt-4 mb-4">
                <Messages/>
            </div>
            
            <form onSubmit={sendMsg} className="flex gap-2">

            <Input className="text-lg py-5"  placeholder="Type a message..."  ref={currMsg}/>
            <Button type="submit" size="lg" className="font-bold text-lg px-8 cursor-pointer">Send</Button>

            </form>
            


        </MainCard>
    </div>
}

