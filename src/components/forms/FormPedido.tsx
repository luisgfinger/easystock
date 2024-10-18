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
import { useFornecedor } from "../../context/FornecedorContext";
import { useProduto } from "../../context/ProdutoContext";
import { useItemPedido } from "../../context/ItemPedidoContext";

interface FormProps {
  edit: boolean;
}

const FormPedido: React.FC<FormProps> = ({ edit }) => {
  const { pedidos, addPedido, updatePedido } = usePedido();
  const { fornecedores } = useFornecedor();
  const { produtos, addProduto } = useProduto();
  const { itemPedidos, addItemPedido } = useItemPedido();
  const [data, setData] = useState<Date | null>(null);
  const [fornecedorId, setFornecedorId] = useState(0);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
   const [idItem, setIdItem] = useState(0);
   const [idPedido, setIdPedido] = useState(0);
   const [idProduto, setIdProduto] = useState(0);
   const [quantidade, setQuantidade] = useState(0);
   const [precoUnit, setPrecoUnit] = useState(0);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (edit && id) {
      const pedido = pedidos.find((p) => p.id === Number(id));
      if (pedido) {
        setData(pedido.data),
          setFornecedorId(pedido.fornecedorId),
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
  const handleSubmit2 = (e: React.FormEvent, produtoId: number) => {
    e.preventDefault();
  
    const novoItemPedido = {
      idItem: Math.random(), // Considerar usar uma estratégia de ID mais robusta
      idPedido: id,
      idProduto: produtoId, // produtoId agora é passado como parâmetro
      quantidade,
      precoUnitario, // Certifique-se de que o nome da variável está correto
    };
  
    addItemPedido(novoItemPedido);
  
    // Limpeza dos campos, se necessário
    // Exemplo:
    // setProdutoId(0);
    // setQuantidade(0);
    // setPrecoUnitario(0);
  };
  
  

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Pedido" : "Cadastro de Pedido"}</h3>
      <form onSubmit={handleSubmit} className="flex-column">
        <label>Fornecedor:</label>
        <select
          value={fornecedorId}
          onChange={(e) => setFornecedorId(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Selecione um fornecedor
          </option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
        <label>Status:</label>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        />
        <label>Total:</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          required
        />

        {itemPedidos.length > 0 ? (
          <ul className="itens">
            {itemPedidos.map(item => {
              const produto = produtos.find(p => p.id === item.produtoId);
              return (
                <li key={item.id}>
                  {produto ? (
                    `${produto.nome} - Quantidade: ${item.quantidade} - Preço Unitário: ${item.precoUnitario}`
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
        <form action="">
          {produtos.length > 0 ?
            <select
              value={it}
              onChange={(e) => setFornecedorId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Selecione um fornecedor
              </option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
            :
            <h3>Sem produtos</h3>
        };

        </form>

        <button className="submit-button" type="submit">
          {edit ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormPedido;
