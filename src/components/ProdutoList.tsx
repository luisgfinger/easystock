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

import '../styles/produto.css'

const ProdutoList: React.FC = () => {
  const { produtos } = useProduto(); 
  const { fornecedores } = useFornecedor(); 

  return (
    <ul id='content' className='flex-column'>
      {produtos.length > 0 ? (
        produtos.map((produto) => {
          const fornecedor = fornecedores.find(f => f.id === produto.fornecedorId);
          return (
            <li key={produto.id}>
              <ul className='flex-column'>  
                <li><h2>{produto.nome}</h2></li>
                <li><img src={produto.imagem} alt="img produto" /></li>
                <li><h3>{produto.descricao}</h3></li>
                <li><h3>R${produto.preco},00</h3></li>
                <li> {fornecedor ? <p>{fornecedor.nome}</p> : <p>Fornecedor não encontrado</p>}</li>
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
