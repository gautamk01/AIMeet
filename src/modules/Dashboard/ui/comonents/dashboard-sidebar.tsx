"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BotIcon, icons, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
// helps in dynamically add things with the classname
const firstSection = [
  {
    icon: VideoIcon,
    label: "Meeting",
    href: "/",
  },
  {
    icon: BotIcon,
    label: "Agent",
    href: "/meeting",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className=" flex items-center gap-2 px-2 pt-2 ">
          <Image src="/logo.svg" height={36} width={36} alt="Logo AI MEET" />
          <p className="text-2xl font-semibold"> AI.MEET</p>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className=" opacity-10 text-[#5D6B68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton className={cn()}>
                    <item.icon className=" size-5" />
                    <Link href={item.href}>
                      <span className="text-sm font-medium tracking-tight">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
