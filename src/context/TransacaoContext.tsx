import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

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
  addTransacao: (novoTransacao: Omit<Transacao, 'id'>) => void;
  updateTransacao: (transacaoAtualizado: Transacao) => void;
  deleteTransacao: (id: number) => void;
}

const TransacaoContext = createContext<TransacaoContextType | undefined>(undefined);

export const TransacaoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/transacao')
      .then(response => setTransacoes(response.data))
      .catch(error => console.error('Erro ao buscar transacoes:', error));
  }, []);

  const addTransacao = async (novoTransacao: Omit<Transacao, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/transacao', novoTransacao);
      setTransacoes(prevTransacoes => [
        ...prevTransacoes,
        { ...novoTransacao, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar transacao:', error);
    }
  };

  const updateTransacao = async (transacaoAtualizado: Transacao) => {
    try {
      await axios.put(`http://localhost:3001/api/transacao/${transacaoAtualizado.id}`, transacaoAtualizado);
      setTransacoes(prevTransacoes =>
        prevTransacoes.map(transacao =>
          transacao.id === transacaoAtualizado.id ? transacaoAtualizado : transacao
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar transacao:', error);
    }
  };

  const deleteTransacao = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/transacao/${id}`);
      setTransacoes(prevTransacoes =>
        prevTransacoes.filter(transacao => transacao.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir transacao:', error);
    }
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
