const API_BASE = '/api'

export const fetchChatMessages = async (interestId) => {
  try {
    const response = await fetch(`${API_BASE}/chat/${interestId}`)
    if (!response.ok) throw new Error('Failed to fetch messages')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const sendMessage = async (interestId, text) => {
  try {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        interestId,
        text,
        timestamp: new Date().toISOString()
      })
    })
    if (!response.ok) throw new Error('Failed to send message')
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
