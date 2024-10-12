/*
id number Chave primária
data Date Data de criação do pedido
fornecedorId number Chave estrangeira para a tabela Fornecedor
status string Status do pedido (ex: "Pendente", "Concluído")
total number Valor total do pedido
*/

import React from 'react';
import { usePedido } from '../../context/PedidoContext';
import { useFornecedor } from '../../context/FornecedorContext';

const PedidoList: React.FC = () => {
  const { pedidos } = usePedido(); 
  const { fornecedores } = useFornecedor(); 

  return (
    <ul>
      {pedidos.length > 0 ? (
        pedidos.map((pedido) => {
          const fornecedor = fornecedores.find(f => f.id === pedido.fornecedorId);
          return (
            <li key={pedido.id}>
              <h3>Pedido: {pedido.id}</h3>
              <ul>
                <li>Data: {pedido.data.toISOString()}</li>
                <li>{fornecedor ? <p>Fornecedor: {fornecedor.nome}</p> : <p>Fornecedor não encontrado</p>}</li>
                <li>Status: {pedido.status}</li>
                <li>Total: {pedido.total}</li>
              </ul>
            </li>
          );
        })
      ) : (
        <li>
          <h3>Nenhum pedido encontrado</h3>
        </li>
      )}
    </ul>
  );
};

export default PedidoList;
