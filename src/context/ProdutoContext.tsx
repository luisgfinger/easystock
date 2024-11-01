import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string;
  fornecedorId: number;
}

interface ProdutoContextType {
  produtos: Produto[];
  addProduto: (novoProduto: Omit<Produto, 'id'>) => void;
  updateProduto: (produtoAtualizado: Produto) => void;
  deleteProduto: (id: number) => void;
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

export const ProdutoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/produto')
      .then(response => setProdutos(response.data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  const addProduto = async (novoProduto: Omit<Produto, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/produto', novoProduto);
      setProdutos(prevProdutos => [
        ...prevProdutos,
        { ...novoProduto, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const updateProduto = async (produtoAtualizado: Produto) => {
    try {
      await axios.put(`http://localhost:3001/api/produto/${produtoAtualizado.id}`, produtoAtualizado);
      setProdutos(prevProdutos =>
        prevProdutos.map(produto =>
          produto.id === produtoAtualizado.id ? produtoAtualizado : produto
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const deleteProduto = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/produto/${id}`);
      setProdutos(prevProdutos =>
        prevProdutos.filter(produto => produto.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  return (
    <ProdutoContext.Provider value={{ produtos, addProduto, updateProduto, deleteProduto }}>
      {children}
    </ProdutoContext.Provider>
  );
};

export const useProduto = () => {
  const context = useContext(ProdutoContext);
  if (!context) {
    throw new Error("useProduto deve ser usado dentro do ProdutoProvider");
  }
  return context;
};
