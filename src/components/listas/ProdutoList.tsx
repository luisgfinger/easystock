import React from "react";
import { useFornecedor } from "../../context/FornecedorContext";
import { useProduto } from "../../context/ProdutoContext";
import Button from "../Ui/Button";
import { useNavigate } from "react-router-dom";

interface ProdutoListProps {
  buscaNome?: string;
  buscaFornecedor?: string;
  ordenacao?: string;
}

const ProdutoList: React.FC<ProdutoListProps> = ({ buscaNome, buscaFornecedor, ordenacao }) => {
  const { produtos } = useProduto();
  const { fornecedores } = useFornecedor();
  const navigate = useNavigate();

  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if(!usuarioLogado){
    navigate("/login")
  }

  const editProduto = (id: number) => {
    navigate(`/produtos/editar/${id}`);
  };

  const deleteProduto = (id: number) => {
    navigate(`/produtos/deletar/${id}`);
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const fornecedor = fornecedores.find((f) => f.id === produto.fornecedorId);

    const nomeMatch = buscaNome
      ? produto.nome.toLowerCase().includes(buscaNome.toLowerCase())
      : true;

    const fornecedorMatch = buscaFornecedor && fornecedor
      ? fornecedor.nome.toLowerCase().includes(buscaFornecedor.toLowerCase())
      : true;

    return nomeMatch && fornecedorMatch;
  });

  const produtosOrdenados = produtosFiltrados.sort((a, b) => {
    if (ordenacao === "crescente") {
      return a.preco - b.preco; 
    } else {
      return b.preco - a.preco;
    }
  });

  return (
    <ul className="content">
     {produtosOrdenados.length > 0 ? (
        produtosOrdenados.map((produto) => {
          const fornecedor = fornecedores.find(
            (f) => f.id === produto.fornecedorId
          );
          return (
            <li key={produto.id}>
              <ul className="inside flex-column">
                <li>
                  <h3>{produto.nome}</h3>
                </li>
                <li>
                <img src={`http://localhost:3001${produto.imagem}`} alt="Imagem do produto" />

                </li>
                <li>
                  <p>{produto.descricao}</p>
                </li>
                <li>
                  <h3>R${produto.preco},00</h3>
                </li>
                <li>
                  <p>Estoque: {produto.quantidade}</p>
                </li>
                <li>
                  {fornecedor ? (
                    <p>Por: {fornecedor.nome}</p>
                  ) : (
                    <p>Fornecedor não encontrado</p>
                  )}
                </li>

                <div className="delete-edit-button flex-column">
                  <Button
                    text="Editar produto"
                    onClick={() => editProduto(produto.id)}
                  />
                  <span className="delete-button">
                    <Button
                      text="Excluir"
                      onClick={() => deleteProduto(produto.id)}
                    />
                  </span>
                </div>
              </ul>
            </li>
          );
        })
      ) : (
        <li>
          <h3>Nenhum produto encontrado</h3>
        </li>
      )}
    </ul>
  );
};

export default ProdutoList;
