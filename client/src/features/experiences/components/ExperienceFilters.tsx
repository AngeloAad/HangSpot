import { Button } from "@/features/shared/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { MultiSelect } from "@/features/shared/components/ui/MultiSelect";
import { Tag } from "@advanced-react/server/database/schema";
import {
  ExperienceFilterParams,
  experienceFiltersSchema,
} from "@advanced-react/shared/schema/experience";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

type ExperienceFiltersProps = {
  onFiltersChange: (filters: ExperienceFilterParams) => void;
  initialFilters?: ExperienceFilterParams;
  tags: Tag[];
};

export function ExperienceFilters({
  onFiltersChange,
  initialFilters,
  tags,
}: ExperienceFiltersProps) {
  const form = useForm<ExperienceFilterParams>({
    resolver: zodResolver(experienceFiltersSchema),
    defaultValues: initialFilters,
  });

  const handleSubmit = form.handleSubmit((values) => {
    const filters: ExperienceFilterParams = {};

    if (values.q?.trim()) {
      filters.q = values.q.trim();
    }

    if (values.tags) {
      filters.tags = values.tags;
    }

    onFiltersChange(filters);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="search"
                  value={field.value ?? ""}
                  placeholder="Search for an Experience"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <MultiSelect
              options={tags.map((tag) => ({
                value: tag.id.toString(),
                label: tag.name,
              }))}
              onValueChange={(tags) => {
                field.onChange(tags.map(Number));
              }}
              defaultValue={field.value?.map((tag) => tag.toString())}
              placeholder="Select tags..."
            />
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
    </Form>
  );
}
