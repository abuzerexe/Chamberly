import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLogo from "@/components/ui/ChatLogo";
import Link from "next/link";


export default function MainCard({children}:React.PropsWithChildren){
    return(
      <div className="container mx-auto max-w-2xl p-4 h-screen flex items-center justify-center mt-6">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className=" flex items-center">
              <Link className="text-3xl flex items-center gap-2 font-bold" href={"/"}>
                <ChatLogo/>
                Chamberly.
              </Link>
            </CardTitle>
            <CardDescription className="text-md">
              temporary room that expires after all users exit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}

          </CardContent>
        </Card> 

      </div>
    )
}