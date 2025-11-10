import axiosInstance from "./api"

export const authService = {
  register: (userData) => axiosInstance.post("/auth/register", userData),
  login: (email, password) => axiosInstance.post("/auth/login", { correo: email, contraseña: password }),
  getProfile: () => axiosInstance.get("/users/profile"),
}
