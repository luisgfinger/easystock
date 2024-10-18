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
  addItemPedido: (novoPedido: ItemPedido) => void;
  updateItemPedido: (itemPedidoAtualizado: ItemPedido) => void;
  deleteItemPedido: (id: number) => void;
}

const ItemPedidoContext = createContext<ItemPedidoContextType | undefined>(undefined);

export const ItemPedidoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemPedidos, setItemPedidos] = useState<ItemPedido[]>([]);

  const addItemPedido = (novoItemPedido: ItemPedido) => {
    setItemPedidos([...itemPedidos, novoItemPedido]);
  };

  const updateItemPedido = (itemPedidoAtualizado: ItemPedido) => {
    setItemPedidos((newItemPedidos) =>
      newItemPedidos.map((itemPedido) =>
        itemPedido.id === itemPedidoAtualizado.id ? itemPedidoAtualizado : itemPedido
      )
    );
  };

  const deleteItemPedido = (id: number) => {
    setItemPedidos((currentItemPedidos) =>
      currentItemPedidos.filter((itemPedido) => itemPedido.id !== id)
    );
  };

  return (
    <ItemPedidoContext.Provider value={{ itemPedidos, addItemPedido, updateItemPedido, deleteItemPedido }}>
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
