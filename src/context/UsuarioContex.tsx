import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  admin: boolean;
}

interface UsuarioContextType {
  usuarios: Usuario[];
  addUsuario: (novoUsuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (usuarioAtualizado: Usuario) => void;
  deleteUsuario: (id: number) => void;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/usuario')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Erro ao buscar usuarios:', error));
  }, []);

  const addUsuario = async (novoUsuario: Omit<Usuario, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3001/api/usuario', novoUsuario);
      setUsuarios(prevUsuarios => [
        ...prevUsuarios,
        { ...novoUsuario, id: response.data.id },
      ]);
    } catch (error) {
      console.error('Erro ao adicionar usuario:', error);
    }
  };

  const updateUsuario = async (usuarioAtualizado: Usuario) => {
    try {
      await axios.put(`http://localhost:3001/api/usuario/${usuarioAtualizado.id}`, usuarioAtualizado);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(usuario =>
          usuario.id === usuarioAtualizado.id ? usuarioAtualizado : usuario
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar usuario:', error);
    }
  };

  const deleteUsuario = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuario/${id}`);
      setUsuarios(prevUsuarios =>
        prevUsuarios.filter(usuario => usuario.id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir usuario:', error);
    }
  };

  return (
    <UsuarioContext.Provider value={{ usuarios, addUsuario, updateUsuario, deleteUsuario }}>
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
