"use client";
import { Edit, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteProduct } from "@/actions/delete-product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

interface ProductsTableProps {
  products: (typeof StocksTable.$inferSelect)[];
}

const ProductsTable = ({ products }: ProductsTableProps) => {
  const router = useRouter();
  const [editingProduct, setEditingProduct] = useState<
    typeof StocksTable.$inferSelect | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatDepartment = (depto: string) => {
    const departments = {
      cozinha: "Cozinha",
      fabrica: "Fábrica",
      administracao: "Administração",
      geral: "Geral",
    };
    return departments[depto as keyof typeof departments] || depto;
  };

  const deleteProductAction = useAction(deleteProduct, {
    onSuccess: () => {
      toast.success("Produto excluído com sucesso");
      router.refresh(); // Recarrega a página
    },
    onError: () => {
      toast.error("Erro ao excluir produto");
    },
  });

  const handleDeleteProductClick = (productId: string) => {
    if (
      confirm(
        "Tem certeza que quer deletar esse produto? Essa ação não pode ser revertida.",
      )
    ) {
      deleteProductAction.execute({ id: productId });
    }
  };

  const handleEditProduct = (product: typeof StocksTable.$inferSelect) => {
    setEditingProduct(product);
  };

  const handleCloseEditDialog = () => {
    setEditingProduct(null);
    router.refresh(); // Recarrega a página após edição
  };

  // Filtrar produtos baseado no termo de busca
  const filteredProducts = products.filter(
    (product) =>
      product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDepartment(product.depto)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Campo de busca */}
      <div className="mb-4">
        <Input
          placeholder="Buscar por nome do produto ou departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Quantidade Atual</TableHead>
            <TableHead>Quantidade Mínima</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead>Data de Saída</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-muted-foreground text-center"
              >
                {searchTerm
                  ? "Nenhum produto encontrado para a busca"
                  : "Nenhum produto encontrado"}
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.nameProduct}
                </TableCell>
                <TableCell>{formatPrice(product.priceInCents)}</TableCell>
                <TableCell
                  className={
                    product.quantityAtual <= product.quantityMin
                      ? "font-semibold text-red-600"
                      : ""
                  }
                >
                  {product.quantityAtual}
                </TableCell>
                <TableCell>{product.quantityMin}</TableCell>
                <TableCell>{formatDepartment(product.depto)}</TableCell>
                <TableCell>{formatDate(product.dateEntry)}</TableCell>
                <TableCell>{formatDate(product.dateExit)}</TableCell>
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
                        <UpsertProductForm
                          product={editingProduct}
                          onSuccess={handleCloseEditDialog}
                        />
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
    </>
  );
};

export default ProductsTable;
