import "../pagesCSS/dashboard.css";
import logo from "../assets/OdontoMax_Logo1.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

type Produto = {
  id_produto: number;
  nome: string;
  quantidade: number;
  quantidade_minima: number;
};

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nomeUsuario = usuario.nome || "Usuário";
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState<Produto[]>([]);

  useEffect(() => {
  async function buscarAlertas() {
    try {
      const response = await api.get("/produtos");

      const produtos = response.data;

      const produtosAlerta = produtos.filter(
        (p: Produto) =>
          p.quantidade <= p.quantidade_minima
      );

      setAlertas(produtosAlerta);

    } catch (error) {
      console.log(error);
    }
  }

  buscarAlertas();
  }, []);

  function Logout() {
  localStorage.removeItem("token"); // remove o token
  navigate("/"); // volta para login
}

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <header className="dashboard-header">
        <img src={logo} className="logo" />

        <h3>Bem-vindo(a), {nomeUsuario}</h3>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-main">

        <div className="menu-botoes">
            <button onClick={() => navigate("/produtos")}>
                Produtos
            </button>

            <button onClick={() => navigate("/usuarios")}>
                Usuários
            </button>

            <button onClick={() => navigate("/movimentacoes")}>
                Movimentações
            </button>
        </div>

        <div className="alertas">
          <h3>Produtos em Alerta</h3>

          {alertas.length === 0 ? (
          <p>Nenhum produto em alerta</p>
          ) : (
          alertas.map((produto) => (
          <div key={produto.id_produto}>
            <p>
            {produto.nome} — Qtd. Disponível: {produto.quantidade} — Qtd. mínima: {produto.quantidade_minima}
            </p>
          </div>
          ))
          )}
        </div>

        <button className="btn-sair" onClick={Logout}>
            Sair
        </button>

      </main>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>SAC: 0800-544-221</p>
        <p>Telefone: (81) 92828-5493</p>
        <p>Email: suporte@odontomax.com</p>
        <p>CNPJ: 10.180.270/0741-10</p>
      </footer>

    </div>
  );
}