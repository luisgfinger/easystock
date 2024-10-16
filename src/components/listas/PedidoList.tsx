/*
id number Chave primária
data Date Data de criação do pedido
fornecedorId number Chave estrangeira para a tabela Fornecedor
status string Status do pedido (ex: "Pendente", "Concluído")
total number Valor total do pedido
*/

import { useFornecedor } from "../../context/FornecedorContext";
import { usePedido } from "../../context/PedidoContext";
import Button from "../Ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const PedidoList: React.FC = () => {
  const { pedidos } = usePedido();
  const { fornecedores } = useFornecedor();
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

  return (
    <ul className="content">
      {pedidos.length > 0 ? (
        pedidos.map((pedido) => {
          const fornecedor = fornecedores.find(
            (f) => f.id === pedido.fornecedorId
          );
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
                <li>Total: R${pedido.total},00</li>
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
