/*id number Chave primária
nome string Nome do fornecedor
contato string Informações de contato
endereco string Endereço do fornecedor
*/

import React, { useState, useEffect } from "react";
import { useFornecedor } from "../../context/FornecedorContext";
import { useNavigate, useParams } from "react-router-dom";

import '../../styles/form.css'

interface FormProps {
  edit: boolean;
}

const FormFornecedores: React.FC<FormProps> = ({ edit }) => {
  const { fornecedores, addFornecedor, updateFornecedor } = useFornecedor();
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [endereco, setEndereco] = useState("");
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (edit && id) {
      const fornecedor = fornecedores.find((p) => p.id === Number(id));
      if (fornecedor) {
        setNome(fornecedor.nome);
        setContato(fornecedor.contato);
        setEndereco(fornecedor.endereco);
      }
    }
  }, [edit, id, fornecedores]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoFornecedor = {
      id: id ? Number(id) : Math.random(), 
      nome,
      contato,
      endereco,
    };

    if (edit && id) {
      updateFornecedor(novoFornecedor); 
    } else {
      addFornecedor(novoFornecedor); 
    }

    navigate("/fornecedores");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Fornecedor" : "Cadastro de Fornecedor"}</h3>
      <form onSubmit={handleSubmit} className="flex-column">
        <label>Nome:</label>
        <input
          type="text"
          maxLength={45}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
       
        <label>Contato:</label>
        <input
          type="text"
          maxLength={45}
          value={contato}
          onChange={(e) => setContato(e.target.value)}
          required
        />
        
        <label>Endereço:</label>
        <input
          type="text"
          maxLength={100}
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          required
        />

        <button className="submit-button" type="submit">{edit ? "Atualizar" : "Cadastrar"}</button> 
      </form>
    </div>
  );
};

export default FormFornecedores;
