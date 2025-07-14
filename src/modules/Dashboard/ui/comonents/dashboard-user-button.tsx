"use client";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/custom_ui/generated-avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const { data, isPending } = authClient.useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useIsMobile();

  const router = useRouter();
  const onlogout = () => {
    setIsLoggingOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: () => {
          setIsLoggingOut(false);
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
          {data.user.image ? (
            <Avatar>
              <AvatarImage src={data.user.image}></AvatarImage>
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name}
              variant="initials"
              className="size-9 mr-3"
            />
          )}
          <div className=" flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">{data.user.name}</p>
            <p className=" text-xs truncate w-full">{data.user.email}</p>
          </div>
          <ChevronDownIcon className=" size-4 shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <p className="text-sm text-muted-foreground">{data.user.email}</p>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={() => {}}>
              <CreditCardIcon className=" size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={onlogout}>
              <LogOutIcon className=" size-4 text-black" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger // Attach the ref to the element
        className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2"
      >
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image}></AvatarImage>
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}
        <div className=" flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className=" text-xs truncate w-full">{data.user.email}</p>
        </div>
        <ChevronDownIcon className=" size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72 ">
        <DropdownMenuLabel>
          <div className=" flex flex-col gap-1">
            <span className=" font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal  text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onlogout}
          disabled={isLoggingOut}
          className=" cursor-pointer flex items-center justify-between"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
