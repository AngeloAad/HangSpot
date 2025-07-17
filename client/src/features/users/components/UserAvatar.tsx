import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import { User } from "@advanced-react/server/database/schema";

type UserAvatarProps = {
  user: User;
  showName?: boolean;
  nameClassName?: string;
  avatarClassName?: string;
  className?: string;
};

export const UserAvatar = ({
  user,
  showName = true,
  nameClassName = "",
  avatarClassName = "",
  className = "",
}: UserAvatarProps) => {
  return (
    <div className={cn("flex items-center gap-2")}>
      <Avatar className={className}>
        <AvatarImage
          src={user.avatarUrl ?? undefined}
          className="object-cover"
        />
        <AvatarFallback className={cn("font-bold tracking-wider", avatarClassName)}>
          {user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span
          className={cn(
            "text-neutral-600 dark:text-neutral-400",
            nameClassName,
          )}
        >
          {user.name}
        </span>
      )}
    </div>
  );
};
