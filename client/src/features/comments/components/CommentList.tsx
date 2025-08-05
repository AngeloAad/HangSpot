import { CommentCard } from "./CommentCard";
import { CommentForList } from "../type";

type CommentListProps = {
  comments: CommentForList[];
  noCommentsMessage?: string;
};

export default function CommentList({
  comments,
  noCommentsMessage = "No Comments Yet",
}: CommentListProps) {
  return (
    <div>
      {comments.length === 0 && (
        <div className="flex justify-center">{noCommentsMessage}</div>
      )}
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
