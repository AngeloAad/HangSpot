import { Button } from "@/features/shared/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Comment } from "@advanced-react/server/database/schema";
import { commentValidationSchema } from "@advanced-react/shared/schema/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CommentEditFormData = z.infer<typeof commentValidationSchema>;

type CommentEditFormProps = {
  comment: Comment;
  setIsEditing: (value: boolean) => void;
};

export function CommentEditForm({
  comment,
  setIsEditing,
}: CommentEditFormProps) {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const form = useForm<CommentEditFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const editCommentMutation = trpc.comments.edit.useMutation({
    onMutate: async ({ id, content }) => {
      setIsEditing(false);
      // STEP 1
      await utils.comments.byExperienceId.cancel({
        experienceId: comment.experienceId,
      });

      // STEP 2
      const previousData = {
        byExperienceId: utils.comments.byExperienceId.getData({
          experienceId: comment.experienceId,
        }),
      };

      // STEP 3
      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        (oldData) => {
          if (!oldData) {
            return;
          }

          return oldData.map((comment) =>
            comment.id === id
              ? { ...comment, content, updatedAt: new Date().toISOString() }
              : comment,
          );
        },
      );

      const { dismiss } = toast({
        title: "Comment updated",
        description: "Your comment has been updated",
      });

      return { dismiss, previousData };
    },
    onError: (error, _, context) => {
      context?.dismiss?.();

      utils.comments.byExperienceId.setData(
        { experienceId: comment.experienceId },
        context?.previousData.byExperienceId,
      );

      toast({
        title: "Failed to edit comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    editCommentMutation.mutate({
      id: comment.id,
      content: data.content,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextArea {...field} placeholder="Add a Comment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={editCommentMutation.isPending}>
            {editCommentMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={editCommentMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
