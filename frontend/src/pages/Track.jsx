import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Check, Truck, Package, Star, ArrowLeft, ShieldCheck, Copy, CheckCircle } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

function Track() {
  const { txnId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // State
  const [txn, setTxn] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)

  // 1. FETCH TRANSACTION DATA
  useEffect(() => {
    const fetchTxn = async () => {
      try {
        const data = await apiRequest(`/transactions/${txnId}`)
        setTxn(data)
        
        // If already delivered and no rating, maybe show prompt (logic can be expanded)
        if (data.status === 'delivered') {
           // setShowRating(true) // Optional: Auto-open rating
        }
      } catch (err) {
        console.error("Failed to load tracking", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTxn()
  }, [txnId])

  // 2. HANDLE STATUS UPDATES
  const updateStatus = async (newStatus) => {
    try {
      // Call Backend
      const updatedTxn = await apiRequest(`/transactions/${txnId}/status`, 'PUT', { status: newStatus })
      setTxn(updatedTxn) // Update local state with new Hash History

      if (newStatus === 'delivered') {
        setTimeout(() => setShowRating(true), 500)
      }
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const submitRating = async () => {
    try {
        // Assuming we have a rating endpoint (or just mock it for demo)
        // await apiRequest('/ratings', 'POST', { txnId, rating, ... })
        alert("Rating submitted! Trust Score Updated.")
        navigate('/market')
    } catch (err) {
        navigate('/market')
    }
  }

  // --- MAPPING BACKEND STATUS TO UI STEPS ---
  // Backend: 'confirmed' -> 'picked_up' -> 'delivered'
  const getStepIndex = (status) => {
    if (status === 'confirmed') return 0;
    if (status === 'picked_up' || status === 'in_transit') return 1;
    if (status === 'delivered') return 2;
    return 0;
  }

  const currentStepIdx = txn ? getStepIndex(txn.status) : 0

  const steps = [
    { id: 'confirmed', label: 'Order Placed', icon: Package },
    { id: 'picked_up', label: 'Dispatched', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Check },
  ]

  if (loading) return <div className="min-h-screen bg-sage flex items-center justify-center font-bold">Loading Chain...</div>
  if (!txn) return <div className="min-h-screen bg-sage flex items-center justify-center font-bold">Transaction Not Found</div>

  return (
    <div className="min-h-screen bg-sage pt-24 px-4 pb-12">
      
      {/* --- RATING MODAL --- */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center relative">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black mb-2">Order Completed!</h3>
            <p className="text-gray-500 font-bold mb-6">Rate your experience.</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star size={32} className={star <= rating ? "text-orange-500 fill-orange-500" : "text-gray-300"} />
                </button>
              ))}
            </div>

            <button 
              onClick={submitRating}
              disabled={rating === 0}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              SUBMIT & FINISH
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 font-bold hover:underline">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-3xl border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 border-gray-100 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-black mb-1">Tracking Order</h1>
              <p className="font-bold text-gray-500 text-xs uppercase tracking-wider flex items-center gap-2">
                ID: {txn._id} <Copy size={12} className="cursor-pointer hover:text-black"/>
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200 inline-block">
                PAID: ₹{txn.total_amount}
              </p>
              <p className="text-xs font-bold text-gray-400 mt-1">
                Material: {txn.material_id?.type || 'Recyclables'}
              </p>
            </div>
          </div>

          {/* --- TIMELINE --- */}
          <div className="relative mb-12 px-4">
            {/* Line */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-100"></div>
            <div 
              className="absolute left-8 top-8 w-1 bg-black transition-all duration-500 ease-in-out" 
              style={{ height: `${(currentStepIdx / (steps.length - 1)) * 80}%` }}
            ></div>

            <div className="space-y-8 relative z-10">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx
                const isCurrent = idx === currentStepIdx
                
                // Find hash data for this step if available
                // Backend history uses status names: 'confirmed', 'picked_up', 'delivered'
                // We map step.id to history
                const historyItem = txn.history.find(h => h.status === step.id || (step.id === 'picked_up' && h.status === 'in_transit'))

                return (
                  <div key={step.id} className="flex items-start gap-4">
                    {/* Icon Bubble */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors z-10 ${
                      isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-300'
                    }`}>
                      <step.icon size={20} />
                    </div>

                    {/* Text Content */}
                    <div className="pt-1 w-full">
                      <div className="flex justify-between items-center">
                        <h4 className={`text-lg font-black ${isCompleted ? 'text-black' : 'text-gray-300'}`}>{step.label}</h4>
                        {historyItem && (
                           <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                             {new Date(historyItem.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                        )}
                      </div>
                      
                      {isCurrent && status !== 'delivered' && <p className="text-xs font-bold text-blue-600 animate-pulse mt-1">● In Progress</p>}

                      {/* PROVENANCE HASH DISPLAY (USP) */}
                      {historyItem && (
                        <div className="mt-2 bg-gray-50 p-2 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-500 break-all flex gap-2 items-start">
                           <ShieldCheck size={14} className="text-green-600 shrink-0 mt-0.5" />
                           <div>
                             <span className="font-bold text-gray-400 uppercase block text-[9px]">Verified Chain Hash:</span>
                             {historyItem.hash}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* --- ACTION BUTTONS (Role Based) --- */}
          <div className="border-t-2 border-black pt-8">
            {/* SELLER ACTION: Mark Picked Up */}
            {user?.role === 'seller' && txn.status === 'confirmed' && (
              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 text-center">
                <p className="font-bold text-yellow-800 mb-4">Are the goods packed and handed over?</p>
                <button onClick={() => updateStatus('picked_up')} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform">
                  MARK AS DISPATCHED
                </button>
              </div>
            )}

            {/* BUYER ACTION: Confirm Delivery */}
            {user?.role === 'buyer' && (txn.status === 'picked_up' || txn.status === 'in_transit') && (
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 text-center">
                <p className="font-bold text-blue-800 mb-4">Have you received the package?</p>
                <button onClick={() => updateStatus('delivered')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:scale-105 transition-transform">
                  CONFIRM DELIVERY
                </button>
              </div>
            )}

            {/* COMPLETED STATE */}
            {txn.status === 'delivered' && !showRating && (
              <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <CheckCircle size={48} className="mx-auto text-green-600 mb-2" />
                <h3 className="text-xl font-black text-green-800">Order Completed Successfully</h3>
                <p className="text-xs font-bold text-green-600 mt-2">Provenance Chain Verified & Closed.</p>
              </div>
            )}
            
            {/* Waiting Messages */}
            {user?.role === 'buyer' && txn.status === 'confirmed' && (
              <p className="text-center font-bold text-gray-400">Waiting for Seller to dispatch...</p>
            )}
             {user?.role === 'seller' && (txn.status === 'picked_up' || txn.status === 'in_transit') && (
              <p className="text-center font-bold text-gray-400">Waiting for Buyer to confirm delivery...</p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Track