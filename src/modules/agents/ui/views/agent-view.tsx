"use client";

import { ErrorState } from "@/components/custom_ui/error-state";
import { LoadingState } from "@/components/custom_ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/custom_ui/Empty_state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
export const AgentsView = () => {
  const [filter] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filter, //spreading the  in the same thing needed to be there in the server side (page) we are doing
    })
  );

  return (
    <div>
      <DataTable data={data.items} columns={columns} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meeting , each meeting "
        />
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a few seconds"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};
