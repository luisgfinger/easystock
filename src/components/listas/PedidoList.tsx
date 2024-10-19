import { useFornecedor } from "../../context/FornecedorContext";
import { useItemPedido } from "../../context/ItemPedidoContext";
import { usePedido } from "../../context/PedidoContext";
import Button from "../Ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useProduto } from "../../context/ProdutoContext";

interface PedidoListProps {
  buscaData?: string;
  buscaStatus?: string;
  ordenacaoData?: string;
  ordenacaoValor?: string;
}

const PedidoList: React.FC<PedidoListProps> = ({ buscaData, buscaStatus, ordenacaoData, ordenacaoValor }) => {
  const { pedidos } = usePedido();
  const { fornecedores } = useFornecedor();
  const { itemPedidos } = useItemPedido();
  const { produtos } = useProduto();
  const navigate = useNavigate();

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
          const fornecedor = fornecedores.find((f) => f.id === pedido.fornecedorId);

          const itensPedido = itemPedidos.filter(item => item.pedidoId === pedido.id);

          const totalPedido = itensPedido.reduce((acc, item) => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return acc + (produto ? item.precoUnitario * item.quantidade : 0);
          }, 0);

          return (
            <li key={pedido.id}>
              <ul className="inside flex-column">
                <h3>Pedido: {pedido.id}</h3>
                <li>Data: {formatarData(pedido.data.toISOString())}</li>
                <li>
                  {fornecedor ? (
                    <p>Fornecedor: {fornecedor.nome}</p>
                  ) : (
                    <p>Fornecedor não encontrado</p>
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
                              `${produto.nome} - Quantidade: ${item.quantidade} - Preço Unitário: R$ ${item.precoUnitario.toFixed(2)}`
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
                <li>Total: R$ {totalPedido.toFixed(2)},00</li>
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
