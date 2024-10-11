/*
id number Chave primária
pedidoId number Chave estrangeira para a tabela Pedido
produtoId number Chave estrangeira para a tabela Produto
quantidade number Quantidade do produto no pedido
precoUnitario number Preço unitário do produto no pedido
*/

import React, { createContext, useState, ReactNode, useContext } from "react";

interface ItemPedido {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

interface ItemPedidoContextType {
  itemPedidos: ItemPedido[];
}

const ItemPedidoContext = createContext<ItemPedidoContextType | undefined>(undefined);

export const ItemPedidoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemPedidos] = useState<ItemPedido[]>([
    {
        id: 1,
        pedidoId: 1,
        produtoId: 1,
        quantidade: 1,
        precoUnitario: 10
    },
    {
        id: 2,
        pedidoId: 2,
        produtoId: 2,
        quantidade: 2,
        precoUnitario: 20
    },
  ]);

  return (
    <ItemPedidoContext.Provider value={{ itemPedidos }}>
      {children}
    </ItemPedidoContext.Provider>
  );
};

export const useItemPedido = () => {
  const context = useContext(ItemPedidoContext);
  if (!context) {
    throw new Error("useItemPedido deve ser usado dentro do ItemPedidoProvider");
  }
  return context;
};
