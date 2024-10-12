import React, { useState, useEffect } from "react";
import { useProduto } from "../../context/ProdutoContext";
import { useNavigate } from "react-router-dom";

interface FormProps {
  edit: boolean;
  id?: number;
}

const FormProduto: React.FC<FormProps> = ({ edit, id }) => {
  const { produtos, addProduto, updateProduto } = useProduto();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [imagem, setImagem] = useState("");
  const [fornecedorId, setFornecedorId] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (edit && id !== undefined) {
      const produto = produtos.find((p) => p.id === id);
      if (produto) {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setQuantidade(produto.quantidade);
        setImagem(produto.imagem);
        setFornecedorId(produto.fornecedorId);
      }
    }
  }, [edit, id, produtos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoProduto = {
      id: id ?? Math.random(),
      nome,
      descricao,
      preco,
      quantidade,
      imagem,
      fornecedorId,
    };

    if (edit && id !== undefined) {
      updateProduto(novoProduto);
    } else {
      addProduto(novoProduto);
    }
    
    navigate("/produtos");
  };

  return (
    <div>
      <h3>{edit ? "Editar Produto" : "Cadastro de Produto"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <br />
        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <br />
        <label>Preço:</label>
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          required
        />
        <br />
        <label>Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          required
        />
        <br />
        <label>Imagem (URL):</label>
        <input
          type="text"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          required
        />
        <br />
        <label>Fornecedor ID:</label>
        <input
          type="number"
          value={fornecedorId}
          onChange={(e) => setFornecedorId(Number(e.target.value))}
          required
        />
        <br />
        <button type="submit">{edit ? "Atualizar" : "Cadastrar"}</button>
      </form>
    </div>
  );
};

export default FormProduto;
