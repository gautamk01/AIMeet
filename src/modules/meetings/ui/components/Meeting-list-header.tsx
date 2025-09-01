"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircle, XCircleIcon } from "lucide-react";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { useState } from "react";
import { MeetingsSearchFilter } from "./meeting-search-filter";
import { StatusFilter } from "./status-filter";
import { AgentIDFilter } from "./agent-id-filter";
import { useMeetingFilters } from "../../hooks/use-meetings-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

export const MeetingsListHeader = () => {
  const [filters, setFilter] = useMeetingFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.search || filters.agentId;

  const onClearFilter = () => {
    //Reset the filters
    setFilter({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className=" py-4 px-4 md:px-8 flex flex-col gap-y-4 ">
        <div className=" flex items-center justify-between">
          <h5>My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meetings
          </Button>
        </div>
        <ScrollArea>
          <div className=" flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIDFilter />
            {isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilter}>
                <XCircleIcon className=" size-4" />
                clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
