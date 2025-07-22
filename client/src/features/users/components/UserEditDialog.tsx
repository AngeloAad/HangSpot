import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { User } from "@advanced-react/server/database/schema";
import { userEditSchema } from "@advanced-react/shared/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserFormData = z.infer<typeof userEditSchema>;

type UserEditDialogProps = {
  user: User;
};

export function UserEditDialog({ user }: UserEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { currentUser } = useCurrentUser();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      bio: user.bio ?? "",
    },
  });

  const editUserMutation = trpc.users.edit.useMutation({
    onSuccess: async ({ id }) => {
      await Promise.all([
        utils.users.byId.invalidate({ id }),
        utils.auth.currentUser.invalidate(),
      ]);

      form.reset();

      setIsOpen(false);

      toast({
        title: "Success",
        description: "Your have updated your profile!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to edit user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data: UserFormData) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null) {
            formData.append(key, value as string | Blob)
        }
    }

    editUserMutation.mutate(formData);
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Update Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="name" placeholder={currentUser?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} type="bio" placeholder={currentUser?.bio ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={editUserMutation.isPending}>
                {editUserMutation.isPending
                  ? "Updating Profile..."
                  : "Update Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
