import { Comment, Experience, User } from "@advanced-react/server/database/schema";

// Utility type to flatten intersection types for better IDE hover readability
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CommentWithUser = Comment & {
  user: User;
};

type CommentWithExperience = Comment & {
  experience: Experience;
};

export type CommentForList = Prettify<CommentWithUser & CommentWithExperience>;

export type CommentOptimistic = Prettify<CommentForList & {
  optimistic: true;
}>;