import { useCliente } from "../../context/ClienteContext";
import Button from "../Ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";

const ClienteList: React.FC = () => {
  const { clientes } = useCliente();
  const navigate = useNavigate();

  const editCliente = (id: number) => {
    navigate(`/clientes/editar/${id}`);
  };

  const deleteCliente = (id: number) => {
    navigate(`/clientes/deletar/${id}`);
  };

  return (
    <ul className="content">
      {clientes.length > 0 ? (
        clientes.map((cliente) => (
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
