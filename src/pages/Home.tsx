import Delete from "../components/Delete";
import ProfileIcon from "../components/Icons/ProfileIcon";
import Logo from "../components/Logo";
import Button from "../components/Ui/Button";
import FormFornecedores from "../components/forms/FormFornecedores";
import FormPedido from "../components/forms/FormPedido";
import FormProduto from "../components/forms/FormProduto";
import FornecedorList from "../components/listas/FornecedorList";
import PedidoList from "../components/listas/PedidoList";
import ProdutoList from "../components/listas/ProdutoList";
import { FornecedorProvider } from "../context/FornecedorContext";
import { PedidoProvider } from "../context/PedidoContext";
import { ProdutoProvider } from "../context/ProdutoContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const addProduto = () => {
    navigate("/produtos/cadastrar");
  };

  const addFornecedor = () => {
    navigate("/fornecedores/cadastrar");
  };

  const addPedido = () => {
    navigate("/pedidos/cadastrar");
  };

  return (
    <div className="container">
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
            <div id="listas" className="flex-column">
              <Routes>
                <Route
                  path="/fornecedores"
                  element={
                    <>
                      <div className="add-button">
                        <Button
                          text="Adicionar"
                          onClick={addFornecedor}
                        />
                      </div>
                      <FornecedorList />
                    </>
                  }
                />
                <Route
                  path="/fornecedores/cadastrar"
                  element={<FormFornecedores edit={false} />}
                />
                <Route
                  path="/fornecedores/editar/:id"
                  element={<FormFornecedores edit={true} />}
                />
                <Route
                  path="/fornecedores/deletar/:id"
                  element={<Delete type="fornecedor" />}
                />
                <Route
                  path="/produtos"
                  element={
                    <>
                      <div className="add-button">
                        <Button text="Adicionar" onClick={addProduto} />
                      </div>
                      <ProdutoList />
                    </>
                  }
                />
                <Route
                  path="/produtos/cadastrar"
                  element={<FormProduto edit={false} />}
                />
                <Route
                  path="/produtos/editar/:id"
                  element={<FormProduto edit={true} />}
                />
                <Route
                  path="/produtos/deletar/:id"
                  element={<Delete type="produto" />}
                />

                <Route
                  path="/pedidos"
                  element={
                    <>
                      <div className="add-button">
                        <Button text="Adicionar" onClick={addPedido} />
                      </div>
                      <PedidoList />
                    </>
                  }
                />

                <Route
                  path="/pedidos/cadastrar"
                  element={<FormPedido edit={false} />}
                />
                <Route
                  path="/pedidos/editar/:id"
                  element={<FormPedido edit={true} />}
                />
                <Route
                  path="/pedidos/deletar/:id"
                  element={<Delete type="pedido" />}
                />
              </Routes>
            </div>
          </PedidoProvider>
        </ProdutoProvider>
      </FornecedorProvider>
    </div>
  );
}
