import { User } from "@advanced-react/server/database/schema";

type UserHostedExperiencesCount = User & {
    hostedExperiencesCount: number;
}

export type UserForDetails = UserHostedExperiencesCount;