import React, { useState, useEffect } from "react";
import { useProduto } from "../../context/ProdutoContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../styles/form.css';
import { useFornecedor } from "../../context/FornecedorContext";

interface FormProps {
  edit: boolean;
}

const FormProduto: React.FC<FormProps> = ({ edit }) => {
  const { produtos, addProduto, updateProduto } = useProduto();
  const { fornecedores } = useFornecedor();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [imagemFile, setImagemFile] = useState<File | null>(null); 
  const [fornecedorId, setFornecedorId] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  useEffect(() => {
    if (edit && id) {
      const produto = produtos.find((p) => p.id === Number(id));
      if (produto) {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setQuantidade(produto.quantidade);
        setFornecedorId(produto.fornecedorId);
      }
    }
  }, [edit, id, produtos]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagemFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";

    if (imagemFile) {
      const formData = new FormData();
      formData.append("imagem", imagemFile);

      try {
        const uploadResponse = await axios.post("http://localhost:3001/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadResponse.data.imageUrl; 
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return;
      }
    }

    const novoProduto = {
      id: id ? Number(id) : Math.random(),
      nome,
      descricao,
      preco,
      quantidade,
      imagem: imageUrl,
      fornecedorId,
    };

    if (edit && id) {
      updateProduto(novoProduto);
    } else {
      addProduto(novoProduto);
    }

    navigate("/produtos");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Produto" : "Cadastro de Produto"}</h3>
      <form onSubmit={handleSubmit} className="flex-column">
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Preço:</label>
        <input
          type="number"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          required
        />

        <label>Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          required
        />

        <label>Imagem:</label>
        <input
          type="file"
          onChange={handleImageChange}
          required={!edit}
        />

        <label>Fornecedor:</label>
        <select
          value={fornecedorId}
          onChange={(e) => setFornecedorId(Number(e.target.value))}
        >
          <option value="">Selecione um fornecedor</option>
          {fornecedores.map((fornecedor) => (
            <option key={fornecedor?.id} value={fornecedor.id}>{fornecedor.nome}</option>
          ))}
        </select>

        <button className="submit-button" type="submit">{edit ? "Atualizar" : "Cadastrar"}</button>
      </form>
    </div>
  );
};

export default FormProduto;
