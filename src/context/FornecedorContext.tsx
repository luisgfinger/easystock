import React, { createContext, useState, ReactNode, useContext} from 'react';

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
  endereco: string;
}

interface FornecedorContextType {
  fornecedores: Fornecedor[]; 
  addFornecedor: (novoFornecedor: Fornecedor) => void;
  updateFornecedor: (FornecedorAtualizado: Fornecedor) => void; 
  deleteFornecedor: (id: number) => void;
}

const FornecedorContext = createContext<FornecedorContextType | undefined>(undefined);

export const FornecedorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([
    { id: 1, nome: 'Fornecedor 1', contato: 'Contato 1', endereco: 'Endereço 1' },
    { id: 2, nome: 'Fornecedor 2', contato: 'Contato 2', endereco: 'Endereço 2' },
  ]);

  const addFornecedor = (novoFornecedor: Fornecedor) => {
    setFornecedores([...fornecedores, novoFornecedor]);
  };

   const updateFornecedor = (FornecedorAtualizado: Fornecedor) => {
    setFornecedores((newFornecedor) =>
      newFornecedor.map((fornecedores) =>
        fornecedores.id === FornecedorAtualizado.id ? FornecedorAtualizado : fornecedores
      )
    );
  };

  const deleteFornecedor = (id: number) => {
    setFornecedores((currentFornecedores) =>
      currentFornecedores.filter((fornecedores) => fornecedores.id !== id)
    );
  };

  return (
    <FornecedorContext.Provider value={{fornecedores, addFornecedor, updateFornecedor, deleteFornecedor}}>
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
