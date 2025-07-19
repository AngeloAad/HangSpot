import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import { useToast } from "@/features/shared/hooks/useToast";
import { router, trpc } from "@/router";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  loader: async ({ context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    if (!currentUser) {
      return redirect({ to: "/login" });
    }
  },
});

function SettingsPage() {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();

      toast({
        title: "Logged out",
        description: "You have been logged out!",
      });

      router.navigate({ to: "/login" });
    },
    onError: (error) => {
      toast({
        title: "Failed to logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const settings = [
    {
      Label: "Sign out of your account",
      component: (
        <Button
          variant="destructive"
          disabled={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      ),
    },
  ];

  return (
    <main className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences
            </p>
          </div>

          {settings.map((setting) => (
            <div
              key={setting.Label}
              className="flex items-center justify-between border-t border-neutral-200 pt-6 dark:border-neutral-700"
            >
              <span className="tetx-neutral-600 dark:text-neutral-400">
                {setting.Label}
              </span>

              {setting.component}
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
