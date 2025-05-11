import { z } from "zod";

export const profileSchema = z.object({
    image: z.instanceof(File).optional(),
    name: z.string().optional(),
    color: z.string().optional(),
});
