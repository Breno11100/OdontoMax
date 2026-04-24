import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Produtos from "../pages/Produtos";
import Movimentacoes from "../pages/Movimentacoes";
import Usuarios from "../pages/Usuarios"

export default function AppRoutes() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/produtos"
    element={
      <ProtectedRoute>
        <Produtos />
      </ProtectedRoute>
    }
  />

  <Route
    path="/movimentacoes"
    element={
      <ProtectedRoute>
        <Movimentacoes />
      </ProtectedRoute>
    }
  />

  <Route
    path="/usuarios"
    element={
      <ProtectedRoute>
        <Usuarios />
      </ProtectedRoute>
    }
  />
</Routes>
    </BrowserRouter>
  );
}