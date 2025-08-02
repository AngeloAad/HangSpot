import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithUserContext = Experience & {
  isAttending: boolean;
};

type ExperienceWithCommentsCount = Experience & {
  commentsCount: number;
};

type ExperienceWithAttendeesCount = Experience & {
  attendeesCount: number;
};

type ExperienceWithAttendees = Experience & {
  attendees: [];
};

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceWithAttendees;

export type ExperienceForDetails = ExperienceWithUser &
  ExperienceWithUserContext &
  ExperienceWithCommentsCount &
  ExperienceWithAttendeesCount &
  ExperienceWithAttendees;
