import { useCliente } from "../../context/ClienteContext";
import { useItemPedido } from "../../context/ItemPedidoContext";
import { usePedido } from "../../context/PedidoContext";
import Button from "../Ui/Button";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProduto } from "../../context/ProdutoContext";
import { useTransacao } from "../../context/TransacaoContext";

interface PedidoListProps {
  buscaData?: string;
  buscaStatus?: string;
  ordenacaoData?: string;
  ordenacaoValor?: string;
}

const PedidoList: React.FC<PedidoListProps> = ({ buscaData, buscaStatus, ordenacaoData, ordenacaoValor }) => {
  const { pedidos } = usePedido();
  const { clientes } = useCliente();
  const { itemPedidos } = useItemPedido();
  const { produtos } = useProduto();
  const {transacoes} = useTransacao();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) {
      navigate("/login");
    }
  }, [navigate]);
  

  const editPedido = (id: number) => {
    navigate(`/pedidos/editar/${id}`);
  };

  const deletePedido = (id: number) => {
    navigate(`/pedidos/deletar/${id}`);
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

  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const dataMatch = buscaData
        ? formatarData(pedido.data.toISOString()) === formatarBuscaData(buscaData)
        : true;

      const statusMatch = buscaStatus
        ? pedido.status.toLowerCase().includes(buscaStatus.toLowerCase())
        : true;

      return dataMatch && statusMatch;
    })
    .sort((a, b) => {
      const dataA = new Date(a.data).getTime();
      const dataB = new Date(b.data).getTime();
      if (dataA !== dataB) {
        return ordenacaoData === "dataCrescente" ? dataA - dataB : dataB - dataA;
      }
      return ordenacaoValor === "valorCrescente" ? a.total - b.total : b.total - a.total;
    });

  return (
    <ul className="content">
      {pedidosFiltrados.length > 0 ? (
        pedidosFiltrados.map((pedido) => {
          pedido.data = new Date(pedido.data)
          const cliente = clientes.find((f) => f.id === pedido.clienteId);

          const itensPedido = itemPedidos.filter(item => item.pedidoId === pedido.id);

          const totalPedido = itensPedido.reduce((acc, item) => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return acc + (produto ? item.precoUnitario * item.quantidade : 0);
          }, 0);

          return (
            <li key={pedido.id}>
              <ul className="inside flex-column">
                <li>Data: {formatarData(pedido.data.toISOString())}</li>
                <li>
                  {cliente ? (
                    <p>Cliente: {cliente.nome}</p>
                  ) : (
                    <></>
                  )}
                </li>
                <li>Status: {pedido.status}</li>
                <li>
                  {itensPedido.length > 0 ? (
                    <ul className="itens">
                      {itensPedido.map(item => {
                        const produto = produtos.find(p => p.id === item.produtoId);
                        return (
                          <li key={item.id}>
                            {produto ? (
                              <ul>
                                <li><h3>{produto.nome}</h3></li>
                                <li>Valor: R${item.precoUnitario},00</li>
                                <li>Quantidade: {item.quantidade}</li>
                                <li>Total: R${item.quantidade*item.precoUnitario},00</li>
                              </ul>
                            ) : (
                              "Produto não encontrado"
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <h3>Sem itens</h3>
                  )}
                </li>
                <li><h3>Total pedido: R$ {totalPedido},00</h3></li>
                <div className="delete-edit-button flex-column">
                  <Button
                    text="Editar pedido"
                    onClick={() => editPedido(pedido.id)}
                  />
                  <span className="delete-button">
                    <Button
                      text="Excluir"
                      onClick={() => deletePedido(pedido.id)}
                    />
                  </span>
                </div>
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
