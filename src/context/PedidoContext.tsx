import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface Pedido {
  id: number;
  data: Date;
  fornecedorId: number;
  status: string;
  total: number;
}

interface PedidoContextType {
  pedidos: Pedido[];
  addPedido: (novoPedido: Omit<Pedido, 'id'>) => void;
  updatePedido: (pedidoAtualizado: Pedido) => void;
  deletePedido: (id: number) => void;
  getUltimoPedidoId: () => number | null;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/pedido')
      .then(response => setPedidos(response.data))
      .catch(error => console.error('Erro ao buscar pedidos:', error));
  }, []);

  const addPedido = async (novoPedido: Omit<Pedido, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/pedido', novoPedido);
      setPedidos(prevPedidos => [
        ...prevPedidos,
        { ...novoPedido, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
    }
  };

  const updatePedido = async (pedidoAtualizado: Pedido) => {
    try {
      await axios.put(`http://localhost:3001/api/pedido/${pedidoAtualizado.id}`, pedidoAtualizado);
      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const deletePedido = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/pedido/${id}`);
      setPedidos(prevPedidos =>
        prevPedidos.filter(pedido => pedido.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  const getUltimoPedidoId = () => {
    if (pedidos.length === 0) return null;
    return pedidos[pedidos.length - 1].id;
  };

  return (
    <PedidoContext.Provider value={{ pedidos, addPedido, updatePedido, deletePedido, getUltimoPedidoId }}>
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
