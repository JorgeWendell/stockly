import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const ProductsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Estoque de Produtos</PageTitle>
          <PageDescription>Gerencie seus produtos</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <Plus />
            Adicionar Produto
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Produtos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default ProductsPage;
