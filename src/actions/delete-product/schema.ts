import { z } from "zod";

export const deleteProductSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;
