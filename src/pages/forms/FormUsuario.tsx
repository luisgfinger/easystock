import { useUsuario } from "../../context/UsuarioContex";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form.css";

interface FormProps {
  edit: boolean;
}

const FormUsuarios: React.FC<FormProps> = ({ edit }) => {
  const { usuarios, addUsuario, updateUsuario } = useUsuario();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState(0); 
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  useEffect(() => {
    if (edit && id) {
      const usuario = usuarios.find((p) => p.id === Number(id));
      if (usuario) {
        setNome(usuario.nome);
        setEmail(usuario.email);
        setSenha(usuario.senha);
        setTipo(usuario.admin ? 1 : 0);
      }
    }
  }, [edit, id, usuarios]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoUsuario = {
      id: id ? Number(id) : Math.random(),
      nome,
      email,
      senha,
      admin: tipo === 1, 
    };

    if (edit && id) {
      updateUsuario(novoUsuario);
    } else {
      addUsuario(novoUsuario);
    }

    navigate("/usuarios/lista");
  };

  return (
    <div className="form-page flex-column">
      <h3>{edit ? "Editar Usuario" : "Cadastro de Usuario"}</h3>
      <form onSubmit={handleSubmit} className="flex-column">
        <label>Nome:</label>
        <input
          type="text"
          maxLength={45}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          maxLength={45}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          maxLength={15}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        
        <label>Selecione o tipo de usuário</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(Number(e.target.value))}
          required
        >
          <option value="">Selecione um tipo de usuário</option>
          <option value={1}>Administrador</option>
          <option value={0}>Comum</option>
        </select>

        <button className="submit-button" type="submit">
          {edit ? "Atualizar" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
};

export default FormUsuarios;
