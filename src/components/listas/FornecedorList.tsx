/*id number Chave primária
nome string Nome do fornecedor
contato string Informações de contato
endereco string Endereço do fornecedor
*/

import React from 'react';
import { useFornecedor } from '../../context/FornecedorContext';

const FornecedorList: React.FC = () => {
  const { fornecedores } = useFornecedor(); 

  return (
    <ul>
      {fornecedores.length > 0 ? (
        fornecedores.map((fornecedor) => (
          <li key={fornecedor.id}>
            <h3>{fornecedor.nome}</h3>
            <ul>
              <li>Contato: {fornecedor.contato}</li>
              <li>Endereço: {fornecedor.endereco}</li>
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
