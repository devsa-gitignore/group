import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, TrendingUp, ShieldCheck, MessageCircle, ShoppingBag, MessageSquare } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function BuyerHome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('market') // 'market' or 'chats'
  
  const [materials, setMaterials] = useState([])
  const [myInterests, setMyInterests] = useState([]) // Stores active chats
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  // 1. FETCH MARKET DATA (When 'market' tab is active)
  useEffect(() => {
    if (activeTab !== 'market') return;
    
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (searchTerm) params.append('material', searchTerm)
        if (locationFilter) params.append('location', locationFilter)

        const data = await apiRequest(`/market/browse?${params.toString()}`)
        setMaterials(data)
      } catch (err) {
        console.error("Failed to load marketplace", err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => fetchMaterials(), 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, locationFilter, activeTab])

  // 2. FETCH MY CHATS (When 'chats' tab is active)
  useEffect(() => {
    if (activeTab !== 'chats') return;

    const fetchMyChats = async () => {
      try {
        setLoading(true)
        // Fetches from /api/interests/my
        const data = await apiRequest('/interests/my')
        setMyInterests(data)
      } catch (err) {
        console.error("Failed to load chats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyChats()
  }, [activeTab])

  // 3. START NEW CHAT
  const handleInterest = async (materialId) => {
    try {
      const response = await apiRequest('/interests/create', 'POST', { materialId })
      if (response.interest) {
        navigate(`/chat/${response.interest._id}`)
      }
    } catch (err) {
      if (err.message.includes('already')) {
        // Optional: Auto-switch to chats tab if they already have one
        alert("You already have an open chat for this item. Check the 'My Chats' tab.")
        setActiveTab('chats')
      } else {
        alert("Error connecting to seller.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-sage pt-24 px-4 pb-20">
      
      {/* --- HEADER --- */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-black mb-2">Buyer Dashboard</h1>
        <p className="text-gray-500 font-bold">Manage sourcing and negotiations.</p>
        
        {/* TABS */}
        <div className="flex gap-4 mt-8 border-b-2 border-gray-200 pb-1">
          <button 
            onClick={() => setActiveTab('market')}
            className={`pb-3 px-2 font-black uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === 'market' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2"><ShoppingBag size={18} /> Market</span>
          </button>
          <button 
            onClick={() => setActiveTab('chats')}
            className={`pb-3 px-2 font-black uppercase tracking-wider transition-colors border-b-4 ${
              activeTab === 'chats' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
            }`}
          >
             <span className="flex items-center gap-2"><MessageSquare size={18} /> My Chats</span>
          </button>
        </div>
      </div>

      {/* --- MARKET TAB CONTENT --- */}
      {activeTab === 'market' && (
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-white border-2 border-black rounded-xl flex items-center px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Search className="text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search plastic, cotton, etc..." 
                className="flex-1 p-3 font-bold outline-none placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-black text-white p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 hover:shadow-none transition-all">
              <Filter size={20} />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="font-bold text-gray-400 col-span-full text-center py-10">Loading marketplace...</p>
            ) : materials.length === 0 ? (
              <p className="font-bold text-gray-400 col-span-full text-center py-10">No materials found.</p>
            ) : (
              materials.map((item) => (
                <div key={item._id} className="bg-white border-2 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform relative group">
                  
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gray-100 rounded-xl mb-4 border-2 border-black overflow-hidden relative flex items-center justify-center">
                    <span className="text-5xl font-black text-gray-300 uppercase tracking-tighter">
                      {(item.type || 'MT').substring(0, 2)}
                    </span>
                    {item.is_good_deal && (
                      <div className="absolute top-2 right-2 bg-green-400 border-2 border-black px-2 py-1 text-[10px] font-black uppercase rounded-full flex items-center gap-1 shadow-sm">
                        <TrendingUp size={12} /> Good Price
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black uppercase">{item.type}</h3>
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <MapPin size={12} /> {item.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black">₹{item.total_price}</p>
                        <p className="text-[10px] font-bold text-gray-500">{item.quantity} kg Lot</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {item.seller_id?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="text-xs font-bold flex items-center gap-1">
                          {item.seller_id?.name}
                          {item.seller_verified && <ShieldCheck size={12} className="text-blue-600 fill-blue-100" />}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Seller</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleInterest(item._id)}
                      className="w-full py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors border-2 border-transparent hover:border-black"
                    >
                      <MessageCircle size={18} /> I'm Interested
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- MY CHATS TAB CONTENT --- */}
      {activeTab === 'chats' && (
        <div className="max-w-4xl mx-auto">
          {loading ? (
             <p className="font-bold text-gray-400 text-center py-10">Loading your conversations...</p>
          ) : myInterests.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border-2 border-black border-dashed">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4"/>
                <p className="font-bold text-gray-400 mb-4">You haven't started any negotiations yet.</p>
                <button onClick={() => setActiveTab('market')} className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:scale-105 transition-transform">
                  Browse Market
                </button>
             </div>
          ) : (
            <div className="space-y-4">
              {myInterests.map((interest) => (
                <div 
                  key={interest._id} 
                  onClick={() => navigate(`/chat/${interest._id}`)}
                  className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all cursor-pointer flex justify-between items-center group"
                >
                  {/* Left: Material & Seller */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-black flex items-center justify-center font-black text-xl text-gray-300">
                      {(interest.material_id?.type || 'MT').substring(0,2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase group-hover:underline">
                        {interest.material_id?.type || 'Unknown Item'}
                      </h3>
                      <p className="text-xs font-bold text-gray-500">
                        Seller: {interest.material_id?.seller_id?.name || 'Unknown'}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        interest.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                        interest.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {interest.status}
                      </span>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <div className="text-right">
                    <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default BuyerHome