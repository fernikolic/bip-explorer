import { z } from "zod";

export const bipSchema = z.object({
  number: z.number(),
  title: z.string(),
  authors: z.array(z.string()),
  status: z.enum(['Draft', 'Proposed', 'Active', 'Final', 'Deferred', 'Rejected', 'Withdrawn', 'Replaced', 'Obsolete']),
  type: z.enum(['Standards Track', 'Informational', 'Process']),
  created: z.string(),
  abstract: z.string(),
  content: z.string(),
  eli5: z.string().optional(),
  filename: z.string(),
  githubUrl: z.string(),
  lastModified: z.string().optional(),
  replaces: z.array(z.number()).optional(),
  replacedBy: z.array(z.number()).optional(),
  layer: z.string().optional(),
  comments: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export const authorSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  bipCount: z.number(),
  bips: z.array(z.number()),
});

export const statsSchema = z.object({
  totalBips: z.number(),
  finalBips: z.number(),
  activeBips: z.number(),
  draftBips: z.number(),
  contributors: z.number(),
  standardsTrack: z.number(),
  informational: z.number(),
  process: z.number(),
});

export type Bip = z.infer<typeof bipSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Stats = z.infer<typeof statsSchema>;

export const insertBipSchema = bipSchema.omit({ lastModified: true });
export type InsertBip = z.infer<typeof insertBipSchema>;
