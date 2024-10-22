import { useCliente } from "../context/ClienteContext";
import { useFornecedor } from "../context/FornecedorContext";
import { usePedido } from "../context/PedidoContext";
import { useProduto } from "../context/ProdutoContext";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface DeleteProps {
  type: string;
}

export default function Delete({ type }: DeleteProps) {
  const { id } = useParams<{ id: string }>();
  const { produtos, deleteProduto } = useProduto();
  const { fornecedores, deleteFornecedor } = useFornecedor();
  const { pedidos, deletePedido } = usePedido();
  const { clientes, deleteCliente } = useCliente();

  const navigate = useNavigate();

  if (type === "produto") {
    useEffect(() => {
      const produto = produtos.find((p) => p.id === Number(id));
      if (produto) {
        deleteProduto(produto.id);
        navigate("/produtos");
      }
    }, [id, produtos, deleteProduto, navigate]);
  } else if (type === "fornecedor") {
    useEffect(() => {
      const fornecedor = fornecedores.find((p) => p.id === Number(id));
      if (fornecedor) {
        deleteFornecedor(fornecedor.id);
        navigate("/fornecedores");
      }
    }, [id, fornecedores, deleteFornecedor, navigate]);
  } else if (type === "pedido") {
    useEffect(() => {
      const pedido = pedidos.find((p) => p.id === Number(id));
      if (pedido) {
        deletePedido(pedido.id);
        navigate("/pedidos");
      }
    }, [id, fornecedores, deleteFornecedor, navigate]);
  } else if (type === "cliente") {
    useEffect(() => {
      const cliente = clientes.find((p) => p.id === Number(id));
      if (cliente) {
        deleteCliente(cliente.id);
        navigate("/clientes");
      }
    }, [id, fornecedores, deleteFornecedor, navigate]);
  }

  return <h1>Excluindo produto...</h1>;
}
