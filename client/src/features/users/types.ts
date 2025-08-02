import { User } from "@advanced-react/server/database/schema";

type UserHostedExperiencesCount = User & {
    hostedExperiencesCount: number;
}

export type UserForList = User;

export type UserForDetails = UserHostedExperiencesCount;