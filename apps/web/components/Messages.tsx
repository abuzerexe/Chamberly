import { useRoomStore } from "@/store/roomData"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface Message {
    id: string,
    content: string,
    senderId: string,
    senderName: string,
    timestamp: string
  
}


export const Messages = ()=>{

    const {userId,socket,updateUserCount} = useRoomStore()
    const [messages, setMessages] = useState<Message[]>([])
    const latestMsg = useRef<HTMLDivElement>(null)

    if (socket) {
      socket.onmessage = (message) =>{
        const data = JSON.parse(message.data)
        if(data.type === "message" ){
          setMessages((prev)=>[...prev,data.payload])
        }
        else if(data.type === "system"){
            const payload = data.payload
            if(payload.senderId != userId){
                updateUserCount(payload.userCount)
                toast.info(payload.message)
            }
        }
        else if(data.type === "leave-success"){
            const payload = data.payload
                toast.info(payload.message)
            
        }
        else if(data.type === "disconnect-info"){
            const payload = data.payload
            toast.error(payload.message)
            
        }

      }
    }

    useEffect(()=>{
        latestMsg.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    return <>
        {messages.map((msg,index)=>{
            const isFirst = index === 0 || messages[index - 1]?.senderId != msg.senderId
            
            return <div key={msg.id} className={`flex flex-col ${
              msg.senderId === userId ? 'items-end' : 'items-start'
            }`}>

            {isFirst && (
              <div className="text-xs text-muted-foreground mb-0.5">
                {msg.senderName}
              </div>
            )}
            <div
              className={`inline-block rounded-lg px-3 py-1.5 break-words ${
                msg.senderId === userId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              } ${!isFirst ? 'mt-0.5' : 'mt-1.5'}`}
            >
              {msg.content}
            </div>
            </div>
        })}
        <div ref={latestMsg}></div>
    </>
    
}
