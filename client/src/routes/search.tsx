import { trpc, trpcQueryUtils } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
import { experienceFiltersSchema } from "@advanced-react/shared/schema/experience";

import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { ExperienceFilters } from "@/features/experiences/components/ExperienceFilters";

export const Route = createFileRoute("/search")({
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.tags.list.ensureData();
  },
  validateSearch: experienceFiltersSchema,
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const experiencesQuery = trpc.experiences.search.useInfiniteQuery(search, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!search.q || !!search.tags,
  });

  const [tags] = trpc.tags.list.useSuspenseQuery();

  return (
    <main className="space-y-4">
      <div className="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800">
        <ExperienceFilters
          onFiltersChange={(filters) => {
            navigate({
              search: filters,
            });
          }}
          initialFilters={search}
          tags={tags}
        />
      </div>
      <InfiniteScroll
        onLoadMore={!!search.q ? experiencesQuery.fetchNextPage : undefined}
      >
        <ExperienceList
          experiences={
            experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
            []
          }
          isLoading={
            experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
          }
          noExperiencesMessage={
            !!search.q ? "No experiences found" : "Search to find experiences"
          }
        />
      </InfiniteScroll>
    </main>
  );
}
