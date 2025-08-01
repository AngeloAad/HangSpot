import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Link as LinkIcon, Type } from "lucide-react";

import { Experience } from "@advanced-react/server/database/schema";
import { experienceValidationSchema } from "@advanced-react/shared/schema/experience";

import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import FileInput from "@/features/shared/components/ui/FileInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { TextArea } from "@/features/shared/components/ui/TextArea";

import { useExperienceMutations } from "../hooks/useExperienceMutations";

type ExperienceFormData = z.infer<typeof experienceValidationSchema>;

type ExperienceFormProps = {
  experience: Experience;
  onSuccess?: (id: Experience["id"]) => void;
  onCancel?: (id: Experience["id"]) => void;
};

export function ExperienceForm({
  experience,
  onSuccess,
  onCancel,
}: ExperienceFormProps) {
  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceValidationSchema),
    defaultValues: {
      id: experience.id,
      title: experience.title,
      content: experience.content,
      url: experience.url,
      scheduledAt: experience.scheduledAt,
      location: experience.location
        ? JSON.parse(experience.location)
        : undefined,
    },
  });

  const { editExperienceMutation } = useExperienceMutations({
    edit: {
      onSuccess,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (key === "location") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    }

    editExperienceMutation.mutate(formData);
  });

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <Type className="h-4 w-4" />
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter an engaging title for your experience"
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <FileText className="h-4 w-4" />
                    Content
                  </FormLabel>
                  <FormControl>
                    <TextArea
                      {...field}
                      placeholder="Share the details of your experience..."
                      className="min-h-[120px] resize-none text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base font-semibold">
                    <LinkIcon className="h-4 w-4" />
                    Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="https://example.com (optional)"
                      type="url"
                      className="h-11 text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileInput
                      accept="image/*"
                      onChange={(event) => {
                        field.onChange(event.target?.files?.[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onCancel?.(experience.id)}
                className="h-11 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editExperienceMutation.isPending}
                className="h-11 text-sm"
              >
                {editExperienceMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
