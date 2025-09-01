import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

export const CallEnded = () => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserPermission = hasCameraPermission && hasMicPermission;
  return (
    <div className=" flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className=" py-4 px-8 flex flex-1 items-center justify-center">
        <div className=" flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className=" flex flex-col gap-y-2 text-center">
            <h6 className=" text-lg font-medium">You have ended the call</h6>
            <p className=" text-sm">Summery will appear in a few Minutes</p>
          </div>
          <Button asChild>
            <Link href="/meetings">Back to meeting</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
