"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

import UpsertProductForm from "./upsert-product-form";

const AddProductButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <UpsertProductForm />
    </Dialog>
  );
};

export default AddProductButton;
