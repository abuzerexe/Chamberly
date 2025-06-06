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
  roomName: z
    .string()
    .min(3, { message: "Invalid Room Name. Atleast 3 characters." })
    .max(20, { message: "Invalid Room Name. Atmost 20 characters." }),
})


type CreateRoomProps = {
  socket :  WebSocket | null,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>

}

export default function CreateRoom({socket,isLoading,setIsLoading}: CreateRoomProps) {



  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      roomName: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const createRoomMessage = {
      type : "create-room",
      payload : {
        roomName : data.roomName,
        createdBy : data.name
      }
    }
    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(createRoomMessage));
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
        <Button className="text-lg py-6 font-bold cursor-pointer">Create Room</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Room</DialogTitle>
          <DialogDescription>
            Enter details below and click Create when you're ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            
            className="grid gap-4 py-4"
            id="create-room-form"
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
              name="roomName"
              render={({ field }) => (
                <FormItem className="flex flex-col md:grid md:grid-cols-4 items-center gap-2 md:gap-4">
                <FormLabel className="text-left md:text-right text-md md:col-span-1">
                  Room Name
                </FormLabel>
                <FormControl className="md:col-span-3 w-full">
                  <Input placeholder="Enter Room Name" {...field} />
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
            form="create-room-form"
            className="px-8 text-lg font-bold cursor-pointer"
            size="lg"
          >
            {isLoading?"Creating...":"Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
