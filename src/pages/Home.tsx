import FornecedorList from "../components/FornecedorList";
import ProfileIcon from "../components/Icons/ProfileIcon";
import Logo from "../components/Logo";
import PedidoList from "../components/PedidoList";
import ProdutoList from "../components/ProdutoList";
import { FornecedorProvider } from "../context/FornecedorContext";
import { PedidoProvider } from "../context/PedidoContext";
import { ProdutoProvider } from "../context/ProdutoContext";
import { useLocation } from 'react-router-dom';

import "../styles/home.css";

export default function Home() {
  const location = useLocation();

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
              {location.pathname === '/fornecedores' && (
                <section id="fornecedorList">
                  <FornecedorList />
                </section>
              )}
              {location.pathname === '/produtos' && (
                <section id="produtoList">
                  <ProdutoList />
                </section>
              )}
              {location.pathname === '/pedidos' && (
                <section id="pedidoList">
                  <PedidoList />
                </section>
              )}
            </div>
          </PedidoProvider>
        </ProdutoProvider>
      </FornecedorProvider>
    </div>
  );
}
