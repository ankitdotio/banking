import z from "zod";

export const registerSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(8),
});

export type registerBody = z.infer<typeof registerSchema>;
