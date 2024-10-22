/*id number Chave primária
nome string Nome do usuário
email string Email do usuário
senha string Senha armazenada com hash
*/

import React, { createContext, useState, ReactNode, useContext } from "react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}

interface UsuarioContextType {
  usuarios: Usuario[];
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usuarios] = useState<Usuario[]>([
    {
        id: 1,
        nome: 'User 1',
        email: 'email1@email.com',
        senha: 'senha1',
        admin: true
    },
    {
        id: 2,
        nome: 'User 2',
        email: 'email1@email.com',
        senha: 'senha2',
        admin: false
    },
  ]);

  return (
    <UsuarioContext.Provider value={{ usuarios }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario deve ser usado dentro do UsuarioProvider");
  }
  return context;
};
