import { WebSocketServer, WebSocket } from "ws";
import { nanoid } from 'nanoid';


const wss = new WebSocketServer({port: 8080});

type Room = {
  roomName: string;  
  createdBy: string;
  participants: Set<WebSocket>;
};

type User = {
    userId : string; 
    userName : string
}

const rooms = new Map<string,Room>() 

const users = new Map<WebSocket,User>() // socket, name of the user



wss.on("connection",(ws)=>{
    console.log("user connected")

    ws.on("message",(message)=>{ // we will get json as string 

        const parsedMessage = JSON.parse(message as unknown as string) 
        const type = parsedMessage.type
        const payload = parsedMessage.payload
        
        if(type == "create-room"){
             createRoom(payload, ws)
          
        }
        else if(type == "join-room"){
             joinRoom(payload,ws)
            
        }
        else if(type == "broadcast"){
            const message = broadcastToRoom(parsedMessage,ws)
        }
    })
})



/*
    CREATE ROOM 

    CLIENT:
  {
  "type": "create-room",
  "payload": {
    "roomName": "General Chat",
    "createdBy": "Abuzer"
  }
}

  SERVER:
  {
    type: "room-created",
    payload: {
      "userId" : "23456",  
      "roomId" : "23232",
      "roomName" : "General Chat",
      "userCount" : 1,
      "status": "success",
      "message": "Room "General Chat" created successfully".
    }
  }
*/

function createRoom( payload: Room, ws: WebSocket){

try{
    const roomId = generateRoomId()
    const roomName = payload.roomName
    const createdBy = payload.createdBy

    rooms.set(roomId,{roomName, createdBy, participants: new Set([ws])})

    const userId = generateUserId()
    users.set(ws,{userId,userName: createdBy})

    const message = {
    type: "room-created",
    payload: {
      userId,  
      roomId,
      roomName,
      userCount : 1,
      status: "success",
      message: `Room "${roomName}" created successfully.`
    }
  }
   ws.send(JSON.stringify(message))
  return 

}catch(e){
    console.log("Create Room error: "+e)
    const message = {
      type: "error",
      payload: {
        error: "Failed to create room. Please try again.",
        context: "create-room"
      }
    }
     ws.send(JSON.stringify(message))
    return 
}

}


/*
    JOIN ROOM 

    CLIENT

    {
   "type": "join-room",
   "payload": {
	   "roomId": "abc123",
     "userName" : "abuzer"
   }
}

    SERVER

    {
      type: "room-joined",
      payload: {
      "userId" : "23456",  
      "roomId" : "23232",
      "roomName" : "General Chat",
      "createdBy": "Abuzer",
      "userCount": 2,
      "status": "success",
      "message": `Room "General Chat" joined successfully.`
      }

*/


function joinRoom( payload, ws: WebSocket){

    const roomId = payload.roomId
    const userName = payload.userName
    
    if(rooms.has(roomId)){
        const existingUser = users.get(ws);
        const userId = existingUser?.userId ?? generateUserId();        
        
        users.set(ws,{userId,userName})
        const room = rooms.get(roomId)
        room.participants.add(ws)
        const roomName = room.roomName


          const broadcastMessage = {
            type: "user-join",
            payload: {
              roomId,
              message : `${userName} has joined the room.`
            }
          }
            broadcastToRoom(broadcastMessage,ws)

            const message = {
            type: "room-joined",
            payload: {
            userId,  
            roomId,
            roomName,
            createdBy: room.createdBy,
            userCount: room.participants.size,
            status: "success",
            message: `Room "${roomName}" joined successfully.`
            }
        }
        ws.send(JSON.stringify(message))
        return 

    }else{
    const message = {
      type: "error",
      payload: {
        error: "There is no room with this Room Id.",
        context: "join-room"
      }
    }
    ws.send(JSON.stringify(message))
    return 
    }

}


/*
    BROADCAST TO ROOM 

    CLIENT 
    {
   "type": "broadcast",
   "payload": {
	 "roomId": "791348",
    "message" : "hi"
    }}

  SERVER

  // chat message

  {"type":"chat-broadcast",
  "payload":{
  "message":"hi",
  "senderId":"I0uwDAV",
  "senderName":"Random2",
  "timestamp":"2025-05-23T22:44:19.609Z"
  }}

  // announcing user

  {"type":"chat-broadcast",
  "payload":{
  "message":"hi",
  "senderId":"I0uwDAV",
  "senderName":"Random2",
  "timestamp":"2025-05-23T22:44:19.609Z"
  }}
*/

function broadcastToRoom(parsedMsg, ws: WebSocket){
    const roomId = parsedMsg.payload.roomId

    if(!rooms.has(roomId)){
    const message = {
      type: "error",
      payload: {
        error: "There is no room with this Room Id.",
        context: "broadcast"
      }
    }
    ws.send(JSON.stringify(message))
    return 
    } 

    const sender = users.get(ws)
    let message = {}

    if(parsedMsg.type == "user-join"){
      message = {
        type: "announce-user",
        payload: {
          message : parsedMsg.payload.message,
          senderId : sender.userId,
          senderName : sender.userName,
          timestamp: new Date().toISOString()

      }
    }
    }else{
      console.log("chat reached")
      message = {
        type: "chat-broadcast",
        payload: {
          message : parsedMsg.payload.message,
          senderId : sender.userId,
          senderName : sender.userName,
          timestamp: new Date().toISOString()

      }
    }
    }

    const participants = rooms.get(roomId).participants

    participants.forEach((participant)=>{
        if(participant != ws){
            participant.send(JSON.stringify(message))
        }
    })

    
}


function generateRoomId(): string{
    let id : string;
    do {
        id = Math.floor(100000 + Math.random() * 900000 ).toString()
    } while (rooms.has(id));

    return id;
}

function generateUserId():string{
    const userId = nanoid(7)

    return userId;

}   