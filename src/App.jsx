import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { PropertiesProvider } from "./contexts/PropertiesContext"
import { ClientsProvider } from "./contexts/ClientsContext"
import { RentalsProvider } from "./contexts/RentalsContext"
import { SalesProvider } from "./contexts/SalesContext"
import { Navigation } from "./components/Navigation"
import { ProtectedRoute } from "./components/ProtectedRoute"

import { HomePage } from "./modules/home"
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "./modules/auth"
import { PropertiesPage } from "./modules/properties"
import { ClientsPage } from "./modules/clients"
import { AdminPage } from "./modules/admin"
import { MyRentalsPage } from "./modules/rentals"
import { MySalesPage } from "./modules/sales"
import { ProfilePage } from "./modules/profile"

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
