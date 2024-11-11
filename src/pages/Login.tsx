import React, { useState } from "react";
import "../styles/login.css";
import { useUsuario } from "../context/UsuarioContex";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { usuarios } = useUsuario();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, insira o e-mail e a senha.");
      return;
    }
    setError("");
    
  const usuario = usuarios.find((u) => u.email === email);


  if(usuario){
    if(usuario.senha === password){
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        if(usuario.admin){
            localStorage.setItem("admin", JSON.stringify(usuario));
        }
        
        navigate("/")
    }
  }

  };

  const register = () => {
    navigate("/usuarios/cadastrar");
  };


  return (
    <div className="login-container">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

      <h2 className="register" onClick={register}>
        Cadastre-se aqui
      </h2>
    </div>
  );
};

export default Login;
