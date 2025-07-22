import Card from "@/features/shared/components/ui/Card";
import { UserForDetails } from "../types";
import { UserAvatar } from "./UserAvatar";
import { Martini } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserEditDialog } from "./UserEditDialog";

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

      <UserProfileButton user={user} />
    </Card>
  );
}

type UserDetailsHostStatsProps = Pick<UserDetailsProps, "user">;

function UserDetailsHostStats({ user }: UserDetailsHostStatsProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 p-4">
      <div className="text-center space-y-3">
        <p className="text-lg text-muted-foreground">Hosted Experiences</p>
        <div className="flex items-center justify-center gap-1">
          <Martini className="h-6 w-6" />
          <span className="dark:text-primary-500 font-bold text-xl">
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

  if (isCurrentUser) {
    return <UserEditDialog user={user} />
  }

  return null;
}