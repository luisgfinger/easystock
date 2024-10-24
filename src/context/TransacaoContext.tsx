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
  addTransacao: (novaTransacao: Transacao) => void;
  updateTransacao: (TransacaoAtualizada: Transacao) => void;
  deleteTransacao: (id: number) => void;
  
}

const TransacaoContext = createContext<TransacaoContextType | undefined>(undefined);

export const TransacaoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const addTransacao = (novaTrancacao: Transacao) => {
    setTransacoes([...transacoes, novaTrancacao]);
  };

  const updateTransacao = (TransacaoAtualizada: Transacao) => {
    setTransacoes((newTransacao) =>
      newTransacao.map((transacoes) =>
        transacoes.id === TransacaoAtualizada.id ? TransacaoAtualizada : transacoes
      )
    );
  };

  const deleteTransacao = (id: number) => {
    setTransacoes((currentTransacoes) =>
      currentTransacoes.filter((transacao) => transacao.id !== id)
    );
  };

  return (
    <TransacaoContext.Provider value={{ transacoes, addTransacao, updateTransacao, deleteTransacao }}>
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
