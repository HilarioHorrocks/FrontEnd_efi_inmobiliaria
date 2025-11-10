import axiosInstance from "./api"

export const salesService = {
  create: (data) => axiosInstance.post("/sales", data),
  getByUser: (userId) => axiosInstance.get(`/sales/${userId}`),
  update: (id, data) => axiosInstance.put(`/sales/${id}`, data),
  cancel: (id) => axiosInstance.delete(`/sales/${id}`),
}
