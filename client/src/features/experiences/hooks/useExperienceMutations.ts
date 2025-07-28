import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";

type ExperienceMutationsOptions = {
  edit?: {
    onSuccess?: (id: Experience["id"]) => void;
  };
};

export function useExperienceMutations(
  options: ExperienceMutationsOptions = {},
) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const editExperienceMutation = trpc.experiences.edit.useMutation({
    onSuccess: async ({ id }) => {
      await utils.experiences.byId.invalidate({ id });

      toast({
        title: "Experience updated",
        description: "Your experience has been updated",
      });

      options.edit?.onSuccess?.(id);
    },
    onError: (error) => {
      toast({
        title: "Failed to edit experience",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    editExperienceMutation,
  };
}
