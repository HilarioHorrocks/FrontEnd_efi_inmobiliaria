import axiosInstance from "./api"

export const propertiesService = {
  getAll: (filters) => axiosInstance.get("/properties", { params: filters }),
  create: (data) => axiosInstance.post("/properties", data),
  update: (id, data) => axiosInstance.put(`/properties/${id}`, data),
  delete: (id) => axiosInstance.delete(`/properties/${id}`),
}
