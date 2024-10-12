import React from 'react';
import { useProduto } from '../../context/ProdutoContext';
import { useFornecedor } from '../../context/FornecedorContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Ui/Button';

const ProdutoList: React.FC = () => {
  const { produtos } = useProduto(); 
  const { fornecedores } = useFornecedor();
  const navigate = useNavigate(); 

  const editProduto = (id: number) => {
    navigate(`/produtos/editar/${id}`);
  };

  const deleteProduto = (id: number) =>{
    navigate(`/produtos/deletar/${id}`);
  }
  
  return (
    <ul>
      {produtos.length > 0 ? (
        produtos.map((produto) => {
          const fornecedor = fornecedores.find(f => f.id === produto.fornecedorId);
          return (
            <li key={produto.id}>
              <ul>
                <li><h1>{produto.id}</h1></li>
                <li><h2>{produto.nome}</h2></li>
                <li><img src={produto.imagem} alt="img produto" /></li>
                <li><h3>{produto.descricao}</h3></li>
                <li><h3>R${produto.preco},00</h3></li>
                <li><p>Quantidade: {produto.quantidade}</p></li>
                <li>{fornecedor ? <p>{fornecedor.nome}</p> : <p>Fornecedor não encontrado</p>}</li>
                <Button text="Editar produto" onClick={() => editProduto(produto.id)} />
                <Button text="Excluir produto" onClick={() => deleteProduto(produto.id)}/>
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
