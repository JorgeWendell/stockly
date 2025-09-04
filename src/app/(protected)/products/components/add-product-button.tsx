"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertProductForm from "./upsert-product-form";

const AddProductButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh(); // Recarrega a página após adicionar produto
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <UpsertProductForm onSuccess={handleSuccess} />
    </Dialog>
  );
};

export default AddProductButton;
