"use client";

import { ErrorState } from "@/components/custom_ui/error-state";
import { LoadingState } from "@/components/custom_ui/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-ViewHeader";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcomming-state";
import { ActiveState } from "./active-state";
import { CancelledState } from "./Cancel-state";
import { ProcessingState } from "./Processing-state";
import { CompletedState } from "./completed-state";

interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [UpdateMeetingDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure ?",
    "The following action will remove this meeting"
  );

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        //TODO : Invalidate free tier usage
        router.push("/meetings");
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcomming = data.status === "upcoming";
  const isCompleted = data.status === "completed";
  const isCancelled = data.status === "cancelled";
  const processing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={UpdateMeetingDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initalValues={data}
      />
      <div className=" flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isCompleted && <CompletedState data={data} />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcomming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelled={false}
          />
        )}
        {processing && <ProcessingState />}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Something went wrong"
    />
  );
};
