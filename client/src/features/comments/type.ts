import {
  Comment,
  Experience,
  User,
} from "@advanced-react/server/database/schema";

// Utility type to flatten intersection types for better IDE hover readability
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type CommentWithUser = Comment & {
  user: User;
};

type CommentWithUserContext = Comment & {
  isLiked: boolean;
};

type CommentWithLikesCount = Comment & {
  likesCount: number;
};

type CommentWithExperience = Comment & {
  experience: Experience;
};

export type CommentForList = Prettify<
  CommentWithUser &
    CommentWithUserContext &
    CommentWithLikesCount &
    CommentWithExperience
>;

export type CommentOptimistic = Prettify<
  CommentWithUser &
    CommentWithExperience &
    CommentWithUserContext &
    CommentWithLikesCount & {
      optimistic: true;
    }
>;
