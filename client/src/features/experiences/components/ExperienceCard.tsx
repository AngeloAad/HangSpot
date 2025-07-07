import Card from "@/features/shared/components/ui/Card";
import { ExperienceForList } from "../types";
import { LinkIcon, MessageSquare } from "lucide-react";
import { CommentsSection } from "@/features/comments/components/CommentsSection";

type ExperienceCardProps = {
  experience: ExperienceForList;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <ExperienceCardImage experience={experience} />
      <div className="w-full space-y-4 p-4">
        <ExperienceCardHeader experience={experience} />
        <ExperienceCardContent experience={experience} />
        <ExperienceCardMetadata experience={experience} />
        <ExperienceCardMetricButtons experience={experience} />
        <CommentsSection experienceId={experience.id} commentsCount={experience.commentsCount} />
      </div>
    </Card>
  );
}

/***************************************/
/* EXPERIENCE CARD IMAGE COMPONENT BELOW */
/***************************************/
type ExperienceCardImageProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardImage({ experience }: ExperienceCardImageProps) {
  if (!experience.imageUrl) {
    return null;
  }

  return (
    <div className="aspect-video w-full">
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/***************************************/
/* EXPERIENCE CARD HEADER COMPONENT BELOW */
/***************************************/
type ExperienceCardHeaderProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardHeader({ experience }: ExperienceCardHeaderProps) {
  if (!experience.title) {
    return null;
  }

  return (
    <div>
      <p className="text-muted-foreground text-sm">{experience.user.name}</p>
      <h2 className="text-lg font-semibold">{experience.title}</h2>
    </div>
  );
}

/***************************************/
/* EXPERIENCE CARD CONTENT COMPONENT BELOW */
/***************************************/
type ExperienceCardContentProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardContent({ experience }: ExperienceCardContentProps) {
  return <p>{experience.content}</p>;
}

/***************************************/
/* EXPERIENCE CARD METADATA COMPONENT BELOW */
/***************************************/
type ExperienceCardMetadataProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardMetadata({ experience }: ExperienceCardMetadataProps) {
  return (
    <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
      <time>{new Date(experience.scheduledAt).toLocaleDateString()}</time>
      {experience.url && (
        <div className="flex items-center gap-2">
          <LinkIcon
            size={16}
            className="text-secondary-500 dark:text-primary-500"
          />
          <a
            href={experience.url}
            target="_blank"
            className="text-secondary-500 dark:text-primary-500 hover:underline"
          >
            Event Details
          </a>
        </div>
      )}
    </div>
  );
}

/***************************************/
/* EXPERIENCE CARD METRIC BUTTONS COMPONENT BELOW */
/***************************************/
type ExperienceCardMetricButtonsProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardMetricButtons({
  experience,
}: ExperienceCardMetricButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <MessageSquare className="h-5 w-5" />
      <span>{experience.commentsCount}</span>
    </div>
  );
}
