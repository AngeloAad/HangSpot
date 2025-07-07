import { Experience, User } from "@advanced-react/server/database/schema";

//
/**
 * A utility type that "prettifies" complex intersection types in TypeScript.
 * 
 * When working with complex types (especially intersections), TypeScript's type
 * hints can become hard to read. This type recursively expands the properties
 * of the input type T, making the type more readable in IDE tooltips and error
 * messages while maintaining the exact same type structure.
 * 
 * The `& {}` at the end is a clever trick that forces TypeScript to display
 * the expanded type rather than the original type name.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithCommentsCount = ExperienceWithUser & {
  commentsCount: number;
};

export type ExperienceForList = Prettify<ExperienceWithCommentsCount>;
