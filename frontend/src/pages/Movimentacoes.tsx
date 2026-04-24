import "../pagesCSS/movimentacoes.css";
import logo from "../assets/OdontoMax_Logo1.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

type Movimentacao = {
  id_movimentacao: number;
  tipo: string;
  quantidade: number;
  data: string;

  produto: {
    nome: string;
  };

  usuario: {
    nome: string;
  };
};

export default function Movimentacoes() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nomeUsuario = usuario.nome || "Usuário";
  const navigate = useNavigate();
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  useEffect(() => {
    async function buscarMovimentacoes() {
      try {
        const response = await api.get("/movimentacoes");
        setMovimentacoes(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    buscarMovimentacoes();
  }, []);

  return (
    <div className="mov-container">

      {/* HEADER */}
      <header className="mov-header">
        <img src={logo} className="logo" />
        <h3>Bem-vindo(a), {nomeUsuario}</h3>
      </header>

      {/* MAIN */}
      <main className="mov-main">

        <h2>Histórico de Movimentações</h2>

        <div className="lista-mov">

          {movimentacoes.map((mov) => (
            <div className="mov-card" key={mov.id_movimentacao}>

              <div className="mov-info">
                <p><strong>Produto:</strong> {mov.produto.nome}</p>
                <p><strong>Qtd:</strong> {mov.quantidade}</p>
                <p><strong>Tipo:</strong> {mov.tipo}</p>
                <p><strong>Usuário:</strong> {mov.usuario.nome}</p>
                <p><strong>Data:</strong> {new Date(mov.data).toLocaleString("pt-BR")}</p>
              </div>

            </div>
          ))}

        </div>

        {/* AÇÕES */}
        <div className="mov-acoes">
            <button 
                className="btn-nav"
                onClick={() => navigate("/dashboard")}
            >
                Dashboard
            </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="mov-footer">
        <p>SAC: 0800-544-221</p>
        <p>Telefone: (81) 92828-5493</p>
        <p>Email: suporte@odontomax.com</p>
        <p>CNPJ: 10.180.270/0741-10</p>
      </footer>

    </div>
  );
}