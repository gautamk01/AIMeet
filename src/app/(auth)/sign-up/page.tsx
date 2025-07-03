import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  //if there is a session is going on then redirect to the session "/"
  if (!!session) {
    redirect("/");
  }
  return <SignUpView />;
}
