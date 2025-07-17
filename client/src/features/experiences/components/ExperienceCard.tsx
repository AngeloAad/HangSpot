import Card from "@/features/shared/components/ui/Card";
import { ExperienceForList } from "../types";
import { LinkIcon, MessageSquare } from "lucide-react";
import Link from "@/features/shared/components/ui/Link";
import { Button } from "@/features/shared/components/ui/Button";
import { UserAvatar } from "@/features/users/components/UserAvatar";

type ExperienceCardProps = {
  experience: ExperienceForList;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <ExperienceCardMedia experience={experience} />
      <div className="flex items-start gap-4 p-4">
        <ExperienceCardAvatar experience={experience} />
        <div className="w-full space-y-4">
          <ExperienceCardHeader experience={experience} />
          <ExperienceCardContent experience={experience} />
          <ExperienceCardMetadata experience={experience} />
          <ExperienceCardMetricButtons experience={experience} />
        </div>
      </div>
    </Card>
  );
}

/***************************************/
/* EXPERIENCE CARD MEDIA COMPONENT BELOW */
/***************************************/
type ExperienceCardMediaProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardMedia({ experience }: ExperienceCardMediaProps) {
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
/* EXPERIENCE CARD AVATAR COMPONENT BELOW */
/***************************************/
type ExperienceCardAvatarProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardAvatar({ experience }: ExperienceCardAvatarProps) {
  return (
    <div>
      <Link to="/users/$userId" params={{ userId: experience.userId }} variant="ghost">
        <UserAvatar user={experience.user} showName={false} />
      </Link>
    </div>
  );
}

/***************************************/
/* EXPERIENCE CARD HEADER COMPONENT BELOW */
/***************************************/
type ExperienceCardHeaderProps = Pick<ExperienceCardProps, "experience">;

function ExperienceCardHeader({ experience }: ExperienceCardHeaderProps) {
  return (
    <div>
      <Link to="/users/$userId" params={{ userId: experience.userId }} variant="ghost">
        <p className="text-muted-foreground text-sm">{experience.user.name}</p>
      </Link>
      <Link
        to="/experiences/$experienceId"
        params={{ experienceId: experience.id }}
      >
        <h2 className="text-lg font-semibold">{experience.title}</h2>
      </Link>
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
      <Button variant="link" asChild>
        <Link
          to="/experiences/$experienceId"
          params={{ experienceId: experience.id }}
          variant="ghost"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{experience.commentsCount}</span>
        </Link>
      </Button>
    </div>
  );
}
