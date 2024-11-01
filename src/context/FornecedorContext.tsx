import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  contato: string;
  endereco: string;
}

interface FornecedorContextType {
  fornecedores: Fornecedor[];
  addFornecedor: (novoFornecedor: Omit<Fornecedor, 'id'>) => void;
  updateFornecedor: (fornecedorAtualizado: Fornecedor) => void;
  deleteFornecedor: (id: number) => void;
}

const FornecedorContext = createContext<FornecedorContextType | undefined>(undefined);

export const FornecedorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/fornecedor')
      .then(response => setFornecedores(response.data))
      .catch(error => console.error('Erro ao buscar fornecedores:', error));
  }, []);

  const addFornecedor = async (novoFornecedor: Omit<Fornecedor, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/fornecedor', novoFornecedor);
      setFornecedores(prevFornecedores => [
        ...prevFornecedores,
        { ...novoFornecedor, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
    }
  };

  const updateFornecedor = async (fornecedorAtualizado: Fornecedor) => {
    try {
      await axios.put(`http://localhost:3001/api/fornecedor/${fornecedorAtualizado.id}`, fornecedorAtualizado);
      setFornecedores(prevFornecedores =>
        prevFornecedores.map(fornecedor =>
          fornecedor.id === fornecedorAtualizado.id ? fornecedorAtualizado : fornecedor
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
    }
  };

  const deleteFornecedor = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/fornecedor/${id}`);
      setFornecedores(prevFornecedores =>
        prevFornecedores.filter(fornecedor => fornecedor.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
    }
  };

  return (
    <FornecedorContext.Provider value={{ fornecedores, addFornecedor, updateFornecedor, deleteFornecedor }}>
      {children}
    </FornecedorContext.Provider>
  );
};

export const useFornecedor = () => {
  const context = useContext(FornecedorContext);
  if (!context) {
    throw new Error("useFornecedor deve ser usado dentro do FornecedorProvider");
  }
  return context;
};
