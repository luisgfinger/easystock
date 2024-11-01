import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface ItemPedido {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

interface ItemPedidoContextType {
  itemPedidos: ItemPedido[];
  addItemPedido: (novoItemPedido: Omit<ItemPedido, 'id'>) => void;
  updateItemPedido: (itemPedidoAtualizado: ItemPedido) => void;
  deleteItemPedido: (id: number) => void;
}

const ItemPedidoContext = createContext<ItemPedidoContextType | undefined>(undefined);

export const ItemPedidoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itemPedidos, setItemPedidos] = useState<ItemPedido[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/itempedido')
      .then(response => setItemPedidos(response.data))
      .catch(error => console.error('Erro ao buscar itemPedidos:', error));
  }, []);

  const addItemPedido = async (novoItemPedido: Omit<ItemPedido, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/itempedido', novoItemPedido);
      setItemPedidos(prevItemPedidos => [
        ...prevItemPedidos,
        { ...novoItemPedido, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar itemPedido:', error);
    }
  };

  const updateItemPedido = async (itemPedidoAtualizado: ItemPedido) => {
    try {
      await axios.put(`http://localhost:3001/api/itempedido/${itemPedidoAtualizado.id}`, itemPedidoAtualizado);
      setItemPedidos(prevItemPedidos =>
        prevItemPedidos.map(itemPedido =>
          itemPedido.id === itemPedidoAtualizado.id ? itemPedidoAtualizado : itemPedido
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar itemPedido:', error);
    }
  };

  const deleteItemPedido = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/itempedido/${id}`);
      setItemPedidos(prevItemPedidos =>
        prevItemPedidos.filter(itemPedido => itemPedido.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir itemPedido:', error);
    }
  };

  return (
    <ItemPedidoContext.Provider value={{ itemPedidos, addItemPedido, updateItemPedido, deleteItemPedido }}>
      {children}
    </ItemPedidoContext.Provider>
  );
};

export const useItemPedido = () => {
  const context = useContext(ItemPedidoContext);
  if (!context) {
    throw new Error("useItemPedido deve ser usado dentro do ItemPedidoProvider");
  }
  return context;
};
