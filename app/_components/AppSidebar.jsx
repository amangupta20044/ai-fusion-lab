"use client"
import React from "react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="flex item-center gap-3">
              <Image src={'/logo.svg'} alt="logo" width={60} height={60} className="w-[40px] h-[40px]" />
              <h2 className="font-bold text-xl">AI Fusion</h2>
            </div>
            <div>
              {mounted && (
                theme == 'light' ?
                  <Button variant={"ghost"} onClick={() => setTheme('dark')}><Sun /></Button>
                  : <Button variant={"ghost"} onClick={() => setTheme('light')}><Moon /></Button>
              )}
            </div>
          </div>
          <Button className='mt-7 w-full' size="lg">+ New Chat</Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <div className={"p-3"}>
            <h2 className="font-bold text-lg">Chats</h2>
            <p className="text-sm text-gray-500">List of chat will be displayed here</p>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-5">
          <Button className={'w-full'} size={'lg'}>Sign In/Sign Up</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}