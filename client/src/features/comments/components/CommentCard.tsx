import Card from "@/features/shared/components/ui/Card";
import { CommentForList } from "../type";

type CommentCardProps = {
  comment: CommentForList;
};

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card className="p-4 space-y-2">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
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
      <div className="font-medium">{comment.user.name}</div>
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
      <p className="text-sm text-muted-foreground">{comment.content}</p>
    </div>
  );
}