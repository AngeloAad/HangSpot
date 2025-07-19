import { trpc } from "@/router";
import { createFileRoute } from "@tanstack/react-router";
import { experienceFiltersSchema } from "@advanced-react/shared/schema/experience";

import { InfiniteScroll } from "@/features/shared/components/InfiniteScroll";
import { ExperienceList } from "@/features/experiences/components/ExperienceList";
import { ExperienceFilters } from "@/features/experiences/components/ExperienceFilters";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: experienceFiltersSchema,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const experiencesQuery = trpc.experiences.search.useInfiniteQuery(search, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!search.q,
  });

  return (
    <main className="space-y-4">
      <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
        <ExperienceFilters
          onFiltersChange={(filters) => {
            navigate({
              search: filters,
            });
          }}
          initialFilters={search}
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
