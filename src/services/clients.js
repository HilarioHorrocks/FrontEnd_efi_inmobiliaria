import axiosInstance from "./api"

export const clientsService = {
  getAll: () => axiosInstance.get("/clients"),
  create: (data) => axiosInstance.post("/clients", data),
  update: (id, data) => axiosInstance.put(`/clients/${id}`, data),
  delete: (id) => axiosInstance.delete(`/clients/${id}`),
}
