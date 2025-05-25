"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { useEffect, useRef, useState } from "react"
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import  JoinRoom  from "./JoinRoom"
import  CreateRoom  from "./CreateRoom"
import ChatLogo from "@/components/ui/ChatLogo"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
// import { DialogDemo } from "./text"




export default function Home() {
  const newSocket = useRef<WebSocket>(null)
  const [userId, setUserId] = useState<string>("")
  const [roomCode, setRoomCode] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")
  const [userCount, setUserCount] = useState<number>(0)
  const [userName,setUserName] = useState<string>("")

  const canSend = newSocket && newSocket.current?.readyState === WebSocket.OPEN;

  useEffect(()=>{
    newSocket.current = new WebSocket("ws://localhost:8080")
    const socket = newSocket.current
    socket.onopen = () => {
      console.log("Connection Established")
      // socket.send("New Connection " + Date.now())
      
      socket.onmessage = (message) =>{
        const data = JSON.parse(message.data)
        if(data.type == "room-created"){
          const payload = data.payload
          setUserId(payload.userId)
          localStorage.setItem("userId",userId)
          setRoomCode(payload.roomId)
          console.log(payload.roomId) 
          setRoomName(payload.roomName)
          setUserCount(payload.userCount)
          toast.success(payload.message)
          
        }

        else if(data.type == "room-joined"){
          const payload = data.payload
          setUserId(payload.userId)
           localStorage.setItem("userId",userId)
          setRoomCode(payload.roomId)
          setRoomName(payload.roomName)
          setUserCount(payload.userCount)
          toast.success(payload.message)
        }
      }
    }
  },[])



  return <div >

    <div className="fixed top-3 right-3">
    <ModeToggle/>
    </div>

      <div className="container mx-auto max-w-2xl p-4 h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl flex items-center gap-2 font-bold">
             <ChatLogo/>
              Chamberly.
            </CardTitle>
            <CardDescription className="text-md">
              temporary room that expires after all users exit
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-around">

            <CreateRoom socket={newSocket} />
            <JoinRoom socket={newSocket} />
          </CardContent>
        </Card> 

      </div>
  </div>
  
}