"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
meetingsInsertSchema;
import { zodResolver } from "@hookform/resolvers/zod";

import { MeetingGetOne } from "../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/custom_ui/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { meetingsInsertSchema } from "../../schemas";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  //when on success happends we will invalidate  when we create the agent
  //we have to immediately show the agent
  // This moment we can see the power of prefectch

  //invalidateQueries = This cached data may now be stale — please refetch it the next time it’s used (or immediately if it’s active).”
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );

        //todo : invalidate free tire usage

        toast.success("Meeting is Created");
        //close it
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },

      //todo: check if error code is "forbiden"
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        if (initialValues?.id) {
          queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues?.id })
          );
        }

        toast.success("Updated the Meeting ");
        //close it
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },

      //todo: check if error code is "forbiden", redirect to '/upgrade'
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues?.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className=" space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="g. Math Consultation" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              onClick={() => onCancel()}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button disabled={isPending} type="submit">
            {isEdit ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
