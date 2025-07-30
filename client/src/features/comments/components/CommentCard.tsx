import Card from "@/features/shared/components/ui/Card";
import { CommentForList } from "../type";
import { useState } from "react";
import { Button } from "@/features/shared/components/ui/Button";
import { CommentEditForm } from "./CommentEditForm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import Link from "@/features/shared/components/ui/Link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type CommentCardProps = {
  comment: CommentForList;
};

export function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <CommentEditForm comment={comment} setIsEditing={setIsEditing} />;
  }

  return (
    <Card className="space-y-4 p-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
      <CommentCardButtons comment={comment} setIsEditing={setIsEditing} />
    </Card>
  );
}

/***************************************/
/* COMMENT CARD HEADER COMPONENT BELOW */
/***************************************/
type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/users/$userId"
        params={{ userId: comment.userId }}
        variant="ghost"
      >
        <UserAvatar user={comment.user} />
      </Link>
      <time className="text-sm text-neutral-600 dark:text-neutral-400">
        {new Date(comment.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
}

/***************************************/
/* COMMENT CARD CONTENT COMPONENT BELOW */
/***************************************/
type CommentCardContentProps = Pick<CommentCardProps, "comment">;

function CommentCardContent({ comment }: CommentCardContentProps) {
  return (
    <div className="pl-1">
      <p className="text-muted-foreground text-sm">{comment.content}</p>
    </div>
  );
}

/***************************************/
/* COMMENT CARD BUTTONS COMPONENT BELOW */
/***************************************/
type CommentCardButtonsProps = Pick<CommentCardProps, "comment"> & {
  setIsEditing: (value: boolean) => void;
};

function CommentCardButtons({
  comment,
  setIsEditing,
}: CommentCardButtonsProps) {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { currentUser } = useCurrentUser();

  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId: comment.experienceId,
        }),
        utils.experiences.feed.invalidate(),
      ]);

      setIsDeleteDialogOpen(false);

      toast({
        title: "Comment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isCommentOwner = currentUser?.id === comment.userId;
  const isExperienceOwner = currentUser?.id === comment.experience.userId;

  if (!isCommentOwner && !isExperienceOwner) {
    return null;
  }

  return (
    <div className="flex gap-4 pl-1">
      {isCommentOwner && (
        <Button variant="link" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      )}
      {(isCommentOwner || isExperienceOwner) && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive-link">Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Comment</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteCommentMutation.mutate({ id: comment.id });
                }}
                disabled={deleteCommentMutation.isPending}
              >
                {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
