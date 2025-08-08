import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience } from "@advanced-react/server/database/schema";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
import { Heart } from "lucide-react";

type ExperienceFavoriteButtonProps = {
  experienceId: Experience["id"];
  isFavorited: boolean;
};

export default function ExperienceFavoriteButton({
  experienceId,
  isFavorited,
}: ExperienceFavoriteButtonProps) {
  const { currentUser } = useCurrentUser();

  const { favoriteExperienceMutation, unfavoriteExperienceMutation } =
    useExperienceMutations({});

  if (!currentUser) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (isFavorited) {
          unfavoriteExperienceMutation.mutate({ id: experienceId });
        } else {
          favoriteExperienceMutation.mutate({ id: experienceId });
        }
      }}
      disabled={
        favoriteExperienceMutation.isPending ||
        unfavoriteExperienceMutation.isPending
      }
    >
      {isFavorited ? <Heart fill="currentColor" /> : <Heart />}
    </Button>
  );
}
