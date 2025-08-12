import {
  DialogHeader,
  DialogFooter,
} from "@/features/shared/components/ui/Dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/features/shared/components/ui/Dialog";
import { useState } from "react";
import { Button } from "@/features/shared/components/ui/Button";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
import { Experience, User } from "@advanced-react/server/database/schema";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type ExperienceKickButtonProps = {
  experienceId: Experience["id"];
  userId: User["id"];
};

export function ExperienceKickButton({
  experienceId,
  userId,
}: ExperienceKickButtonProps) {
  const { currentUser } = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false);

  const { kickExperienceMutation } = useExperienceMutations({
    kick: {
      onSuccess: () => {
        setIsKickDialogOpen(false);
      },
    },
  });

  const handleSubmit = () => {
    kickExperienceMutation.mutate({ experienceId, userId });
  };

  return (
    <>
      <Dialog open={isKickDialogOpen} onOpenChange={setIsKickDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive-link">Kick</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kick Attendee</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-600 dark:text-neutral-400">
            Are you sure you want to kick this attendee from the experience?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsKickDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={kickExperienceMutation.isPending}
            >
              {kickExperienceMutation.isPending ? "Kicking..." : "Kick"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
