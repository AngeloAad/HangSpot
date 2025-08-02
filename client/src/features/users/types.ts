import { User } from "@advanced-react/server/database/schema";

type UserHostedExperiencesCount = User & {
  hostedExperiencesCount: number;
};

type UserWithFollowCounts = User & {
  followersCount: number;
  followingCount: number;
};

export type UserForList = User;

export type UserForDetails = UserHostedExperiencesCount & UserWithFollowCounts;