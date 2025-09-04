import z from "zod";

export const upsertProductsSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, "Nome é obrigatório"),
    priceInCents: z.string().min(1, "Preço é obrigatório"),
    quantityAtual: z.string().min(1, "Quantidade atual é obrigatória"),
    quantityMin: z.string().min(1, "Quantidade mínima é obrigatória"),
    depto: z.enum(["cozinha", "fabrica", "administracao", "geral"]),
    dateEntry: z.date(),
    dateExit: z.date().optional(),
    userId: z.string().min(1, "Usuário é obrigatório"),
  })
  .refine(
    (data) => {
      const qtyAtual = parseInt(data.quantityAtual);
      const qtyMin = parseInt(data.quantityMin);
      return qtyAtual > qtyMin;
    },
    {
      message: "Quantidade atual deve ser maior que a quantidade mínima",
      path: ["quantityAtual"], // Mostra o erro no campo quantidade atual
    },
  );

export type UpsertProductsSchema = z.infer<typeof upsertProductsSchema>;
