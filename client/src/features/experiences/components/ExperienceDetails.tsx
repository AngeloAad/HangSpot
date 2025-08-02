import Card from "@/features/shared/components/ui/Card";
import { ExperienceForDetails } from "../types";
import { LinkIcon } from "lucide-react";
import { Button } from "@/features/shared/components/ui/Button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import Link from "@/features/shared/components/ui/Link";
import ExperienceDeleteDialog from "./ExperienceDeleteDialog";
import { router } from "@/router";
import ExperienceAttendButton from "./ExperienceAttendButton";

type ExperienceDetailsProps = {
  experience: ExperienceForDetails;
};

export const ExperienceDetails = ({ experience }: ExperienceDetailsProps) => {
  return (
    <Card className="p-0">
      <ExperienceDetailsMedia experience={experience} />
      <div className="space-y-4 p-4">
        <ExperienceDetailsContent experience={experience} />
        <ExperienceDetailsHeader experience={experience} />
        <ExperienceDetailsMeta experience={experience} />
        <ExperienceDetailsActionButtons experience={experience} />
      </div>
    </Card>
  );
};

type ExperienceDetailsMediaProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsMedia({ experience }: ExperienceDetailsMediaProps) {
  if (!experience.imageUrl) {
    return null;
  }

  return (
    <div className="relative h-64 w-full">
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

type ExperienceDetailsHeaderProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsHeader({ experience }: ExperienceDetailsHeaderProps) {
  return <h1 className="text-2xl font-bold">{experience.title}</h1>;
}

type ExperienceDetailsContentProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsContent({
  experience,
}: ExperienceDetailsContentProps) {
  return (
    <p className="text-lg text-neutral-600 dark:text-neutral-400">
      {experience.content}
    </p>
  );
}

type ExperienceDetailsMetaProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsMeta({ experience }: ExperienceDetailsMetaProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <time className="text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(experience.scheduledAt).toLocaleDateString()}
        </time>
      </div>

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

type ExperienceDetailsActionButtonsProps = Pick<
  ExperienceDetailsProps,
  "experience"
>;

function ExperienceDetailsActionButtons({
  experience,
}: ExperienceDetailsActionButtonsProps) {
  const { currentUser } = useCurrentUser();

  const isPostOwner = currentUser?.id === experience.userId;

  if (isPostOwner) {
    return <ExperienceDetailsOwnerButtons experience={experience} />;
  }

  if (currentUser) {
    return (
      <ExperienceAttendButton
        experienceId={experience.id}
        isAttending={experience.isAttending}
      />
    );
  }

  return null;
}

type ExperienceDetailsOwnerButtonsProps = Pick<
  ExperienceDetailsProps,
  "experience"
>;

function ExperienceDetailsOwnerButtons({
  experience,
}: ExperienceDetailsOwnerButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link
          to="/experiences/$experienceId/edit"
          params={{ experienceId: experience.id }}
          variant="ghost"
        >
          <span>Edit</span>
        </Link>
      </Button>

      <ExperienceDeleteDialog
        experience={experience}
        onSuccess={() => {
          router.navigate({
            to: "/",
          });
        }}
        buttonClassName="border p-2 border-neutral-800 hover:bg-neutral-700"
      />
    </div>
  );
}
