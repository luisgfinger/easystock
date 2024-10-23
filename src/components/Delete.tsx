import { useCliente } from "../context/ClienteContext";
import { useFornecedor } from "../context/FornecedorContext";
import { usePedido } from "../context/PedidoContext";
import { useProduto } from "../context/ProdutoContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransacao } from "../context/TransacaoContext";

interface DeleteProps {
  type: string;
}

export default function Delete({ type }: DeleteProps) {
  const { id } = useParams<{ id: string }>();
  const { produtos, deleteProduto } = useProduto();
  const { fornecedores, deleteFornecedor } = useFornecedor();
  const { pedidos, deletePedido } = usePedido();
  const { clientes, deleteCliente } = useCliente();
  const { transacoes, deleteTransacao } = useTransacao();

  const navigate = useNavigate();

  useEffect(() => {
    const deleteEntity = async () => {
      if (type === "produto") {
        const produto = produtos.find((p) => p.id === Number(id));
        if (produto) {
          await deleteProduto(produto.id);
          navigate("/produtos");
        }
      } else if (type === "fornecedor") {
        const fornecedor = fornecedores.find((p) => p.id === Number(id));
        if (fornecedor) {
          await deleteFornecedor(fornecedor.id);
          navigate("/fornecedores");
        }
      } else if (type === "pedido") {
        const pedido = pedidos.find((p) => p.id === Number(id));
        if (pedido) {
          await deletePedido(pedido.id);
          navigate("/pedidos");
        }
      } else if (type === "cliente") {
        const cliente = clientes.find((p) => p.id === Number(id));
        if (cliente) {
          await deleteCliente(cliente.id);
          navigate("/clientes");
        }
      } else if (type === "transacao") {
        const transacao = transacoes.find((p) => p.id === Number(id));
        if (transacao) {
          await deleteTransacao(transacao.id);
          navigate("/transacoes");
        }
      }
    };

    deleteEntity();
  }, [id, produtos, fornecedores, pedidos, clientes, transacoes, deleteProduto, deleteFornecedor, deletePedido, deleteCliente, deleteTransacao, navigate, type]);

  return <h1>Excluindo...</h1>;
}
