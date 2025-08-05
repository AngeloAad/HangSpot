import { User } from "@advanced-react/server/database/schema";

type UserHostedExperiencesCount = User & {
  hostedExperiencesCount: number;
};

type UserWithFollowCounts = User & {
  followersCount: number;
  followingCount: number;
};

export type UserWithUserContext = User & {
  isFollowing: boolean;
};

export type UserForList = User & UserWithUserContext;

export type UserForDetails = UserHostedExperiencesCount &
  UserWithFollowCounts &
  UserWithUserContext;
