/*
id number Chave primária
data Date Data de criação do pedido
fornecedorId number Chave estrangeira para a tabela Fornecedor
status string Status do pedido (ex: "Pendente", "Concluído")
total number Valor total do pedido
*/

import { usePedido } from "../../context/PedidoContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

interface FormProps {
  edit: boolean;
}

const FormPedido: React.FC<FormProps> = ({ edit }) => {
  const { pedidos, addPedido, updatePedido } = usePedido();
  const [data, setData] = useState<Date | null>(null);
  const [fornecedorId, setFornecedorId] = useState(0);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (edit && id) {
      const pedido = pedidos.find((p) => p.id === Number(id));
      if (pedido) {
        setData(pedido.data),
          setFornecedorId(0),
          setStatus(pedido.status),
          setTotal(pedido.total);
      }
    }
  }, [edit, id, pedidos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoPedido = {
      id: id ? Number(id) : Math.random(),
      data: new Date(),
      fornecedorId,
      status,
      total,
    };

    if (edit && id) {
      updatePedido(novoPedido);
    } else {
      addPedido(novoPedido);
    }

    navigate("/pedidos");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Pedido" : "Cadastro de Pedido"}</h3>
      <form onSubmit={handleSubmit} className="flex-column">
      <label>Status:</label>
        <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
        >
        <option value="">Selecione um Status</option>  
        <option value="pendente">Pendente</option>
        <option value="concluido">Concluído</option>

        </select>
      
        <button className="submit-button" type="submit">
          {edit ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormPedido;
