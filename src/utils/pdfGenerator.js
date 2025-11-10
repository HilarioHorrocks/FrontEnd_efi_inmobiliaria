import jsPDF from "jspdf"

export const generateRentalContract = (rental, property, client, user) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 10

  // Encabezado
  doc.setFontSize(16)
  doc.text("CONTRATO DE ALQUILER", pageWidth / 2, yPosition, { align: "center" })

  yPosition += 10
  doc.setFontSize(10)

  // Información del contrato
  doc.text(`Fecha de Contrato: ${new Date().toLocaleDateString()}`, 10, yPosition)
  yPosition += 7

  // Información del Arrendador
  doc.setFontSize(11)
  doc.text("ARRENDADOR:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Nombre: ${user?.nombre || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Correo: ${user?.correo || "N/A"}`, 15, yPosition)
  yPosition += 10

  // Información del Inquilino
  doc.setFontSize(11)
  doc.text("INQUILINO:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Nombre: ${client?.usuario?.nombre || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Documento: ${client?.documento_identidad || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Teléfono: ${client?.telefono || "N/A"}`, 15, yPosition)
  yPosition += 10

  // Información de la Propiedad
  doc.setFontSize(11)
  doc.text("PROPIEDAD:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Dirección: ${property?.direccion || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Tipo: ${property?.tipo || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Tamaño: ${property?.tamano || "N/A"} m²`, 15, yPosition)
  yPosition += 10

  // Términos del Alquiler
  doc.setFontSize(11)
  doc.text("TÉRMINOS DEL ALQUILER:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Fecha Inicio: ${new Date(rental.fecha_inicio).toLocaleDateString()}`, 15, yPosition)
  yPosition += 5
  doc.text(`Fecha Fin: ${new Date(rental.fecha_fin).toLocaleDateString()}`, 15, yPosition)
  yPosition += 5
  doc.text(`Monto Mensual: $${rental.monto_mensual.toLocaleString()}`, 15, yPosition)
  yPosition += 5
  doc.text(`Estado: ${rental.estado}`, 15, yPosition)

  // Pie de página
  yPosition = pageHeight - 20
  doc.setFontSize(9)
  doc.text("Este documento es generado automáticamente por el sistema inmobiliario.", 10, yPosition)
  doc.text(`Página 1 de 1`, pageWidth - 20, pageHeight - 10)

  return doc
}

export const generateSaleReceipt = (sale, property, client, user) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 10

  // Encabezado
  doc.setFontSize(16)
  doc.text("RECIBO DE VENTA", pageWidth / 2, yPosition, { align: "center" })

  yPosition += 10
  doc.setFontSize(10)

  // Información del recibo
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, yPosition)
  yPosition += 7
  doc.text(`Comprobante Nº: ${sale.id}`, 10, yPosition)
  yPosition += 10

  // Información del Vendedor
  doc.setFontSize(11)
  doc.text("VENDEDOR:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Nombre: ${user?.nombre || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Correo: ${user?.correo || "N/A"}`, 15, yPosition)
  yPosition += 10

  // Información del Comprador
  doc.setFontSize(11)
  doc.text("COMPRADOR:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Nombre: ${client?.usuario?.nombre || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Documento: ${client?.documento_identidad || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Teléfono: ${client?.telefono || "N/A"}`, 15, yPosition)
  yPosition += 10

  // Información de la Propiedad
  doc.setFontSize(11)
  doc.text("PROPIEDAD VENDIDA:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Dirección: ${property?.direccion || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Tipo: ${property?.tipo || "N/A"}`, 15, yPosition)
  yPosition += 5
  doc.text(`Tamaño: ${property?.tamano || "N/A"} m²`, 15, yPosition)
  yPosition += 10

  // Detalles de la Venta
  doc.setFontSize(11)
  doc.text("DETALLES DE LA VENTA:", 10, yPosition)
  yPosition += 6
  doc.setFontSize(10)
  doc.text(`Fecha de Venta: ${new Date(sale.fecha_venta).toLocaleDateString()}`, 15, yPosition)
  yPosition += 5
  doc.text(`Monto Total: $${sale.monto_total.toLocaleString()}`, 15, yPosition)
  yPosition += 5
  doc.text(`Estado: ${sale.estado}`, 15, yPosition)

  // Pie de página
  yPosition = pageHeight - 20
  doc.setFontSize(9)
  doc.text("Este documento es generado automáticamente por el sistema inmobiliario.", 10, yPosition)
  doc.text(`Página 1 de 1`, pageWidth - 20, pageHeight - 10)

  return doc
}

export const downloadPDF = (doc, filename) => {
  doc.save(filename)
}
