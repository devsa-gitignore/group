import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, Package, Truck, MessageSquare, User, 
  CheckCircle, RefreshCw, Trash2, Edit, ExternalLink, DollarSign
} from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function SellerHome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('upload')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- SIMPLE FORM STATE (No Images) ---
  const [formData, setFormData] = useState({
    type: 'Plastic',
    quantity: '',
    total_price: '',
    description: '',
    location: user?.location?.address || '' // Auto-fill if available
  })

  // --- SUBMIT LISTING ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Send data to backend (images is empty)
      await apiRequest('/market/list', 'POST', {
        ...formData,
        images: [] 
      })
      alert("Listing Published Successfully!")
      
      // Reset Form
      setFormData({
        type: 'Plastic',
        quantity: '',
        total_price: '',
        description: '',
        location: ''
      })
      setActiveTab('listings') // Switch to "My Listings" view
    } catch (err) {
      alert(err.message || "Failed to create listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-sage pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black">Seller Dashboard</h1>
            <p className="text-gray-500 font-bold">Manage your inventory and deals.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <p className="text-xs font-black uppercase text-gray-400">Total Sales</p>
             <p className="text-2xl font-black flex items-center gap-1">
               <DollarSign size={20} className="text-green-600"/> ₹{user?.wallet_balance || 0}
             </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['upload', 'listings', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider border-2 border-black transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' 
                : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              {tab === 'upload' ? '+ List Item' : tab === 'listings' ? 'My Listings' : 'Orders'}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT: UPLOAD --- */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-3xl border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl">
            <h2 className="text-2xl font-black mb-6">List New Material</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Material Type</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-2 border-black rounded-xl font-bold outline-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Paper">Paper</option>
                  <option value="Metal">Metal</option>
                  <option value="E-Waste">E-Waste</option>
                  <option value="Glass">Glass</option>
                  <option value="Textile">Textile</option>
                </select>
              </div>

              {/* Qty & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Quantity (kg)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 100"
                    className="w-full p-4 border-2 border-black rounded-xl font-bold outline-none"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Total Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 2500"
                    className="w-full p-4 border-2 border-black rounded-xl font-bold outline-none"
                    value={formData.total_price}
                    onChange={e => setFormData({...formData, total_price: e.target.value})}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Pickup Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Andheri East, Mumbai"
                  className="w-full p-4 border-2 border-black rounded-xl font-bold outline-none"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Description (Optional)</label>
                <textarea 
                  rows="3"
                  placeholder="Any specific details? e.g. 'Washed and baled'"
                  className="w-full p-4 border-2 border-black rounded-xl font-bold outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-black text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'PUBLISHING...' : 'PUBLISH LISTING'}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB CONTENT: LISTINGS --- */}
        {activeTab === 'listings' && (
           <div className="text-center py-20 bg-white rounded-3xl border-2 border-black border-dashed">
              <Package size={48} className="mx-auto text-gray-300 mb-4"/>
              <p className="font-bold text-gray-400">Your active listings will appear here.</p>
           </div>
        )}

         {/* --- TAB CONTENT: ORDERS --- */}
         {activeTab === 'orders' && (
           <div className="text-center py-20 bg-white rounded-3xl border-2 border-black border-dashed">
              <Truck size={48} className="mx-auto text-gray-300 mb-4"/>
              <p className="font-bold text-gray-400">No active orders yet.</p>
           </div>
        )}

      </div>
    </div>
  )
}

export default SellerHome