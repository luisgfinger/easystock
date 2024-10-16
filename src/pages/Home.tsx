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
import FormClientes from "../components/forms/FormClientes";
import ClienteList from "../components/listas/ClienteList";
import { ClienteProvider } from "../context/ClienteContext";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaFornecedor, setBuscaFornecedor] = useState("");
  const [ordenacao, setOrdenacao] = useState("crescente");
  const [buscaCpf_cnpj, setBuscaCpf_cnpj] = useState("");

  const addProduto = () => {
    navigate("/produtos/cadastrar");
  };

  const addFornecedor = () => {
    navigate("/fornecedores/cadastrar");
  };

  const addPedido = () => {
    navigate("/pedidos/cadastrar");
  };

  const addCliente = () => {
    navigate("/clietes/cadastrar");
  };

  const handleOrdenacaoChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setOrdenacao(event.target.value);
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
              <a href="/clientes">Clientes</a>
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
        <ClienteProvider>
          <ProdutoProvider>
            <PedidoProvider>
              <div id="listas" className="flex-column">
                <Routes>
                  <Route
                    path="/fornecedores"
                    element={
                      <>
                        <div className="add-button">
                          <Button text="Adicionar" onClick={addFornecedor} />
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
                    path="/clientes"
                    element={
                      <>
                        <div className="add-button">
                          <Button text="Adicionar" onClick={addCliente} />
                        </div>
                        <form className="filtro-form flex-column">
                          <label>Nome: </label>
                          <input
                            type="text"
                            value={buscaNome}
                            onChange={(e) => setBuscaNome(e.target.value)}
                            placeholder="Insira o nome"
                          />
                          <label>CPF ou CNPJ: </label>
                          <input
                            type="text"
                            value={buscaCpf_cnpj}
                            onChange={(e) => setBuscaCpf_cnpj(e.target.value)}
                            placeholder="Insira CPF ou CNPJ"
                          />
                        </form>
                        <ClienteList />
                      </>
                    }
                  />
                  <Route
                    path="/clientes/cadastrar"
                    element={<FormClientes edit={false} />}
                  />
                  <Route
                    path="/clientes/editar/:id"
                    element={<FormClientes edit={true} />}
                  />
                  <Route
                    path="/clientes/deletar/:id"
                    element={<Delete type="cliente" />}
                  />

                  <Route
                    path="/produtos"
                    element={
                      <>
                        <div className="add-button">
                          <Button text="Adicionar" onClick={addProduto} />
                        </div>
                        <form className="filtro-form flex-column">
                          <label>Nome: </label>
                          <input
                            type="text"
                            value={buscaNome}
                            onChange={(e) => setBuscaNome(e.target.value)}
                            placeholder="Insira o nome"
                          />
                          <label>Fornecedor: </label>
                          <input
                            type="text"
                            value={buscaFornecedor}
                            onChange={(e) => setBuscaFornecedor(e.target.value)}
                            placeholder="Insira o fornecedor"
                          />
                          <label>Ordenar por preço: </label>
                          <select
                            value={ordenacao}
                            onChange={handleOrdenacaoChange}
                          >
                            <option value="crescente">Crescente</option>
                            <option value="decrescente">Decrescente</option>
                          </select>
                        </form>
                        <ProdutoList
                          buscaNome={buscaNome}
                          buscaFornecedor={buscaFornecedor}
                          ordenacao={ordenacao}
                        />
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
        </ClienteProvider>
      </FornecedorProvider>
    </div>
  );
}
