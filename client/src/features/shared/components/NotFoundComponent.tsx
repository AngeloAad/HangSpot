import { CircleAlert, RefreshCcw } from "lucide-react";
import Card from "./ui/Card";
import { Button } from "./ui/Button";
import Link from "./ui/Link";

export const NotFoundComponent = () => {
  return (
    <Card className="flex flex-col items-center justify-center gap-2">
      <CircleAlert className="h-8 w-8" />
      <p className="text-lg font-bold">
        The page you are looking for does not exist.
      </p>
      <Button variant="ghost" asChild>
        <Link to="/">
          <RefreshCcw className="h-4 w-4" />
          Go back to the home page
        </Link>
      </Button>
    </Card>
  );
};
