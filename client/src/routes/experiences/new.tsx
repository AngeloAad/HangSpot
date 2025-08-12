import { ExperienceForm } from "@/features/experiences/components/ExperienceForm";
import { router } from "@/router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/experiences/new")({
  component: CreateExperiencePage,
});

function CreateExperiencePage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Create Experience</h1>
      <ExperienceForm
        onSuccess={(id) => {
          router.navigate({
            to: "/experiences/$experienceId",
            params: { experienceId: id },
          });
        }}
        onCancel={() => router.history.back()}
      />
    </main>
  );
}
