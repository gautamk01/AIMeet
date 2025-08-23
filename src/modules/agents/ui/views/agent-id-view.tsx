"use client";

import { ErrorState } from "@/components/custom_ui/error-state";
import { LoadingState } from "@/components/custom_ui/loading-state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdViewHeader } from "../components/agent-idViewHeader";
import { useTRPC } from "@/trpc/client";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  return (
    <div className=" flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
