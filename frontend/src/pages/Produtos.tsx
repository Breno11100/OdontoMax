import "../pagesCSS/produtos.css";
import logo from "../assets/OdontoMax_Logo1.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

type Produto = {
  id_produto: number;
  nome: string;
  descricao: string;
  quantidade: number;
  quantidade_minima: number;
};

export default function Produtos() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nomeUsuario = usuario.nome || "Usuário";
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);  
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState(0);
  const [tipo, setTipo] = useState("ENTRADA");
  const [modalAdd, setModalAdd] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState(0);
  const [modalEditar, setModalEditar] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editQuantidadeMinima, setEditQuantidadeMinima] = useState(0);

  useEffect(() => {
  async function buscarProdutos() {
    try {
      const response = await api.get("/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  buscarProdutos();
  }, []);

  //Função modal movimentação
  async function handleMovimentar() {
  try {
    await api.post("/movimentacoes", {
      id_produto: produtoSelecionado,
      quantidade,
      tipo
    });

    alert("Movimentação realizada!");

    setModalAberto(false);

  } catch (error) {
    console.log(error);
    alert("Erro ao movimentar");
  }
  }

  //Função modal adicionar produtos
  async function handleAdicionarProduto() {
  try {
    await api.post("/produtos", {
      nome,
      descricao,
      quantidade_minima: quantidadeMinima
    });

    alert("Produto criado!");

    setModalAdd(false);

    // atualizar lista automaticamente
    window.location.reload();

  } catch (error) {
    console.log(error);
    alert("Erro ao criar produto");
  }
  }

  //Função excluir
  async function handleExcluirProduto(id: number) {
  try {
    await api.delete(`/produtos/${id}`);

    // remove do estado sem reload
    setProdutos((prev) =>
      prev.filter((produto) => produto.id_produto !== id)
    );

    alert("Produto excluído!");
  } catch (error) {
    console.log(error);
    alert("Erro ao excluir produto");
  }
  }

  //Modal de atualizar produto
  function abrirEdicao(produto: Produto) {
  setProdutoEditando(produto);

  setEditNome(produto.nome);
  setEditDescricao(produto.descricao);
  setEditQuantidadeMinima(produto.quantidade_minima);

  setModalEditar(true);
  }

  //Função PUT - Atualizar
  async function handleAtualizarProduto() {
  try {
    await api.put(`/produtos/${produtoEditando?.id_produto}`, {
      nome: editNome,
      descricao: editDescricao,
      quantidade_minima: editQuantidadeMinima
    });

    setProdutos((prev) =>
      prev.map((p) =>
        p.id_produto === produtoEditando?.id_produto
          ? {
              ...p,
              nome: editNome,
              descricao: editDescricao,
              quantidade_minima: editQuantidadeMinima
            }
          : p
      )
    );

    setModalEditar(false);

    alert("Produto atualizado!");
  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar produto");
  }
  }

  return (
    <div className="produtos-container">

      {/* HEADER */}
      <header className="produtos-header">
        <img src={logo} className="logo" />
        <h3>Bem-vindo(a), {nomeUsuario}</h3>
      </header>

      {/* MAIN */}
      <main className="produtos-main">

        <h2>Lista de Produtos</h2>

        <div className="lista-produtos">

          {produtos.map((produto) => (
          <div className="produto-card" key={produto.id_produto}>

          <div className="produto-topo">
             <p className="produto-nome">{produto.nome}</p>
          </div>


          <div className="produto-info">

            <div className="produto-dados">
              <p>{produto.descricao}</p>
              <p>Qtd. mínima: {produto.quantidade_minima}</p>
              <p>Qtd. Disponível: {produto.quantidade}</p>
            </div>

            <div className="acoes-produto">
              <button className="btn-atualizar"
              onClick={() => abrirEdicao(produto)}>
                Atualizar
              </button>

              <button className="btn-excluir"
              onClick={() => handleExcluirProduto(produto.id_produto)}>
                Excluir
              </button>
            </div>

          </div>

  </div>
))}

        </div>

        {/* BOTÕES INFERIORES */}
        <div className="produtos-acoes">
            <button 
                className="btn-nav" 
                onClick={() => navigate("/dashboard")}
            >
                Dashboard
            </button>
            <div className="acoes-direita">
                <button className="btn-nav btn-add" 
                onClick={() => setModalAdd(true)}>
                  Adicionar
                </button>

                <button className="btn-nav btn-mov" 
                onClick={() => setModalAberto(true)}>
                  Movimentação
                </button>
            </div>
        </div>

      </main>

{modalAberto && (    /*modal de adicionar movimentação*/
<div className="modal-overlay">

    <div className="modal">

      <h2>Movimentação</h2>

      <select className="input" onChange={(e) => setProdutoSelecionado(Number(e.target.value))}>
        <option>Selecione um produto</option>
        {produtos.map((p) => (
          <option key={p.id_produto} value={p.id_produto}>
            {p.nome}
          </option>
        ))}
      </select>

      <select className="input" onChange={(e) => setTipo(e.target.value)}>
        <option value="ENTRADA">Entrada</option>
        <option value="SAIDA">Saída</option>
      </select>

      <input className="input"
        type="number"
        placeholder="Quantidade"
        onChange={(e) => setQuantidade(Number(e.target.value))}
      />

      <div className="modal-acoes">
        <button onClick={() => setModalAberto(false)}>Cancelar</button>

        <button onClick={handleMovimentar}>
          Confirmar
        </button>
      </div>

    </div>

</div>
)}


{modalAdd && ( /*modal de adicionar produtos*/
  <div className="modal-overlay">

    <div className="modal">

      <h2>Novo Produto</h2>

      <input
        className="input"
        placeholder="Nome"
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        className="input"
        placeholder="Descrição"
        onChange={(e) => setDescricao(e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Quantidade mínima"
        onChange={(e) => setQuantidadeMinima(Number(e.target.value))}
      />

      <div className="modal-acoes">
        <button onClick={() => setModalAdd(false)}>
          Cancelar
        </button>

        <button onClick={handleAdicionarProduto}>
          Salvar
        </button>
      </div>

    </div>

  </div>
)}

{modalEditar && (   /*Modal de atualizar produto*/
  <div className="modal-overlay">

    <div className="modal">

      <h2>Editar Produto</h2>

      <input
        className="input"
        value={editNome}
        onChange={(e) => setEditNome(e.target.value)}
      />

      <input
        className="input"
        value={editDescricao}
        onChange={(e) => setEditDescricao(e.target.value)}
      />

      <input
        className="input"
        type="number"
        value={editQuantidadeMinima}
        onChange={(e) => setEditQuantidadeMinima(Number(e.target.value))}
      />

      <div className="modal-acoes">
        <button onClick={() => setModalEditar(false)}>
          Cancelar
        </button>

        <button onClick={handleAtualizarProduto}>
          Salvar
        </button>
      </div>

    </div>

  </div>
)}

      {/* FOOTER */}
      <footer className="produtos-footer">
        <p>SAC: 0800-544-221</p>
        <p>Telefone: (81) 92828-5493</p>
        <p>Email: suporte@odontomax.com</p>
        <p>CNPJ: 10.180.270/0741-10</p>
      </footer>

    </div>
  );
}