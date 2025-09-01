import { auth } from "@/lib/auth";
import { loadSearchparams } from "@/modules/meetings/params";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/Meeting-list-header";
import MeetingsView, {
  MeetingsViewError,
  MeetingViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";

import type { SearchParams } from "nuqs";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParamas: Promise<SearchParams>;
}

const Page = async ({ searchParamas }: Props) => {
  const filters = await loadSearchparams(searchParamas);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );
  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
