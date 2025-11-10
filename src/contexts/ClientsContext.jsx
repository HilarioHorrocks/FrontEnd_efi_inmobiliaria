"use client"

import { createContext, useState, useContext } from "react"
import { clientsService } from "../services/clients"

const ClientsContext = createContext()

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await clientsService.getAll()
      setClients(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener clientes")
    } finally {
      setLoading(false)
    }
  }

  const createClient = async (data) => {
    try {
      const response = await clientsService.create(data)
      setClients([...clients, response.data])
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateClient = async (id, data) => {
    try {
      const response = await clientsService.update(id, data)
      setClients(clients.map((c) => (c.id === id ? response.data : c)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteClient = async (id) => {
    try {
      await clientsService.delete(id)
      setClients(clients.filter((c) => c.id !== id))
    } catch (err) {
      throw err
    }
  }

  return (
    <ClientsContext.Provider
      value={{ clients, loading, error, fetchClients, createClient, updateClient, deleteClient }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export const useClients = () => useContext(ClientsContext)
