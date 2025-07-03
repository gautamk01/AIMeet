"use client";

import { BouncingLoading } from "@/components/custom_ui/loadingCircle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  if (!session) {
    return <BouncingLoading dotCount={5} size={10} bounceHeight={10} />;
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.email}</p>
      <Button
        variant="destructive"
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }
      >
        {" "}
        Sign out
      </Button>
    </div>
  );
};
