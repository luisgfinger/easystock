/*
id number Chave primária
data Date Data da transação
tipo string Tipo da transação (ex: "Entrada", "Saída")
valor number Valor da transação
produtoId number Chave estrangeira para a tabela Produto
pedidoId number Chave estrangeira para a tabela Pedido (se aplicável)
*/

import { usePedido } from "../../context/PedidoContext";
import { useProduto } from "../../context/ProdutoContext";
import { useTransacao } from "../../context/TransacaoContext";

import React from "react";

const TransacaoList: React.FC = () => {
  const { transacoes } = useTransacao();
  const { pedidos } = usePedido();
  const {produtos} = useProduto();

  return (
    <ul>
      {transacoes.length > 0 ? (
        transacoes.map((transacao) => {
            const pedido = pedidos.find((f) => f.id === transacao.pedidoId);
            const produto = produtos.find((f) => f.id === transacao.produtoId);
          return (
            <li key={transacao.id}>
              <h3>Transacao {transacao.id}</h3>
              <ul>
                <li>Data: {transacao.data.toISOString()}</li>
                <li>Tipo: {transacao.tipo}</li>
                <li>Valor: {transacao.valor}</li>
                <li>
                  {pedido ? (
                    <p>Pedido: {pedido.id}</p>
                  ) : (
                    <p>Pedido não encontrado</p>
                  )}
                </li>
                <li>
                  {produto ? (
                    <p>Produto: {produto.id}</p>
                  ) : (
                    <p>Produto não encontrado</p>
                  )}
                </li>
              </ul>
            </li>
          );
        })
      ) : (
        <li>
          <h3>Nenhuma transação encontrada</h3>
        </li>
      )}
    </ul>
  );
};

export default TransacaoList;
