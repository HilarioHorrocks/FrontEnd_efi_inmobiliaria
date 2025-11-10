// Mapeo de imágenes por tipo de propiedad y ubicación
export const getPropertyImages = (property) => {
  const imagesByType = {
    departamento: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop', // Departamento moderno
      'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop', // Departamento con balcón
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop', // Monoambiente
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop', // Departamento luminoso
    ],
    casa: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop', // Casa moderna
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=500&fit=crop', // Casa con jardín
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop', // Casa familiar
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop', // Casa quinta
    ],
    loft: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop', // Loft industrial
      'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&h=500&fit=crop', // Loft moderno
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop', // Loft con vista
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&h=500&fit=crop', // Loft premium
    ]
  };

  // Obtener un índice basado en el ID de la propiedad para consistencia
  const images = imagesByType[property.tipo] || imagesByType.departamento;
  const imageIndex = (property.id || 0) % images.length;
  
  return {
    main: images[imageIndex],
    gallery: images
  };
};

// Función para obtener imágenes específicas por ubicación
export const getLocationSpecificImages = (property) => {
  const locationImages = {
    'Palermo': [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop',
    ],
    'Puerto Madero': [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop',
    ],
    'Belgrano': [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
    ],
    'San Isidro': [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop',
    ],
    'Tigre': [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop',
    ]
  };

  // Buscar por ubicación en la dirección
  for (const [location, images] of Object.entries(locationImages)) {
    if (property.direccion && property.direccion.includes(location)) {
      return images;
    }
  }

  // Fallback: usar imágenes por tipo
  return getPropertyImages(property).gallery;
};
