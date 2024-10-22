/*
id number Chave primária
data Date Data da transação
tipo string Tipo da transação (ex: "Entrada", "Saída")
valor number Valor da transação
produtoId number Chave estrangeira para a tabela Produto
pedidoId number Chave estrangeira para a tabela Pedido (se aplicável)
*/

import React, { createContext, useState, ReactNode, useContext } from "react";

interface Transacao {
  id: number;
  data: Date;
  tipo: String;
  valor: number;
  produtoId: number;
  pedidoId: number;
}

interface TransacaoContextType {
  transacoes: Transacao[];
}

const TransacaoContext = createContext<TransacaoContextType | undefined>(undefined);

export const TransacaoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transacoes] = useState<Transacao[]>([
    {
        id: 1,
        data: new Date(),
        tipo: 'Entrada',
        valor: 10,
        produtoId: 1,
        pedidoId: 1
    },
    {
        id: 1,
        data: new Date(),
        tipo: 'Entrada',
        valor: 20,
        produtoId: 2,
        pedidoId: 2
    },
  ]);

  return (
    <TransacaoContext.Provider value={{ transacoes }}>
      {children}
    </TransacaoContext.Provider>
  );
};

export const useTransacao = () => {
  const context = useContext(TransacaoContext);
  if (!context) {
    throw new Error("useTransacao deve ser usado dentro do TransacaoProvider");
  }
  return context;
};
