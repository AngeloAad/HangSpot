import { ExperienceCard } from "./ExperienceCard";
import Spinner from "@/features/shared/components/ui/Spinner";
import { ExperienceForList } from "../types";

type ExperienceListProps = {
  experiences: ExperienceForList[];
  isLoading: boolean;
  noExperiencesMessage?: string;
};

export function ExperienceList({
  experiences,
  isLoading,
  noExperiencesMessage = "No experiences found",
}: ExperienceListProps) {
  return (
    <div>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && experiences.length === 0 && (
        <div className="flex justify-center">{noExperiencesMessage}</div>
      )}
      {!isLoading && experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
}
