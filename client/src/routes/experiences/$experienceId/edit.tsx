import { ExperienceForm } from "@/features/experiences/components/ExperienceForm";
import { isTRPCClientError, router, trpc } from "@/router";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/experiences/$experienceId/edit")({
  component: ExperienceEditPage,
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId),
    }),
  },
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    const { currentUser } = await trpcQueryUtils.auth.currentUser.ensureData();

    try {
      const experience = await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      });

      if (!currentUser || currentUser.id !== experience.userId) {
        throw redirect({
          to: "/experiences/$experienceId",
          params: { experienceId: experience.id },
        });
      }
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        throw notFound();
      }

      throw error;
    }
  },
});

function ExperienceEditPage() {
  const { experienceId } = Route.useParams();

  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });

  function navigateToExperience() {
    router.navigate({
      to: "/experiences/$experienceId",
      params: { experienceId },
    });
  }
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">
        Edit Experience
      </h1>
          <ExperienceForm
            experience={experience}
            onSuccess={navigateToExperience}
            onCancel={navigateToExperience}
          />
    </main>
  );
}
