import { desc, eq } from "drizzle-orm";
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
import { db } from "@/db";
import { StocksTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddProductButton from "./components/add-product-button";
import ProductsTable from "./components/products-table";

const ProductsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }

  const products = await db
    .select()
    .from(StocksTable)
    .where(eq(StocksTable.userId, session.user.id))
    .orderBy(desc(StocksTable.createdAt));
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
        <ProductsTable products={products} />
      </PageContent>
    </PageContainer>
  );
};

export default ProductsPage;
