"use server";

import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { StocksTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertProductsSchema } from "./schema";

export const upsertProducts = actionClient
  .schema(upsertProductsSchema)
  .action(async ({ parsedInput }) => {
    console.log("=== DEBUG ACTION ===");
    console.log("Input recebido:", parsedInput);

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("Session:", session?.user?.id);

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter strings para números e gerar ID se necessário
    const isUpdate = !!parsedInput.id;
    const productData = {
      id: parsedInput.id || randomUUID(),
      nameProduct: parsedInput.name,
      priceInCents: Math.round(parseFloat(parsedInput.priceInCents) * 100), // Converte para centavos
      quantityAtual: parseInt(parsedInput.quantityAtual),
      quantityMin: parseInt(parsedInput.quantityMin),
      depto: parsedInput.depto,
      dateEntry: parsedInput.dateEntry,
      dateExit: parsedInput.dateExit,
      userId: parsedInput.userId,
    };

    console.log("Dados processados:", productData);
    console.log("É atualização?", isUpdate);
    console.log("ID do produto:", parsedInput.id);

    try {
      if (isUpdate) {
        // Atualizar produto existente
        await db
          .update(StocksTable)
          .set({
            nameProduct: productData.nameProduct,
            priceInCents: productData.priceInCents,
            quantityAtual: productData.quantityAtual,
            quantityMin: productData.quantityMin,
            depto: productData.depto,
            dateEntry: productData.dateEntry,
            dateExit: productData.dateExit,
            userId: productData.userId,
            updatedAt: new Date(),
          })
          .where(eq(StocksTable.id, productData.id));
        console.log("✅ Produto atualizado com sucesso!");
      } else {
        // Inserir novo produto
        await db.insert(StocksTable).values(productData);
        console.log("✅ Produto inserido com sucesso!");
      }
    } catch (error) {
      console.error("❌ Erro ao processar produto:", error);
      throw error;
    }
  });
