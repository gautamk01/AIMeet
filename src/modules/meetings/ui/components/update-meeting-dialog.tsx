"use client";

import { ResponsiveDialog } from "@/components/custom_ui/responsive-dialog";
import { useRouter } from "next/navigation";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initalValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initalValues,
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit meeting Agent"
      description="Edit Meeting Details "
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initalValues}
      />
    </ResponsiveDialog>
  );
};
