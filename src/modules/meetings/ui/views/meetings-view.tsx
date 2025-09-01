"use client";
import { ErrorState } from "@/components/custom_ui/error-state";
import { LoadingState } from "@/components/custom_ui/loading-state";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import DataView from "./data";
import { DataTable } from "@/components/custom_ui/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/custom_ui/Empty_state";
import { useRouter } from "next/navigation";
import { useMeetingFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/modules/agents/ui/components/data-pagination";

const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filter, setFilter] = useMeetingFilters();

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filter })
  );

  return (
    <div className=" flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}}`)}
      />
      <DataPagination
        page={filter.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilter({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Meeting"
          description="Schedule a meeting to connect with other . Each meeting let's you collaborate , share ideas and interact with participants in real time "
        />
      )}
    </div>
  );
};

export const MeetingViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="Something went wrong"
    />
  );
};

export default MeetingsView;
