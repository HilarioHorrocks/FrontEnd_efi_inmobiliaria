"use client"

import { createContext, useState, useContext } from "react"
import { propertiesService } from "../services/properties"

const PropertiesContext = createContext()

export const PropertiesProvider = ({ children }) => {
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProperties = async (newFilters = {}) => {
    setLoading(true)
    try {
      const response = await propertiesService.getAll(newFilters)
      setProperties(response.data)
      setFilters(newFilters)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || "Error al obtener propiedades")
    } finally {
      setLoading(false)
    }
  }

  const createProperty = async (data) => {
    try {
      const response = await propertiesService.create(data)
      setProperties([...properties, response.data])
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateProperty = async (id, data) => {
    try {
      const response = await propertiesService.update(id, data)
      setProperties(properties.map((p) => (p.id === id ? response.data : p)))
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteProperty = async (id) => {
    try {
      await propertiesService.delete(id)
      setProperties(properties.filter((p) => p.id !== id))
    } catch (err) {
      throw err
    }
  }

  return (
    <PropertiesContext.Provider
      value={{ properties, filters, loading, error, fetchProperties, createProperty, updateProperty, deleteProperty }}
    >
      {children}
    </PropertiesContext.Provider>
  )
}

export const useProperties = () => useContext(PropertiesContext)
