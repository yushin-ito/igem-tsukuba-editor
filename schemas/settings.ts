import { z } from "zod";

export const profileSchema = z.object({
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "file_too_large",
    }),
  name: z
    .string()
    .min(3, { message: "name_too_short" })
    .max(24, { message: "name_too_long" })
    .optional(),
  color: z.string().optional(),
});
