import Spinner from "@/features/shared/components/ui/Spinner";
import { CommentCard } from "./CommentCard";
import { CommentForList } from "../type";

type CommentListProps = {
  comments: CommentForList[];
  isLoading: boolean;
  noCommentsMessage?: string;
};

export default function CommentList({
  comments,
  isLoading,
  noCommentsMessage = "No Comments Yet",
}: CommentListProps) {
  return (
    <div>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && comments.length === 0 && (
        <div className="flex justify-center">{noCommentsMessage}</div>
      )}
      {!isLoading && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
