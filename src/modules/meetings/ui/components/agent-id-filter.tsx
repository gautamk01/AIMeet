import { CommandSelect } from "@/components/custom_ui/command-select";
import { GeneratedAvatar } from "@/components/custom_ui/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMeetingFilters } from "../../hooks/use-meetings-filters";

export const AgentIDFilter = () => {
  const [filter, setFilter] = useMeetingFilters();

  const trpc = useTRPC();

  const [agentSearch, setAgentSearch] = useState("");
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  return (
    <CommandSelect
      className=" h-9"
      placeholder="Agent"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className=" flex items-center gap-x-2">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={agent.name}
              className="size-4"
            />
            <span className=" font-semibold capitalize">{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) => setFilter({ agentId: value })}
      onSearch={setAgentSearch}
      value={filter.agentId ?? ""}
    />
  );
};
