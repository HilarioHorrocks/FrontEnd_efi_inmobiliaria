import axiosInstance from "./api"

export const rentalsService = {
  create: (data) => axiosInstance.post("/rentals", data),
  getByUser: (userId) => axiosInstance.get(`/rentals/${userId}`),
  update: (id, data) => axiosInstance.put(`/rentals/${id}`, data),
  cancel: (id) => axiosInstance.delete(`/rentals/${id}`),
}
