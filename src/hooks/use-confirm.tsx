import { ResponsiveDialog } from "@/components/custom_ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useState, JSX } from "react";

export const useConfirm = (
  title: string,
  description: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveDialog
        open={promise !== null}
        onOpenChange={handleClose}
        title={title}
        description={description}
      >
        <div className=" pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            className=" w-full lg:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} className=" w-full lg:w-auto">
            Confirm
          </Button>
        </div>
      </ResponsiveDialog>
    );
  };

  return [ConfirmationDialog, confirm];
};

//The useConfirm hook is a custom React hook that provides a reusable way to show a confirmation dialog and return the user’s choice as a Promise.

// Instead of manually wiring state, dialog visibility, and callbacks every time you need a confirm dialog, this hook lets you:

// Render a reusable dialog component (ConfirmationDialog).

// Call a function (confirm) that shows the dialog and waits for the user’s choice.

// Get the result (true for confirm, false for cancel) in a Promise-based flow.

// This pattern is useful when you want to block execution until the user makes a decision — similar to window.confirm(), but with a modern, styled UI.
