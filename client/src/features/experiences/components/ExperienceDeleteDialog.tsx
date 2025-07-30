import {
  DialogHeader,
  DialogFooter,
} from "@/features/shared/components/ui/Dialog";
import { Experience } from "@advanced-react/server/database/schema";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/features/shared/components/ui/Dialog";
import { useState } from "react";
import { Button } from "@/features/shared/components/ui/Button";
import { useExperienceMutations } from "../hooks/useExperienceMutations";

type ExperienceDeleteDialogProps = {
  experience: Experience;
  onSuccess?: (id: Experience["id"]) => void;
  onCancel?: (id: Experience["id"]) => void;
  buttonClassName?: string;
};

export default function ExperienceDeleteDialog({
  experience,
  onSuccess,
  buttonClassName,
}: ExperienceDeleteDialogProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { deleteExperienceMutation } = useExperienceMutations({
    delete: {
      onSuccess: (id) => {
        setIsDeleteDialogOpen(false);
        onSuccess?.(id);
      },
    },
  });

  const handleSubmit = () => {
    deleteExperienceMutation.mutate({ id: experience.id });
  };

  return (
    <div className="flex gap-4 pl-1">
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive-link" className={buttonClassName}>Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-600 dark:text-neutral-400">
            Are you sure you want to delete this experience? This action cannot
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
              onClick={handleSubmit}
              disabled={deleteExperienceMutation.isPending}
            >
              {deleteExperienceMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
