import { useState } from "react";
import api from "../services/api";
import '../pagesCSS/login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const token = response.data.token;
      const usuario = response.data.usuario;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert("Login realizado com sucesso!");
      window.location.href = "/dashboard";

    } catch (error) {
      alert("Erro no login");
      console.log(error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>OdontoMax</h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}