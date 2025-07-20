"use client";

import { ErrorState } from "@/components/custom_ui/error-state";
import { LoadingState } from "@/components/custom_ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.agents.getMany.queryOptions()
  );

  if (isLoading) {
    return (
      <LoadingState
        title="Loading Agents"
        description="This may take few seconds"
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load the agent"
        description="Something went wrong"
      />
    );
  }

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
