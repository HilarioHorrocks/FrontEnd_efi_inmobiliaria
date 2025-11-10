"use client"

import { createContext, useState, useContext } from "react"
import { salesService } from "../services/sales"

const SalesContext = createContext()

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSalesByUser = async (userId) => {
    setLoading(true)
    try {
      const response = await salesService.getByUser(userId)
      setSales(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener ventas")
    } finally {
      setLoading(false)
    }
  }

  const createSale = async (data) => {
    try {
      const response = await salesService.create(data)
      setSales([...sales, response.data])
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateSale = async (id, data) => {
    try {
      const response = await salesService.update(id, data)
      setSales(sales.map((s) => (s.id === id ? response.data : s)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  const cancelSale = async (id) => {
    try {
      const response = await salesService.cancel(id)
      setSales(sales.map((s) => (s.id === id ? { ...s, estado: "cancelada" } : s)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  return (
    <SalesContext.Provider value={{ sales, loading, error, fetchSalesByUser, createSale, updateSale, cancelSale }}>
      {children}
    </SalesContext.Provider>
  )
}

export const useSales = () => useContext(SalesContext)
