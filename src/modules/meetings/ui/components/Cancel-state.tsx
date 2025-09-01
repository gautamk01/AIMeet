import { EmptyState } from "@/components/custom_ui/Empty_state";

export const CancelledState = () => {
  return (
    <div className=" bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting Cancelled"
        description="This Meeting was cancelled"
      />
    </div>
  );
};
