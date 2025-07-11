import './globals.css'
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import WebSocketProvider from './provider/WebSocketProvider';


const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})


export const metadata: Metadata = {
  title: "Chamberly",
  description: "temporary room that expires after all users exit",
};

export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <WebSocketProvider>
            {children}
            <Toaster />
          </WebSocketProvider>
          </ThemeProvider>

      </body>
    </html>
  );
}
