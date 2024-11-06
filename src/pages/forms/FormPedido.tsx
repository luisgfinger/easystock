import { usePedido } from "../../context/PedidoContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";
import { useFornecedor } from "../../context/FornecedorContext";
import { useItemPedido } from "../../context/ItemPedidoContext";
import { useProduto } from "../../context/ProdutoContext";
import { useTransacao } from "../../context/TransacaoContext";

interface FormProps {
  edit: boolean;
  entrada: boolean;
}

const FormPedido: React.FC<FormProps> = ({ edit, entrada }) => {
  const { pedidos, addPedido, updatePedido, getUltimoPedidoId } = usePedido();
  const { transacoes, addTransacao } = useTransacao();
  const { fornecedores } = useFornecedor();
  const { produtos } = useProduto();
  const { itemPedidos, addItemPedido } = useItemPedido();
  const [fornecedorId, setFornecedorId] = useState(0);
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [idProduto, setIdProduto] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [precoUnit, setPrecoUnit] = useState(0);
  const [pedidoId, setPedidoId] = useState(0);
  const [quantidadeMax, setQuantidadeMax] = useState(0);

  const navigate = useNavigate();

  const [id, setId] = useState(0);
  const { id: paramId } = useParams<{ id: string }>();

  useEffect(() => {
    if (edit) {
      setId(Number(paramId));
    } else {
      setId(Math.random());
    }
  }, [edit, paramId]);

  useEffect(() => {
    if (edit && id) {
      const pedido = pedidos.find((p) => p.id === Number(id));
      if (pedido) {
        setFornecedorId(fornecedorId);
        setStatus(pedido.status);
        setTotal(pedido.total);
      }
    }
  }, [edit, id, pedidos]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    const ultimoPedidoId = getUltimoPedidoId();
    const idPedido = ultimoPedidoId !== null ? ultimoPedidoId + 1 : 1;

    const novoPedido = {
      id: id ? Number(id) : idPedido,
      data: new Date(),
      fornecedorId: fornecedorId,
      status,
      total,
    };

    if (edit && id) {
      if (id) {
        console.log("editando");
      } else {
        console.log("nao");
      }
      const novoItemPedido = {
        id: Math.random(),
        pedidoId: Number(id),
        produtoId: idProduto,
        quantidade,
        precoUnitario: precoUnit
      };

      if (quantidade > 0) {
        addItemPedido(novoItemPedido);
        updatePedido(novoPedido);
        setPedidoId(id);
      }
    } else {
      const novoItemPedido = {
        id: Math.random(),
        pedidoId: idPedido,
        produtoId: idProduto,
        quantidade,
        precoUnitario: precoUnit
      };

      if (quantidade > 0) {
        addPedido(novoPedido);
        addItemPedido(novoItemPedido);
        navigate(`/pedidos/editar/${idPedido}`);
      }
    }

    const novaTransacao = {
      id: Math.random(),
      data: new Date(),
      tipo: entrada ? "entrada" : "saida",
      valor: precoUnit * quantidade,
      produtoId: idProduto,
      pedidoId: edit ? Number(id) : idPedido,
    };

    addTransacao(novaTransacao);
    setIdProduto(0);
    setQuantidade(0);
    setPrecoUnit(0);
  };

  const handleSubmitPedido = (e: React.FormEvent) => {
    e.preventDefault();

    navigate("/pedidos");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Pedido" : "Cadastro de Pedido"}</h3>
      <form onSubmit={handleSubmitPedido} className="flex-column">
        <label>Fornecedor</label>
        <select
          value={fornecedorId}
          onChange={(e) => setFornecedorId(Number(e.target.value))}
        >
          <option value="">Selecione um fornecedor</option>

          {fornecedores.map((fornecedor) => (
            <option key={fornecedor.id} value={fornecedor.id}>
              {fornecedor.nome}
            </option>
          ))}
        </select>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Selecione um estado</option>
          <option value={"pendente"}>Pendente</option>
          <option value={"concluído"}>Concluído</option>
        </select>

        <h4>Adicionar Itens ao Pedido</h4>
        {produtos.length > 0 ? (
          <>
            <select
              value={idProduto}
              onChange={(e) => {
                const produtoIdSelecionado = Number(e.target.value);
                setIdProduto(produtoIdSelecionado);
                const produtoSelecionado = produtos.find(
                  (produto) => produto.id === produtoIdSelecionado
                );
                if (produtoSelecionado) {
                  setPrecoUnit(produtoSelecionado.preco);
                  setQuantidadeMax(produtoSelecionado.quantidade);
                }
              }}
            >
              <option value="">Selecione um produto</option>
              {produtos
                .filter(
                  (produto) =>
                    produto.quantidade > 0 &&
                    produto.fornecedorId === fornecedorId
                )
                .map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
            </select>

            <label>Quantidade</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              placeholder="Quantidade"
              max={entrada ? undefined : quantidadeMax}
            />
            {precoUnit > 0 && (
              <div>
                <p>Total do item: R${precoUnit * quantidade},00</p>
              </div>
            )}

            <button className="submit-button" onClick={handleAddItem}>
              Adicionar
            </button>
          </>
        ) : (
          <h3>Sem produtos</h3>
        )}

        {itemPedidos.length > 0 ? (
          <ul className="form-itens">
            {itemPedidos
              .filter((item) => item.pedidoId === id)
              .map((item) => {
                const produto = produtos.find((p) => p.id === item.produtoId);
                return (
                  <li key={item.id}>
                    {produto ? (
                      <p>
                        {produto.nome} - Quant: {item.quantidade} - Valor: R$
                        {item.precoUnitario},00
                      </p>
                    ) : (
                      <p>Produto não encontrado</p>
                    )}
                  </li>
                );
              })}
          </ul>
        ) : (
          <h3>Sem itens no pedido</h3>
        )}

        <button className="submit-button" type="submit">
          {edit ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormPedido;
