import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { PropertiesProvider } from "./contexts/PropertiesContext"
import { ClientsProvider } from "./contexts/ClientsContext"
import { RentalsProvider } from "./contexts/RentalsContext"
import { SalesProvider } from "./contexts/SalesContext"
import { Navigation } from "./components/Navigation"
import { ProtectedRoute } from "./components/ProtectedRoute"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import PropertiesPage from "./pages/PropertiesPage"
import ClientsPage from "./pages/ClientsPage"
import AdminPage from "./pages/AdminPage"
import MyRentalsPage from "./pages/MyRentalsPage"
import MySalesPage from "./pages/MySalesPage"
import ProfilePage from "./pages/ProfilePage"

import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertiesProvider>
          <ClientsProvider>
            <RentalsProvider>
              <SalesProvider>
                <Navigation />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route
                    path="/clients"
                    element={
                      <ProtectedRoute requiredRole={["admin", "agente"]}>
                        <ClientsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-rentals"
                    element={
                      <ProtectedRoute requiredRole="cliente">
                        <MyRentalsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-sales"
                    element={
                      <ProtectedRoute requiredRole="cliente">
                        <MySalesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </SalesProvider>
            </RentalsProvider>
          </ClientsProvider>
        </PropertiesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
