/*id number Chave primária
nome string Nome do fornecedor
contato string Informações de contato
endereco string Endereço do fornecedor
*/

import { useFornecedor } from "../../context/FornecedorContext";
import Button from "../Ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/list.css";

const FornecedorList: React.FC = () => {
  const { fornecedores } = useFornecedor();
  const navigate = useNavigate();

  const editFornecedor = (id: number) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const deleteFornecedor = (id: number) => {
    navigate(`/fornecedores/deletar/${id}`);
  };

  return (
    <ul className="content">
      {fornecedores.length > 0 ? (
        fornecedores.map((fornecedor) => (
          <li key={fornecedor.id}>
            <ul className="inside flex-column">
              <li>
                <h3>{fornecedor.nome}</h3>
              </li>
              <li><p>{fornecedor.contato}</p></li>
              <li><p>{fornecedor.endereco}</p></li>
              <div className="delete-edit-button flex-column">
                <Button
                  text="Editar fornecedor"
                  onClick={() => editFornecedor(fornecedor.id)}
                />
                <span className="delete-button">
                  <Button
                    text="Excluir"
                    onClick={() => deleteFornecedor(fornecedor.id)}
                  />
                </span>
              </div>
            </ul>
          </li>
        ))
      ) : (
        <li>
          <h3>Nenhum fornecedor encontrado</h3>
        </li>
      )}
    </ul>
  );
};

export default FornecedorList;
