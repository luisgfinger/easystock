/*id number Chave primária
nome string Nome do usuário
email string Email do usuário
senha string Senha armazenada com hash
*/

import React from 'react';
import { useUsuario } from '../context/UsuarioContext';


const UsuarioList: React.FC = () => {
  const { usuarios } = useUsuario(); 
  return (
    <ul>
      {usuarios.length > 0 ? (
        usuarios.map((usuario) => {
          return (
            <li key={usuario.id}>
              <h3>Usuário: {usuario.nome}</h3>
              <ul>
                <li>Email: {usuario.email}</li>
                <li>Senha: {usuario.senha}</li>
              </ul>
            </li>
          );
        })
      ) : (
        <li>
          <h3>Nenhum usuario encontrado</h3>
        </li>
      )}
    </ul>
  );
};

export default UsuarioList;
