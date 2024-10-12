import React, { createContext, useState, ReactNode, useContext } from "react";

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
  addProduto: (novoProduto: Produto) => void;
  updateProduto: (produtoAtualizado: Produto) => void; 
  deleteProduto: (id: number) => void;
}

const ProdutoContext = createContext<ProdutoContextType | undefined>(undefined);

export const ProdutoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      nome: "Produto 1",
      descricao: "Descricao 1",
      preco: 1,
      quantidade: 1,
      imagem: "/assets/products/caixa.png",
      fornecedorId: 1,
    },
    {
      id: 2,
      nome: "Produto 2",
      descricao: "Descricao 2",
      preco: 2,
      quantidade: 2,
      imagem: "/assets/products/caixa.png",
      fornecedorId: 1,
    },
  ]);

  const addProduto = (novoProduto: Produto) => {
    setProdutos([...produtos, novoProduto]);
  };

  const updateProduto = (produtoAtualizado: Produto) => {
    setProdutos((newProdutos) =>
      newProdutos.map((produto) =>
        produto.id === produtoAtualizado.id ? produtoAtualizado : produto
      )
    );
  };

  const deleteProduto = (id: number) => {
    setProdutos((currentProdutos) =>
      currentProdutos.filter((produto) => produto.id !== id)
    );
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
