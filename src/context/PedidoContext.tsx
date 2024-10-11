/*
id number Chave primária
data Date Data de criação do pedido
fornecedorId number Chave estrangeira para a tabela Fornecedor
status string Status do pedido (ex: "Pendente", "Concluído")
total number Valor total do pedido
*/

import React, { createContext, useState, ReactNode, useContext } from "react";

interface Pedido {
  id: number;
  data: Date;
  fornecedorId: number;
  status: string;
  total: number;
}

interface PedidoContextType {
  pedidos: Pedido[];
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pedidos] = useState<Pedido[]>([
    {
        id: 1,
        data: new Date(),
        fornecedorId: 1,
        status: 'Pendente',
        total: 10
    },
    {
        id: 2,
        data: new Date(),
        fornecedorId: 1,
        status: 'Pendente',
        total: 20
    },
  ]);

  return (
    <PedidoContext.Provider value={{ pedidos }}>
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error("usePedido deve ser usado dentro do PedidoProvider");
  }
  return context;
};
