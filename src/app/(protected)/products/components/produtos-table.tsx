"use client";
import { Edit, TrashIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StocksTable } from "@/db/schema";

import UpsertProductForm from "./upsert-product-form";

type User = {
  id: string;
  name: string;
};

interface ProdutosTableProps {
  produtos: (typeof StocksTable.$inferSelect)[];
  users: User[];
}

const ProdutosTable = ({ produtos, users }: ProdutosTableProps) => {
  const [editingProduct, setEditingProduct] = useState<
    typeof StocksTable.$inferSelect | null
  >(null);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Usuário não encontrado";
  };

  const formatDepartment = (dept: string) => {
    const departments = {
      cozinha: "Cozinha",
      fabrica: "Fábrica",
      administracao: "Administração",
      geral: "Geral",
    };
    return departments[dept as keyof typeof departments] || dept;
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  const handleDeleteProductClick = (productId: string) => {
    // TODO: Implementar delete do produto
    console.log("Deletar produto:", productId);
  };

  const handleEditProduct = (product: typeof StocksTable.$inferSelect) => {
    setEditingProduct(product);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome do Produto</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Quantidade Atual</TableHead>
          <TableHead>Quantidade Mínima</TableHead>
          <TableHead>Departamento</TableHead>
          <TableHead>Data de Entrada</TableHead>
          <TableHead>Data de Saída</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={9}
              className="text-muted-foreground text-center"
            >
              Nenhum produto encontrado
            </TableCell>
          </TableRow>
        ) : (
          produtos.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.nameProduct}
              </TableCell>
              <TableCell>{formatPrice(product.priceInCents)}</TableCell>
              <TableCell>
                <span
                  className={`font-medium ${
                    product.quantityAtual <= product.quantityMin
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {product.quantityAtual}
                </span>
              </TableCell>
              <TableCell>{product.quantityMin}</TableCell>
              <TableCell>{formatDepartment(product.depto)}</TableCell>
              <TableCell>{formatDate(product.dateEntry)}</TableCell>
              <TableCell>{formatDate(product.dateExit)}</TableCell>
              <TableCell>{getUserName(product.userId)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {editingProduct && editingProduct.id === product.id && (
                      <UpsertProductForm />
                    )}
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProductClick(product.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ProdutosTable;
