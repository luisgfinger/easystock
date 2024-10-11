/*
id number Chave primária
nome string Nome do produto
descricao string Descrição do produto
preco number Preço do produto
quantidade number Quantidade disponível em estoque
imagem string URL da imagem do produto (upload)
fornecedorId number Chave estrangeira para a tabela Fornecedor
*/
import React from 'react';
import { useProduto } from '../context/ProdutoContext';
import { useFornecedor } from '../context/FornecedorContext';

const ProdutoList: React.FC = () => {
  const { produtos } = useProduto(); 
  const { fornecedores } = useFornecedor(); 

  return (
    <ul>
      {produtos.length > 0 ? (
        produtos.map((produto) => {
          const fornecedor = fornecedores.find(f => f.id === produto.fornecedorId);
          return (
            <li key={produto.id}>
              <h3>{produto.nome}</h3>
              <ul>
                <li>Descrição: {produto.descricao}</li>
                <li>Preço: {produto.preco}</li>
                <li>Quantidade: {produto.quantidade}</li>
                <li>Imagem: {produto.imagem}</li>
              </ul>
              {fornecedor ? <p>Fornecedor: {fornecedor.nome}</p> : <p>Fornecedor não encontrado</p>}
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
