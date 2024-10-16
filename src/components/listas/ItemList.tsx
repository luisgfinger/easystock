/*
id number Chave primária
pedidoId number Chave estrangeira para a tabela Pedido
produtoId number Chave estrangeira para a tabela Produto
quantidade number Quantidade do produto no pedido
precoUnitario number Preço unitário do produto no pedido
*/


import { useItemPedido } from "../../context/ItemPedidoContext";
import { usePedido } from "../../context/PedidoContext";
import { useProduto } from "../../context/ProdutoContext";
import React from "react";

const ItemPedidoList: React.FC = () => {
  const { itemPedidos } = useItemPedido();
  const { pedidos } = usePedido();
  const { produtos } = useProduto();

  return (
    <ul>
      {itemPedidos.length > 0 ? (
        itemPedidos.map((itemPedido) => {
          const pedido = pedidos.find((f) => f.id === itemPedido.pedidoId);
          const produto = produtos.find((f) => f.id === itemPedido.pedidoId);
          return (
            <li key={itemPedido.id}>
              <h3>ItemPedido {itemPedido.id}</h3>
              <ul>
                <li>
                  {produto ? (
                    <p>Produto: {produto.id}</p>
                  ) : (
                    <p>Produto não encontrado</p>
                  )}
                </li>
                <li>Quantidade: {itemPedido.quantidade}</li>
                <li>Preço: {itemPedido.precoUnitario}</li>
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

export default ItemPedidoList;
