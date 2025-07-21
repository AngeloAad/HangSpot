import { router, trpc } from "@/router";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { userCredentialsSchema } from "@advanced-react/shared/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/features/shared/hooks/useToast";
import Link from "@/features/shared/components/ui/Link";

const registerCredentialsSchema = userCredentialsSchema;

type registerFormData = z.infer<typeof registerCredentialsSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const form = useForm<registerFormData>({
    resolver: zodResolver(registerCredentialsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.currentUser.invalidate();

      router.navigate({ to: "/" });

      toast({
        title: "Account Created",
        description: "You are now signed in to Hangspot",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create account",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: registerFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="name" placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>

        <Link
          to="/login"
          className="flex items-center justify-center"
          variant="secondary"
        >
          Already have an account? <span className="font-bold">Login</span>
        </Link>
      </form>
    </Form>
  );
}
