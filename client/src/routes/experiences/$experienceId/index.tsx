import { ExperienceDetails } from "@/features/experiences/components/ExperienceDetails";
import { CommentsSection } from "@/features/comments/components/CommentsSection";
import { isTRPCClientError, trpc } from "@/router";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/experiences/$experienceId/")({
  component: ExperienceIdPage,
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
});

function ExperienceIdPage() {
  const { experienceId } = Route.useParams();

  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });
  return (
    <div className="flex flex-col gap-4">
      <ExperienceDetails experience={experience} />
      <CommentsSection
        experienceId={experienceId}
        commentsCount={experience.commentsCount}
      />
    </div>
  );
}
