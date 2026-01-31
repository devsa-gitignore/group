import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, MapPin, Star, Settings, LogOut, 
  Leaf, TrendingUp, Award, Droplets, ArrowLeft, Zap, Calendar 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext' // <--- IMPORT CONTEXT

const Account = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth() // <--- GET REAL USER
  
  // Impact Stats (Derived from Transaction Count)
  const [impact, setImpact] = useState({ co2: 0, water: 0, energy: 0 })

  useEffect(() => {
    if (user) {
      // Logic: Estimate impact based on number of completed deals
      // Example: 1 Deal = 50kg CO2, 200L Water, 30kWh Energy
      const count = user.transaction_count || 0
      setImpact({
        co2: (count * 50).toFixed(1),
        water: (count * 200).toLocaleString(),
        energy: (count * 30).toFixed(1)
      })
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleBack = () => {
    if (user?.role === 'seller') navigate('/seller/home')
    else navigate('/buyer/home')
  }

  if (!user) return <div className="min-h-screen bg-sage pt-24 text-center font-bold">Loading Profile...</div>

  return (
    <div className="min-h-screen bg-sage pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER / NAV */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={handleBack} className="flex items-center gap-2 font-bold hover:underline">
            <ArrowLeft size={20} /> Dashboard
          </button>
          <div className="flex gap-2">
            <button onClick={() => navigate('/settings')} className="p-3 bg-white border-2 border-black rounded-xl hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-3 bg-red-100 border-2 border-black text-red-600 rounded-xl hover:bg-red-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* MAIN PROFILE CARD */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-black border-4 border-gray-100 shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black mb-1">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border border-black ${
                  user.role === 'seller' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
                {user.is_verified && (
                   <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black uppercase border border-blue-200">
                     Verified
                   </span>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-1 justify-center md:justify-start">
                  <MapPin size={16} /> {user.location?.address || 'Location not set'}
                </div>
                <div className="flex items-center gap-1 justify-center md:justify-start">
                  <Calendar size={16} /> Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Wallet & Trust */}
            <div className="flex gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <p className="text-xs font-black uppercase text-gray-400 mb-1">Wallet</p>
                <p className="text-2xl font-black text-green-600">₹{user.wallet_balance || 0}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                <p className="text-xs font-black uppercase text-gray-400 mb-1">Trust Score</p>
                <div className="flex items-center justify-center gap-1 text-2xl font-black text-yellow-500">
                  {user.trust_score} <Star size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPACT DASHBOARD */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Eco Score Card */}
          <div className="bg-forest text-white rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <Leaf className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-110 transition-transform duration-500" size={200} />
            
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
              <Award className="text-green-400" /> Your Eco Impact
            </h2>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <Leaf className="text-green-400 mb-2" size={24} />
                <p className="text-3xl font-black">{impact.co2}kg</p>
                <p className="text-xs font-bold text-gray-400 uppercase">CO2 Avoided</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                <Droplets className="text-blue-400 mb-2" size={24} />
                <p className="text-3xl font-black">{impact.water}L</p>
                <p className="text-xs font-bold text-gray-400 uppercase">Water Saved</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-500/50 relative z-10">
              <p className="text-sm font-bold leading-relaxed">
                <span className="text-green-300">Great job!</span> You've completed <span className="text-white">{user.transaction_count} transactions</span>. Your recycling efforts are actively reducing landfill waste.
              </p>
            </div>
          </div>

          {/* Stats / Details */}
          <div className="space-y-6">
             {/* Energy Card */}
             <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-gray-400">Energy Conserved</p>
                  <h3 className="text-3xl font-black">{impact.energy} kWh</h3>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-black">
                  <Zap size={24} className="text-yellow-600" fill="currentColor"/>
                </div>
             </div>

             {/* Recent Activity (Visual Only for now) */}
             <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1">
                <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                  <TrendingUp size={20}/> Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Member Status</span>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Verification</span>
                    {user.is_verified ? (
                      <span className="text-blue-600 flex items-center gap-1">Verified <Award size={14}/></span>
                    ) : (
                      <span className="text-orange-500">Pending</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-500">Total Deals</span>
                    <span>{user.transaction_count}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Account