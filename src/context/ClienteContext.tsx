import React, { createContext, useState, ReactNode, useContext} from 'react';

interface Cliente {
  id: number;
  nome: string;
  cpf_cnpj: string;
  contato: string;
  endereco: string;
}

interface ClienteContextType {
  clientes: Cliente[]; 
  addCliente: (novoCliente: Cliente) => void;
  updateCliente: (ClienteAtualizado: Cliente) => void; 
  deleteCliente: (id: number) => void;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export const ClienteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nome: 'Cliente 1', cpf_cnpj: 'CPF_CNPJ 1', contato: 'Contato 1', endereco: 'Endereço 1' },
    { id: 2, nome: 'Cliente 2', cpf_cnpj: 'CPF_CNPJ 2', contato: 'Contato 2', endereco: 'Endereço 2' },
  ]);

  const addCliente = (novoCliente: Cliente) => {
    setClientes([...clientes, novoCliente]);
  };

   const updateCliente = (ClienteAtualizado: Cliente) => {
    setClientes((newCliente) =>
      newCliente.map((clientes) =>
        clientes.id === ClienteAtualizado.id ? ClienteAtualizado : clientes
      )
    );
  };

  const deleteCliente = (id: number) => {
    setClientes((currentClientes) =>
      currentClientes.filter((clientes) => clientes.id !== id)
    );
  };

  return (
    <ClienteContext.Provider value={{clientes, addCliente, updateCliente, deleteCliente}}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useCliente = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error("useCliente deve ser usado dentro do ClienteProvider");
  }
  return context;
};
