import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { ErrorComponent } from "@/features/shared/components/ErrorComponent";
import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { UserDetails } from "@/features/users/components/UserDetails";
import { trpc } from "@/router";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { isTRPCClientError } from "@trpc/react-query";
import { z } from "zod";

export const Route = createFileRoute("/users/$userId/")({
  component: UserIdPage,
  params: {
    parse: (params) => ({
      userId: z.coerce.number().parse(params.userId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.users.byId.ensureData({
        id: params.userId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
});

function UserIdPage() {
  const { userId } = Route.useParams();

  const [user] = trpc.users.byId.useSuspenseQuery({ id: userId });

  const userExperiences = trpc.experiences.byUserId.useInfiniteQuery(
    {
      id: userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  if (userExperiences.error) <ErrorComponent />;

  return (
    <div className="flex flex-col gap-4">
      <UserDetails user={user} />

      <h2 className="text-2xl font-bold">Experiences</h2>
      <InfiniteScroll onLoadMore={userExperiences.fetchNextPage}>
        <ExperienceList
          experiences={
            userExperiences.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            userExperiences.isLoading || userExperiences.isFetchingNextPage
          }
        />
      </InfiniteScroll>
    </div>
  );
}
