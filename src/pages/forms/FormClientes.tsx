import { useCliente } from "../../context/ClienteContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

interface FormProps {
  edit: boolean;
}

const FormClientes: React.FC<FormProps> = ({ edit }) => {
  const { clientes, addCliente, updateCliente } = useCliente();
  const [nome, setNome] = useState("");
  const [cpf_cnpj, setCpf_cnpj] = useState("");
  const [contato, setContato] = useState("");
  const [endereco, setEndereco] = useState("");
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const admin = localStorage.getItem("admin")
    if (!usuarioLogado || !admin) {
      navigate("/login");
    }
  }, [navigate]);
  

  useEffect(() => {
    if (edit && id) {
      const cliente = clientes.find((p) => p.id === Number(id));
      if (cliente) {
        setNome(cliente.nome);
        setCpf_cnpj(cliente.cpf_cnpj);
        setContato(cliente.contato);
        setEndereco(cliente.endereco);
      }
    }
  }, [edit, id, clientes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoCliente = {
      id: id ? Number(id) : Math.random(),
      nome,
      cpf_cnpj,
      contato,
      endereco,
    };

    if (edit && id) {
      updateCliente(novoCliente);
    } else {
      addCliente(novoCliente);
    }

    navigate("/clientes");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Cliente" : "Cadastro de Cliente"}</h3>
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

        <label>CPF_CNPJ:</label>
        <input
          type="text"
          maxLength={14}
          value={cpf_cnpj}
          onChange={(e) => setCpf_cnpj(e.target.value)}
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

export default FormClientes;
