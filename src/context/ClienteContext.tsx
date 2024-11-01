import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  id: number;
  nome: string;
  cpf_cnpj: string;
  contato: string;
  endereco: string;
}

interface ClienteContextType {
  clientes: Cliente[];
  addCliente: (novoCliente: Omit<Cliente, 'id'>) => void;
  updateCliente: (clienteAtualizado: Cliente) => void;
  deleteCliente: (id: number) => void;
}

const ClienteContext = createContext<ClienteContextType | undefined>(undefined);

export const ClienteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/Cliente')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Erro ao buscar clientes:', error));
  }, []);

  const addCliente = async (novoCliente: Omit<Cliente, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/cliente', novoCliente);
      setClientes(prevClientes => [
        ...prevClientes,
        { ...novoCliente, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
    }
  };

  const updateCliente = async (clienteAtualizado: Cliente) => {
    try {
      await axios.put(`http://localhost:3001/api/cliente/${clienteAtualizado.id}`, clienteAtualizado);
      setClientes(prevClientes =>
        prevClientes.map(cliente =>
          cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/cliente/${id}`);
      setClientes(prevClientes =>
        prevClientes.filter(cliente => cliente.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  return (
    <ClienteContext.Provider value={{ clientes, addCliente, updateCliente, deleteCliente }}>
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
