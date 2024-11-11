import { useCliente } from "../../context/ClienteContext";
import Button from "../Ui/Button";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ClienteListProps {
  buscaNome?: string;
  buscaCpf_cnpj?: string;
}

const ClienteList: React.FC<ClienteListProps> = ({ buscaNome, buscaCpf_cnpj }) => {
  const { clientes } = useCliente();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const admin = localStorage.getItem("admin")
    if (!usuarioLogado || !admin) {
      navigate("/login");
    }
  }, [navigate]);
  
  

  const editCliente = (id: number) => {
    navigate(`/clientes/editar/${id}`);
  };

  const deleteCliente = (id: number) => {
    navigate(`/clientes/deletar/${id}`);
  };

  const ClientesFiltrados = clientes.filter((cliente) => {
    const nomeMatch = buscaNome
      ? cliente.nome.toLowerCase().includes(buscaNome.toLowerCase())
      : true;

    const cpf_cnpjMatch = buscaCpf_cnpj
      ? cliente.cpf_cnpj.toLowerCase().includes(buscaCpf_cnpj.toLowerCase())
      : true;

    return nomeMatch && cpf_cnpjMatch;
  });

  


  return (
    <ul className="content">
      {ClientesFiltrados.length > 0 ? (
        ClientesFiltrados.map((cliente) => (
          
          <li key={cliente.id}>
            <ul className="inside flex-column">
              <li>
                <h3>{cliente.nome}</h3>
              </li>
              <li>{cliente.cpf_cnpj}</li>
              <li><p>{cliente.contato}</p></li>
              <li><p>{cliente.endereco}</p></li>
              <div className="delete-edit-button flex-column">
                <Button
                  text="Editar cliente"
                  onClick={() => editCliente(cliente.id)}
                />
                <span className="delete-button">
                  <Button
                    text="Excluir"
                    onClick={() => deleteCliente(cliente.id)}
                  />
                </span>
              </div>
            </ul>
          </li>
        ))
      ) : (
        <li>
          <h3>Nenhum cliente encontrado</h3>
        </li>
      )}
    </ul>
  );
};

export default ClienteList;
