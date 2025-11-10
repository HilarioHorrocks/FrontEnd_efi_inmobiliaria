"use client"

import { createContext, useState, useContext } from "react"
import { rentalsService } from "../services/rentals"

const RentalsContext = createContext()

export const RentalsProvider = ({ children }) => {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRentalsByUser = async (userId) => {
    setLoading(true)
    try {
      const response = await rentalsService.getByUser(userId)
      setRentals(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener alquileres")
    } finally {
      setLoading(false)
    }
  }

  const createRental = async (data) => {
    try {
      const response = await rentalsService.create(data)
      setRentals([...rentals, response.data])
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateRental = async (id, data) => {
    try {
      const response = await rentalsService.update(id, data)
      setRentals(rentals.map((r) => (r.id === id ? response.data : r)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  const cancelRental = async (id) => {
    try {
      const response = await rentalsService.cancel(id)
      setRentals(rentals.map((r) => (r.id === id ? { ...r, estado: "cancelado" } : r)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  return (
    <RentalsContext.Provider
      value={{ rentals, loading, error, fetchRentalsByUser, createRental, updateRental, cancelRental }}
    >
      {children}
    </RentalsContext.Provider>
  )
}

export const useRentals = () => useContext(RentalsContext)
