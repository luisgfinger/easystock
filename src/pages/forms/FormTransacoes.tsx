import { useTransacao } from "../../context/TransacaoContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";
import { useProduto } from "../../context/ProdutoContext";

interface FormProps {
  edit: boolean;
}

const FormTransacoes: React.FC<FormProps> = ({ edit }) => {
  const { transacoes, addTransacao, updateTransacao } = useTransacao();
  const {produtos} = useProduto();
  const [tipo, setTipo] = useState("")
  const [valor, setValor] = useState(0)
  const [produtoId, setProdutoId] = useState(0)
  const [pedidoId, setPedidoId] = useState(0)
  const [quantidade, setQuantidade] = useState(0)
  const [preco, setPreco] = useState(0)

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  useEffect(() => {
    if (edit && id) {
      const transacao = transacoes.find((p) => p.id === Number(id));
      if (transacao) {
        setTipo(transacao.tipo.toString)
        setValor(transacao.valor)
        setProdutoId(transacao.produtoId)
        setPedidoId(transacao.pedidoId)
      }
    }
  }, [edit, id, transacoes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novaTransacao = {
      id: id ? Number(id) : Math.random(),
      data: new Date(),
      tipo: 'entrada',
      valor: quantidade*preco,
      produtoId,
      pedidoId
    };

    if (edit && id) {
      updateTransacao(novaTransacao);
    } else {
      addTransacao(novaTransacao);
    }

    navigate("/transacoes");
  };

  return (
    <div className="form-page flex-column">
  <h3>{edit ? "Editar Transacao" : "Cadastro de Transacao"}</h3>
  <form onSubmit={handleSubmit} className="flex-column">
    {produtos.length > 0 ? (
      <>
        <select
          value={produtoId}
          onChange={(e) => {
            const produtoIdSelecionado = Number(e.target.value);
            setProdutoId(produtoIdSelecionado);
            const produtoSelecionado = produtos.find(
              (produto) => produto.id === produtoIdSelecionado
            );

            if (produtoSelecionado) { 
              setPreco(produtoSelecionado.preco); 
            } else {
              setPreco(0); 
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
        />
      </>
    ) : (
      <h3>Sem produtos</h3>
    )}
    <button className="submit-button" type="submit">
      {edit ? "Atualizar" : "Cadastrar"}
    </button>
  </form>
</div>

  );
};

export default FormTransacoes;
