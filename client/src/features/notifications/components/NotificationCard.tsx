import { LinkProps } from "@tanstack/react-router";
import { NotificationForList } from "../types";
import Link from "@/features/shared/components/ui/Link";
import Card from "@/features/shared/components/ui/Card";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";

type NotificationCardProps = {
  notification: NotificationForList;
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  let linkProps: Pick<LinkProps, "to" | "params"> | undefined;

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onMutate: async ({ id }) => {
      // STEP 1
      await utils.notifications.feed.cancel();
      await utils.notifications.unreadCount.cancel();

      // STEP 2
      const previousData = {
        feed: utils.notifications.feed.getInfiniteData(),
        unreadCount: utils.notifications.unreadCount.getData(),
      };

      // STEP 3
      utils.notifications.feed.setInfiniteData({}, (oldData) => {
        if (!oldData) {
          return;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
          })),
        };
      });

      utils.notifications.unreadCount.setData(undefined, (oldData) => {
        if (!oldData) {
          return;
        }

        return Math.max(oldData - 1, 0);
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      utils.notifications.feed.setInfiniteData({}, context?.previousData.feed);

      utils.notifications.unreadCount.setData(
        undefined,
        context?.previousData.unreadCount,
      );

      toast({
        title: "Error marking as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (
    [
      "user_attending_experience",
      "user_unattending_experience",
      "user_commented_experience",
    ].includes(notification.type) &&
    notification.experienceId
  ) {
    linkProps = {
      to: "/experiences/$experienceId",
      params: { experienceId: notification.experienceId },
    };
  } else if (notification.type === "user_followed_user") {
    linkProps = {
      to: "/users/$userId",
      params: { userId: notification.fromUserId },
    };
  }
  return (
    <Link
      {...linkProps}
      variant="ghost"
      onClick={() =>
        !notification.read && markAsReadMutation.mutate({ id: notification.id })
      }
    >
      <Card className="flex w-full items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800">
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200">
            {notification.content}
          </p>
          <time className="text-sm text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString()}
          </time>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </Card>
    </Link>
  );
}
