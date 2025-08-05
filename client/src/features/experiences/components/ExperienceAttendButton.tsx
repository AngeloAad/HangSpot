import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience } from "@advanced-react/server/database/schema";
import { useExperienceMutations } from "../hooks/useExperienceMutations";

type ExperienceAttendButtonProps = {
  experienceId: Experience["id"];
  isAttending: boolean;
};

export default function ExperienceAttendButton({
  experienceId,
  isAttending,
}: ExperienceAttendButtonProps) {
  const { currentUser } = useCurrentUser();

  const { attendExperienceMutation, unattendExperienceMutation } =
    useExperienceMutations({});

  if (!currentUser) {
    return null;
  }

  return (
    <Button
      variant={isAttending ? "outline" : "default"}
      onClick={() => {
        if (isAttending) {
          unattendExperienceMutation.mutate({ id: experienceId });
        } else {
          attendExperienceMutation.mutate({ id: experienceId });
        }
      }}
      disabled={
        attendExperienceMutation.isPending ||
        unattendExperienceMutation.isPending
      }
    >
      {isAttending ? "Not Going" : "Going"}
    </Button>
  );
}
