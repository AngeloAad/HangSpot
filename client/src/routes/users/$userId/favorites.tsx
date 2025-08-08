import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { isTRPCClientError, trpc } from "@/router";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/users/$userId/favorites")({
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    try {
      await trpcQueryUtils.experiences.favorites.fetchInfinite({});

      if (!currentUser || currentUser.id !== currentUser.id) {
        throw redirect({
          to: "/users/$userId",
          params: { userId: params.userId },
        });
      }
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { userId } = Route.useParams();

  const [{ pages }, favoritesQuery] =
    trpc.experiences.favorites.useSuspenseInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const experiences = pages.flatMap((p) => p.experiences);
  const favoritesCount = experiences.length;

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Favorites ({favoritesCount})</h1>

      <InfiniteScroll onLoadMore={favoritesQuery.fetchNextPage}>
        <ExperienceList
          experiences={experiences}
          isLoading={favoritesQuery.isFetchingNextPage}
          noExperiencesMessage="No favorites yet"
        />
      </InfiniteScroll>
    </main>
  );
}
