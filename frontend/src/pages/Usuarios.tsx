import "../pagesCSS/usuarios.css";
import logo from "../assets/OdontoMax_Logo1.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  perfil: string;
};

export default function Usuarios() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nomeUsuario = usuario.nome || "Usuário";
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("FUNCIONARIO");
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPerfil, setEditPerfil] = useState("FUNCIONARIO");

  useEffect(() => {
  async function buscarUsuarios() {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  buscarUsuarios();
  }, []);

  //modal adicionar usuario
  async function handleAdicionarUsuario() {
  try {
    await api.post("/usuarios", {
      nome,
      email,
      senha,
      perfil
    });

    alert("Usuário criado!");

    setModalAdd(false);

    window.location.reload();

  } catch (error) {
    console.log(error);
    alert("Erro ao criar usuário");
  }
  }

  //Deletar usuario
  async function handleExcluirUsuario(id: number) {
  try {
    await api.delete(`/usuarios/${id}`);

    setUsuarios((prev) =>
      prev.filter((usuario) => usuario.id_usuario !== id)
    );

    alert("Usuário excluído!");
  } catch (error) {
    console.log(error);
    alert("Erro ao excluir usuário");
  }
  }

  //modal atualizar usuario
  function abrirEdicao(usuario: Usuario) {
  setUsuarioEditando(usuario);

  setEditNome(usuario.nome);
  setEditEmail(usuario.email);
  setEditPerfil(usuario.perfil);

  setModalEditar(true);
  }

  //atualizar usuario
  async function handleAtualizarUsuario() {
  try {
    await api.put(`/usuarios/${usuarioEditando?.id_usuario}`, {
      nome: editNome,
      email: editEmail,
      perfil: editPerfil
    });

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id_usuario === usuarioEditando?.id_usuario
          ? {
              ...u,
              nome: editNome,
              email: editEmail,
              perfil: editPerfil
            }
          : u
      )
    );

    setModalEditar(false);

    alert("Usuário atualizado!");
  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar usuário");
  }
  }

  return (
    <div className="usuarios-container">

      {/* HEADER */}
      <header className="usuarios-header">
        <img src={logo} className="logo" />
        <h3>Bem-vindo(a), {nomeUsuario}</h3>
      </header>

      {/* MAIN */}
      <main className="usuarios-main">

        <h2>Lista de Usuários</h2>

        <div className="lista-usuarios">

          {usuarios.map((usuario) => (
            <div className="usuario-card" key={usuario.id_usuario}>

              <div className="usuario-info">
                <p><strong>Nome:</strong> {usuario.nome}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Perfil:</strong> {usuario.perfil}</p>
              </div>

              <div className="acoes-usuario">
                <button className="btn-atualizar"
                onClick={() => abrirEdicao(usuario)}>
                    Atualizar
                </button>

                <button className="btn-excluir"
                onClick={() => handleExcluirUsuario(usuario.id_usuario)}>
                    Excluir
                </button>
              </div>

            </div>
          ))}

        </div>

        {/* AÇÕES */}
        <div className="usuarios-acoes">

            <button 
                className="btn-nav" 
                onClick={() => navigate("/dashboard")}
            >
                Dashboard
            </button>

          <div className="acoes-direita">
            <button className="btn-nav btn-add"
            onClick={() => setModalAdd(true)}>+ Adicionar
            </button>
          </div>

        </div>

      </main>

{modalAdd && (     /*excluir usuario*/
  <div className="modal-overlay">

    <div className="modal">

      <h2>Novo Usuário</h2>

      <input
        className="input"
        placeholder="Nome"
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Senha"
        onChange={(e) => setSenha(e.target.value)}
      />

      <select
        className="input"
        onChange={(e) => setPerfil(e.target.value)}
      >
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Admin</option>
      </select>

      <div className="modal-acoes">
        <button onClick={() => setModalAdd(false)}>
          Cancelar
        </button>

        <button onClick={handleAdicionarUsuario}>
          Salvar
        </button>
      </div>

    </div>

  </div>
)}

{modalEditar && (     /*Atualizar usuario*/
  <div className="modal-overlay">

    <div className="modal">

      <h2>Editar Usuário</h2>

      <input
        className="input"
        value={editNome}
        onChange={(e) => setEditNome(e.target.value)}
      />

      <input
        className="input"
        value={editEmail}
        onChange={(e) => setEditEmail(e.target.value)}
      />

      <select
        className="input"
        value={editPerfil}
        onChange={(e) => setEditPerfil(e.target.value)}
      >
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Admin</option>
      </select>

      <div className="modal-acoes">
        <button onClick={() => setModalEditar(false)}>
          Cancelar
        </button>

        <button onClick={handleAtualizarUsuario}>
          Salvar
        </button>
      </div>

    </div>

  </div>
)}

      {/* FOOTER */}
      <footer className="usuarios-footer">
        <p>SAC: 0800-544-221</p>
        <p>Telefone: (81) 92828-5493</p>
        <p>Email: suporte@odontomax.com</p>
        <p>CNPJ: 10.180.270/0741-10</p>
      </footer>

    </div>
  );
}