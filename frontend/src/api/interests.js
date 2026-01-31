const API_BASE = '/api'

export const createInterest = async (materialId) => {
  try {
    const response = await fetch(`${API_BASE}/interests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ materialId })
    })
    if (!response.ok) throw new Error('Failed to create interest')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const fetchInterests = async () => {
  try {
    const response = await fetch(`${API_BASE}/interests`)
    if (!response.ok) throw new Error('Failed to fetch interests')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
