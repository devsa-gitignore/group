const API_BASE = '/api'

export const fetchMaterials = async () => {
  try {
    const response = await fetch(`${API_BASE}/materials/browse`)
    if (!response.ok) throw new Error('Failed to fetch materials')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const createMaterial = async (materialData) => {
  try {
    const response = await fetch(`${API_BASE}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData)
    })
    if (!response.ok) throw new Error('Failed to create material')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
