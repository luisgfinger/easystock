
import { useFornecedor } from "../../context/FornecedorContext";
import Button from "../Ui/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/list.css";

interface FornecedorListProps{
  buscaNome?: string,
  buscaContato?: string
}

const FornecedorList: React.FC<FornecedorListProps> = ({ buscaNome, buscaContato }) => {
  const { fornecedores } = useFornecedor();
  const navigate = useNavigate();
  
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  const editFornecedor = (id: number) => {
    navigate(`/fornecedores/editar/${id}`);
  };

  const deleteFornecedor = (id: number) => {
    navigate(`/fornecedores/deletar/${id}`);
  };

  const FornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const nomeMatch = buscaNome
      ? fornecedor.nome.toLowerCase().includes(buscaNome.toLowerCase())
      : true;

    const contatoMatch = buscaContato
      ? fornecedor.contato.toLowerCase().includes(buscaContato.toLowerCase())
      : true;

    return nomeMatch && contatoMatch;
  });

  return (
    <ul className="content">
      {FornecedoresFiltrados.length > 0 ? (
        FornecedoresFiltrados.map((fornecedor) => (
          <li key={fornecedor.id}>
            <ul className="inside flex-column">
              <li>
                <h3>{fornecedor.nome}</h3>
              </li>
              <li><p>{fornecedor.contato}</p></li>
              <li><p>{fornecedor.endereco}</p></li>
              <li>{fornecedor.cnpj}</li>
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
