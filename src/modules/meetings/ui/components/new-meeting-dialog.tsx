"use client";

import { ResponsiveDialog } from "@/components/custom_ui/responsive-dialog";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
      Todo for now
    </ResponsiveDialog>
  );
};
