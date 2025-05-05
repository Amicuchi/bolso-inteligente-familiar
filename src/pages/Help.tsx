
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HelpPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Central de Ajuda</h1>
        <p className="text-muted-foreground">
          Encontre informações e dicas sobre como usar o Gestor Financeiro Familiar.
        </p>

        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>Tudo que você precisa saber para começar</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como funciona o dashboard?</AccordionTrigger>
                    <AccordionContent>
                      O dashboard apresenta uma visão geral das suas finanças, incluindo receitas, 
                      despesas, saldo do mês atual, distribuição por categorias, evolução mensal, 
                      progresso de orçamentos e metas, além das suas caixinhas de poupança e 
                      transações recentes.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Como navegar pela aplicação?</AccordionTrigger>
                    <AccordionContent>
                      Use o menu lateral para acessar todas as funcionalidades do sistema. Você 
                      pode gerenciar transações, orçamentos, metas financeiras, caixinhas de 
                      poupança e visualizar relatórios detalhados.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Como interpretar os gráficos?</AccordionTrigger>
                    <AccordionContent>
                      Os gráficos mostram dados visuais para facilitar a análise das suas finanças. 
                      Gráficos de barras mostram evolução ao longo do tempo, gráficos de pizza 
                      mostram distribuição por categorias, e barras de progresso indicam o avanço 
                      em relação a metas ou orçamentos.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciando Transações</CardTitle>
                <CardDescription>Como cadastrar e organizar suas receitas e despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como adicionar uma nova transação?</AccordionTrigger>
                    <AccordionContent>
                      Na página Transações, clique no botão "Nova Transação", preencha o formulário com 
                      descrição, valor, data, categoria e tipo (receita ou despesa), e clique em Salvar.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Como usar o sistema de tags?</AccordionTrigger>
                    <AccordionContent>
                      Ao adicionar ou editar uma transação, você pode incluir tags para melhor 
                      organização. As tags permitem filtrar e agrupar transações além das categorias 
                      principais, facilitando análises mais específicas.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Como filtrar transações?</AccordionTrigger>
                    <AccordionContent>
                      Use a barra de busca para encontrar transações por descrição, categoria ou valor. 
                      Você também pode filtrar por tipo (receita/despesa), período, ou tags específicas.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orçamentos</CardTitle>
                <CardDescription>Como definir e monitorar limites de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como criar um orçamento?</AccordionTrigger>
                    <AccordionContent>
                      Na página Orçamentos, clique em "Novo Orçamento", selecione a categoria, 
                      defina o valor limite e o período do orçamento (geralmente mensal).
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Como interpretar o progresso do orçamento?</AccordionTrigger>
                    <AccordionContent>
                      As barras de progresso indicam quanto do orçamento já foi utilizado. Verde 
                      significa que você está dentro do orçamento, amarelo que está próximo do 
                      limite, e vermelho que ultrapassou o valor definido.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>Como analisar seus dados financeiros</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como usar a página de relatórios?</AccordionTrigger>
                    <AccordionContent>
                      A página de relatórios apresenta análises detalhadas das suas finanças. 
                      Use o seletor de mês para ver dados de períodos específicos, e as abas 
                      para alternar entre diferentes tipos de relatórios.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Quais análises estão disponíveis?</AccordionTrigger>
                    <AccordionContent>
                      Você pode visualizar relatórios mensais de receitas e despesas, análises 
                      por categoria, comparativos entre períodos, e acompanhamento de poupanças.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
