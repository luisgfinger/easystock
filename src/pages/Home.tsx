import FornecedorList from "../components/listas/FornecedorList";
import ProfileIcon from "../components/Icons/ProfileIcon";
import Logo from "../components/Logo";
import PedidoList from "../components/listas/PedidoList";
import ProdutoList from "../components/listas/ProdutoList";
import { FornecedorProvider } from "../context/FornecedorContext";
import { PedidoProvider } from "../context/PedidoContext";
import { ProdutoProvider } from "../context/ProdutoContext";
import { redirect, Route, Routes, useNavigate } from 'react-router-dom';

import "../styles/home.css";
import Button from "../components/Ui/Button";
import FormProduto from "../components/forms/formProduto";

export default function Home() {
  const navigate = useNavigate();

  const addProduto = () =>{
    navigate('/produtos/cadastrar') 
  }

  return (
    <div>
      <header id="header" className="flex-row">
        <span className="logotype">
          <Logo />
        </span>
        <span className="profileIcon">
          <ProfileIcon />
        </span>
      </header>

      <section id="navigate" className="container">
        <nav className="navbar flex-row">
          <ul className="flex-row">
            <li>
              <a href="/fornecedores">Fornecedores</a>
            </li>
            <li>
              <a href="/produtos">Produtos</a>
            </li>
            <li>
              <a href="/pedidos">Pedidos</a>
            </li>
          </ul>
        </nav>
      </section>

      <FornecedorProvider>
        <ProdutoProvider>
          <PedidoProvider>
          <div id="listas">
              <Routes>
                <Route path="/fornecedores" element={<FornecedorList />} />
                <Route path="/produtos/*" element={
                  <>
                  <div className="buttons flex-row">
                  <Button text="Adicionar produto" onClick={addProduto} />
                  </div>
                    
                    <ProdutoList />
                  </>
                } />
                <Route path="/pedidos" element={<PedidoList />} />
                <Route path="/produtos/cadastrar" element={<FormProduto edit={false}/>}/>
              </Routes>
            </div>
          </PedidoProvider>
        </ProdutoProvider>
      </FornecedorProvider>
    </div>
  );
}
