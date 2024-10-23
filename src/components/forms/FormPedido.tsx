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
}

const FormPedido: React.FC<FormProps> = ({ edit }) => {
  const { pedidos, addPedido, updatePedido } = usePedido();
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
        setFornecedorId(0);
        setStatus(pedido.status);
        setTotal(pedido.total);
      }
    }
  }, [edit, id, pedidos]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();

    const novoItemPedido = {
      id: Math.random(),
      pedidoId: id,
      produtoId: idProduto,
      quantidade,
      precoUnitario: precoUnit,
    };

    const novaTransacao = {
      id: Math.random(),
      data: new Date(),
      tipo: 'saida',
      valor: precoUnit * quantidade,
      produtoId: idProduto,
      pedidoId: id

    }

    addItemPedido(novoItemPedido);
    addTransacao(novaTransacao);
    setIdProduto(0);
    setQuantidade(0);
    setPrecoUnit(0);
  };

  const handleSubmitPedido = (e: React.FormEvent) => {
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
      <form onSubmit={handleSubmitPedido} className="flex-column">
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
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
                }
              }}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
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
          <ul className="itens">
            {itemPedidos
              .filter((item) => item.pedidoId === id)
              .map((item) => {
                const produto = produtos.find((p) => p.id === item.produtoId);
                return (
                  <li key={item.id}>
                    {produto ? (
                      <p>
                        {produto.nome} - Quant: {item.quantidade} - Valor: R${item.precoUnitario},00
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
