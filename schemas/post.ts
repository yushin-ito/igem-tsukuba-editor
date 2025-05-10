import { z } from "zod";

export const editorSchema = z.object({
  title: z.string().min(3).max(128),
  content: z.any().optional(),
});

export const translatorSchema = z.object({
  translation: z.string().min(3).max(128),
});

export const tableSchema = z.object({
  id: z.string(),
  title: z.string(),
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authors: z
    .object({
      id: z.string(),
      name: z.string().nullable(),
      image: z.string().nullable(),
    })
    .array(),
});
