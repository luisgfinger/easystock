import { usePedido } from "../../context/PedidoContext";
import { useProduto } from "../../context/ProdutoContext";
import { useTransacao } from "../../context/TransacaoContext";

import React from "react";
import Button from "../Ui/Button";
import { useNavigate } from "react-router-dom";

interface TransacaoListProps{
  buscaTipo?: string;
  buscaData?: string;
}

const TransacaoList: React.FC<TransacaoListProps> = ({buscaTipo, buscaData}) => {
  const { transacoes } = useTransacao();
  const { pedidos } = usePedido();
  const {produtos} = useProduto();
  const navigate = useNavigate();

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  const deleteTransacao = (id: number) => {
    navigate(`/transacoes/deletar/${id}`);
  };

  const formatarData = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatarBuscaData = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const transacoesFiltradas = transacoes
  .filter((transacao) => {
    const dataMatch = buscaData
      ? formatarData(transacao.data.toISOString()) === formatarBuscaData(buscaData)
      : true;

    const statusMatch = buscaTipo
      ? transacao.tipo.toLowerCase().includes(buscaTipo.toLowerCase())
      : true;

    return dataMatch && statusMatch;
  })

  return (
    <ul className="content">
      {transacoesFiltradas.length > 0 ? (
        transacoesFiltradas.map((transacao) => {

          transacao.data = new Date(transacao.data)

            const pedido = pedidos.find((f) => f.id === transacao.pedidoId);
            const produto = produtos.find((f) => f.id === transacao.produtoId);
          return (
            <li key={transacao.id}>
              <h3>Transacao {transacao.id}</h3>
              <ul className="inside">
                <li>Data: {formatarData(transacao.data.toISOString())}</li>
                <li>Tipo: {transacao.tipo}</li>
                <li>Valor: R${transacao.valor},00</li>
                <li>
                  {pedido ? (
                    <p>Pedido: {pedido.id}</p>
                  ) : (
                    <></>
                  )}
                </li>
                <li>
                  {produto ? (
                    <h3>Produto: {produto.id}</h3>
                  ) : (
                    <p>Produto não encontrado</p>
                  )}
                </li>
                <div className="delete-edit-button flex-column">
                  <span className="delete-button">
                    <Button
                      text="Excluir"
                      onClick={() => deleteTransacao(transacao.id)}
                    />
                  </span>
                </div>
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
