"use client"

import { ModeToggle } from "@/components/ui/theme-toggle"
import {  useState } from "react"
import  JoinRoom  from "../components/JoinRoom"
import  CreateRoom  from "../components/CreateRoom"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import MainCard from "../components/MainCard"
import { useRoomStore } from "@/store/roomData"
  



export default function Home() {

  const {
    socket,
    updateUserId,
    updateRoomId,
    updateRoomName,
    updateUserCount,
  } = useRoomStore()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)


  if(socket){    
    
      socket.onmessage = (message) =>{
        const data = JSON.parse(message.data)
        if(data.type == "room-created" || data.type == "room-joined"){
          const payload = data.payload
          updateUserId(payload.userId)
          localStorage.setItem("userId",payload.userId)
          updateRoomId(payload.roomId)
          updateRoomName(payload.roomName)
          updateUserCount(payload.userCount)
          router.push(`/room/${payload.roomId}`)
          toast.success(payload.message)
        }
        else if(data.type == "error-home"){
          const payload = data.payload
          toast.error(payload.error)
          setIsLoading(false)
        }

      }
    }
  
  return <div >

    <div className="fixed top-3 right-3">
    <ModeToggle/>
    </div>


    <MainCard >
    <div className = "flex justify-around">
      <CreateRoom socket={socket} isLoading={isLoading} setIsLoading={setIsLoading} />
      <JoinRoom socket={socket} isLoading={isLoading} setIsLoading={setIsLoading}/>
    </div>
    </MainCard>
  </div>
  
}
