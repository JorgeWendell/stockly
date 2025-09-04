import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import AddProductButton from "./components/add-product-button";

const ProductsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Estoque de Produtos</PageTitle>
          <PageDescription>Gerencie seus produtos</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddProductButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Produtos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default ProductsPage;
