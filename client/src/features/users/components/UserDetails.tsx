import Card from "@/features/shared/components/ui/Card";
import { UserForDetails } from "../types";
import { UserAvatar } from "./UserAvatar";
import { Martini } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserEditDialog } from "./UserEditDialog";
import Link from "@/features/shared/components/ui/Link";
import { UserFollowButton } from "./UserFollowButton";

type UserDetailsProps = {
  user: UserForDetails;
};

export const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="space-y-4">
      <UserDetailsHeader user={user} />
      <UserDetailsHostStats user={user} />
    </div>
  );
};

type UserDetailsHeaderProps = Pick<UserDetailsProps, "user">;

function UserDetailsHeader({ user }: UserDetailsHeaderProps) {
  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <UserAvatar
        user={user}
        showName={false}
        className="h-20 w-20"
        avatarClassName="text-4xl"
      />
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        {user.bio && <p className="mt-2 dark:text-neutral-400">{user.bio}</p>}
      </div>

      <UserProfileStats user={user} />
      <UserProfileButton user={user} />
    </Card>
  );
}

type UserProfileStatsProps = Pick<UserDetailsProps, "user">;

function UserProfileStats({ user }: UserProfileStatsProps) {
  const stats = [
    {
      label: "Followers",
      value: user.followersCount,
      to: `/users/$userId/followers`,
      params: {
        userId: user.id,
      },
    },
    {
      label: "Following",
      value: user.followingCount,
      to: `/users/$userId/following`,
      params: {
        userId: user.id,
      },
    },
  ] as const;

  return (
    <div className="flex w-full justify-center gap-12 border-y-2 border-neutral-200 py-4 dark:border-neutral-800">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          to={stat.to}
          params={stat.params}
          variant="ghost"
          className="text=center"
        >
          <div className="dark:text-primary-500 text-secondary-500 text-center text-2xl font-bold">
            {stat.value}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {stat.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

type UserDetailsHostStatsProps = Pick<UserDetailsProps, "user">;

function UserDetailsHostStats({ user }: UserDetailsHostStatsProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 p-4">
      <div className="space-y-3 text-center">
        <p className="text-muted-foreground text-lg">Hosted Experiences</p>
        <div className="flex items-center justify-center gap-1">
          <Martini className="h-6 w-6" />
          <span className="dark:text-primary-500 text-xl font-bold">
            {user.hostedExperiencesCount}
          </span>
        </div>
      </div>
    </Card>
  );
}

type UserProfileButtonProps = {
  user: UserForDetails;
};

function UserProfileButton({ user }: UserProfileButtonProps) {
  const { currentUser } = useCurrentUser();
  const isCurrentUser = currentUser?.id === user.id;

  return isCurrentUser ? (
    <UserEditDialog user={user} />
  ) : (
    <UserFollowButton targetUsetId={user.id} isFollowing={user.isFollowing} />
  );

  return null;
}
