import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { UserList } from "@/features/users/components/UserList";
import { isTRPCClientError, trpc } from "@/router";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/users/$userId/following")({
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.users.following.fetchInfinite({
        id: params.userId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  component: UserFollowingPage,
});

function UserFollowingPage() {
  const { userId } = Route.useParams();

  const [{ pages }, userFollowingQuery] =
    trpc.users.following.useSuspenseInfiniteQuery(
      { id: userId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const totalFollowing = pages[0].followingCount;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Followings ({totalFollowing})</h1>

      <InfiniteScroll onLoadMore={userFollowingQuery.fetchNextPage}>
        <UserList
          users={pages.flatMap((page) => page.items)}
          isLoading={userFollowingQuery.isFetchingNextPage}
        />
      </InfiniteScroll>
    </main>
  );
}
