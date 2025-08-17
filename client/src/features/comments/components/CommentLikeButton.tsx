import { Button } from "@/features/shared/components/ui/Button";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Comment } from "@advanced-react/server/database/schema";
import { useParams } from "@tanstack/react-router";
import { Heart } from "lucide-react";

type CommentLikeButtonProps = {
  commentId: Comment["id"];
  isLiked: boolean;
  likesCount: number;
  disabled?: boolean;
};

export function CommentLikeButton({
  commentId,
  isLiked,
  likesCount,
  disabled = false,
}: CommentLikeButtonProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { experienceId } = useParams({ strict: false });

  if (!experienceId) {
    return null;
  }

  const likeCommentMutation = trpc.comments.like.useMutation({
    onMutate: async ({ id }) => {
      function updateComment<
        T extends {
          isLiked: boolean;
          likesCount: number;
        },
      >(oldData: T) {
        return {
          ...oldData,
          isLiked: true,
          likesCount: oldData.likesCount + 1,
        };
      }
      // STEP 1
      await utils.comments.byExperienceId.cancel({ experienceId });

      // STEP 2
      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({ experienceId }),
      };

      // STEP 3
      utils.comments.byExperienceId.setData({ experienceId }, (oldData) => {
        if (!oldData) {
          return;
        }

        return oldData.map((comment) =>
          comment.id === id ? updateComment(comment) : comment,
        );
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      utils.comments.byExperienceId.setData(
        { experienceId },
        context?.previousData.byExperienceId,
      );

      toast({
        title: "Failed to like comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unlikeCommentMutation = trpc.comments.unlike.useMutation({
    onMutate: async ({ id }) => {
      function updateComment<
        T extends {
          isLiked: boolean;
          likesCount: number;
        },
      >(oldData: T) {
        return {
          ...oldData,
          isLiked: false,
          likesCount: Math.max(0, oldData.likesCount - 1),
        };
      }
      // STEP 1
      await utils.comments.byExperienceId.cancel({ experienceId });

      // STEP 2
      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({ experienceId }),
      };

      // STEP 3
      utils.comments.byExperienceId.setData({ experienceId }, (oldData) => {
        if (!oldData) {
          return;
        }

        return oldData.map((comment) =>
          comment.id === id ? updateComment(comment) : comment,
        );
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      utils.comments.byExperienceId.setData(
        { experienceId },
        context?.previousData.byExperienceId,
      );

      toast({
        title: "Failed to unlike comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="link"
      onClick={() =>
        isLiked
          ? unlikeCommentMutation.mutate({ id: commentId })
          : likeCommentMutation.mutate({ id: commentId })
      }
      disabled={
        unlikeCommentMutation.isPending ||
        likeCommentMutation.isPending ||
        disabled
      }
    >
      <Heart
        className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
      />
      {likesCount}
    </Button>
  );
}
