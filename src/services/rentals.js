import axiosInstance from "./api"

export const rentalsService = {
  create: (data) => axiosInstance.post("/rentals", data),
  getByUser: (userId) => axiosInstance.get(`/rentals/${userId}`),
  update: (id, data) => axiosInstance.put(`/rentals/${id}`, data),
  cancel: (id) => axiosInstance.delete(`/rentals/${id}`),
  // Nuevo: Alquiler directo de propiedad
  rentProperty: (propertyId, durationMonths = 12) => axiosInstance.post("/rentals/rent", { 
    id_propiedad: propertyId,
    duracion_meses: durationMonths
  }),
}
