import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

const productSchema = z
  .object({
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

const UpsertProductForm = () => {
  const session = authClient.useSession();
  const [accessLevelApi, setAccessLevelApi] = useState<string>("");
  const userIdFromSession = session.data?.user.id ?? "";

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      priceInCents: "",
      quantityAtual: "",
      quantityMin: "",
      depto: "geral",
      dateEntry: new Date(),
      dateExit: undefined,
      userId: "",
    },
  });

  // Atualiza o userId quando a sessão carregar
  useEffect(() => {
    if (session.data?.user.id) {
      form.setValue("userId", session.data.user.id);
    }
  }, [session.data?.user.id, form]);

  // Busca o access level real via API quando tivermos userId
  useEffect(() => {
    let aborted = false;
    async function fetchAccessLevel() {
      if (!userIdFromSession) return;
      try {
        const res = await fetch(
          `/api/me?userId=${encodeURIComponent(userIdFromSession)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { accessLevel?: string | null };
        if (!aborted && data?.accessLevel) {
          setAccessLevelApi(String(data.accessLevel));
        }
      } catch {}
    }
    fetchAccessLevel();
    return () => {
      aborted = true;
    };
  }, [userIdFromSession]);
  function onSubmit(values: z.infer<typeof productSchema>) {
    const productData = {
      ...values,
      priceInCents: parseInt(values.priceInCents) * 100, // Converte para centavos
      quantityAtual: parseInt(values.quantityAtual),
      quantityMin: parseInt(values.quantityMin),
    };
    console.log(productData);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Produto</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue?.toString() || "");
                    }}
                    decimalScale={2}
                    fixedDecimalScale={false}
                    decimalSeparator=","
                    allowNegative={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$"
                    placeholder="0,00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantityAtual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade Atual</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a quantidade atual do produto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantityMin"
            render={({ field }) => {
              // Verificar se o usuário pode editar quantidade mínima (por access level)
              const rawAccessLevel =
                accessLevelApi ||
                (session.data?.user as { accessLevel?: string })?.accessLevel ||
                (session.data?.user as { access_level?: string })
                  ?.access_level ||
                "";
              const normalizedAccessLevel = String(rawAccessLevel)
                .toLowerCase()
                .trim();

              // Fallback temporário para nome enquanto accessLevel não estiver 100% disponível
              const rawUserName = session.data?.user?.name ?? "";
              const normalizedUserName = rawUserName.toLowerCase().trim();

              const allowed = ["diretoria", "administrador"];
              const canEditQuantityMin =
                (normalizedAccessLevel &&
                  allowed.includes(normalizedAccessLevel)) ||
                (!normalizedAccessLevel &&
                  allowed.includes(normalizedUserName));

              return (
                <FormItem>
                  <FormLabel>Quantidade Mínima</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        canEditQuantityMin
                          ? "Digite a quantidade mínima do produto"
                          : "Apenas responsáveis podem alterar"
                      }
                      {...field}
                      disabled={!canEditQuantityMin}
                      className={
                        !canEditQuantityMin
                          ? "cursor-not-allowed bg-gray-50"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {!canEditQuantityMin && (
                    <p className="text-muted-foreground text-xs">
                      Apenas responsáveis podem alterar
                    </p>
                  )}
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="depto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cozinha">Cozinha</SelectItem>
                      <SelectItem value="fabrica">Fábrica</SelectItem>
                      <SelectItem value="administracao">
                        Administração
                      </SelectItem>
                      <SelectItem value="geral">Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateEntry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Entrada</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Digite a data de entrada do produto"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateExit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Saída</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Data de saída será preenchida automaticamente"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled
                    className="cursor-not-allowed bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={() => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Usuário logado"
                    value={session.data?.user.name || "Carregando..."}
                    readOnly
                    className="cursor-not-allowed bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Adicionar Produto</Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertProductForm;
