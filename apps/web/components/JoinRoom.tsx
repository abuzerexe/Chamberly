"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Dispatch, SetStateAction } from "react"

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  roomCode: z
    .string()
    .min(6, { message: "Invalid Room Code." })
    .max(6, { message: "Invalid Room Code." }),
})

type joinRoomProps = {
  socket :  WebSocket | null,
  isLoading : boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>
}


export default function JoinRoom({socket,isLoading,setIsLoading}: joinRoomProps) {



  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      roomCode: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const joinRoomMessage = {
      type : "join-room",
      payload : {
        roomId : data.roomCode,
        userName : data.name
      }
    }
    if (socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(joinRoomMessage));
      setIsLoading(true);
    } else {
      toast.error("Connection not established. Kindly refresh the page.");
      setIsLoading(false); 
    }

    } else {
      toast.error("Connection not established. Kindly Refresh the page.")
      setIsLoading(false); 

    }
    
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-lg py-6 font-bold cursor-pointer">Join Room</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join Room</DialogTitle>
          <DialogDescription>
            Enter details below and click join when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
            id="join-room-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col md:grid md:grid-cols-4 items-center gap-2 md:gap-4">
                  <FormLabel className="text-left md:text-right text-lg md:col-span-1">
                    Name
                  </FormLabel>
                  <FormControl className="md:col-span-3 w-full">
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage className="md:col-span-4 ml-0 md:ml-24" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomCode"
              render={({ field }) => (
                <FormItem className="flex flex-col md:grid md:grid-cols-4 items-center gap-2 md:gap-4">
                  <FormLabel className="text-left md:text-right text-md md:col-span-1">
                    Room Code
                  </FormLabel>
                  <FormControl className="md:col-span-3 w-full">
                    <Input placeholder="Enter Room Code" {...field} />
                  </FormControl>
                  <FormMessage className="md:col-span-4 ml-0 md:ml-24" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            disabled={isLoading && socket?.readyState === WebSocket.OPEN}
            type="submit"
            form="join-room-form"
            className="px-8 text-lg font-bold cursor-pointer"
            size="lg"
          >
            {isLoading?"Joining...":"Join Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
