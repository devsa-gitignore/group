const API_BASE = '/api'

export const fetchTracking = async (txnId) => {
  try {
    const response = await fetch(`${API_BASE}/tracking/${txnId}`)
    if (!response.ok) throw new Error('Failed to fetch tracking')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
