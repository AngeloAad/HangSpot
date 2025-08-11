import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import { Experience } from "@advanced-react/server/database/schema";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ExperienceFavoriteButtonProps = {
  experienceId: Experience["id"];
  isFavorited: boolean;
  favoritesCount: number;
};

export default function ExperienceFavoriteButton({
  experienceId,
  isFavorited,
  favoritesCount,
}: ExperienceFavoriteButtonProps) {
  const { currentUser } = useCurrentUser();

  const { favoriteExperienceMutation, unfavoriteExperienceMutation } =
    useExperienceMutations({});

  if (!currentUser) {
    return null;
  }

  return (
    <Button
      variant="link"
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
      <Heart
        className={cn("h-6 w-6", isFavorited && "fill-red-500 text-red-500")}
      />
      <span>{favoritesCount}</span>
    </Button>
  );
}
