import { useNavigate } from 'react-router-dom'
import { Star, ShieldCheck, MessageCircle, Truck } from 'lucide-react'

function MaterialCard({ data }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      
      {/* Image Placeholder */}
      <div className="h-40 bg-gray-100 flex items-center justify-center border-b-2 border-black relative">
        <span className="text-6xl">{data.type === 'Plastic' ? '🥤' : data.type === 'Metal' ? '⚙️' : '📦'}</span>
        
        {/* Verification Badge */}
        {data.verified && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-black px-2 py-1 rounded-md border border-green-800 flex items-center gap-1">
            <ShieldCheck size={12} /> VERIFIED
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black">{data.type}</h3>
          <span className="text-lg font-bold text-green-700">₹{data.price}<span className="text-xs text-black">/kg</span></span>
        </div>

        <p className="text-sm font-bold text-gray-500 mb-4">{data.quantity} kg Available</p>

        {/* Seller Info */}
        <div className="flex items-center justify-between border-t-2 border-gray-100 pt-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wide">{data.seller}</span>
          <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
            <Star size={14} fill="currentColor" /> {data.rating}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => navigate(`/chat/${data.id}`)}
            className="py-2 rounded-lg border-2 border-black font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
          >
            <MessageCircle size={16} /> Chat
          </button>
          <button 
            onClick={() => navigate(`/track/txn_${data.id}`)}
            className="py-2 rounded-lg bg-black text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-1"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaterialCard