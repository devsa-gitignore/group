import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Bell, Lock, Save, Globe } from 'lucide-react'

function Settings() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="min-h-screen bg-sage pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/account')} 
          className="mb-6 flex items-center gap-2 font-bold hover:underline"
        >
          <ArrowLeft size={20} /> Back to Account
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black">Account Settings</h1>
          <button className="px-6 py-3 bg-black text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
            <Save size={18} /> Save Changes
          </button>
        </div>

        <div className="space-y-6">
          
          {/* SECTION 1: PROFILE */}
          <div className="bg-white rounded-2xl border-2 border-black p-6 md:p-8 shadow-md">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-2 border-gray-100 pb-4">
              <User size={20} /> Profile Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase mb-2">Organization Name</label>
                <input type="text" defaultValue="Eco Recyclers Inc." className="w-full p-3 border-2 border-gray-200 rounded-lg font-bold focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-2">Contact Email</label>
                <input type="email" defaultValue="admin@ecorecycle.com" className="w-full p-3 border-2 border-gray-200 rounded-lg font-bold focus:border-black outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase mb-2">Address</label>
                <input type="text" defaultValue="12, Industrial Estate, Mumbai" className="w-full p-3 border-2 border-gray-200 rounded-lg font-bold focus:border-black outline-none" />
              </div>
            </div>
          </div>

          {/* SECTION 3: SECURITY */}
          <div className="bg-white rounded-2xl border-2 border-black p-6 md:p-8 shadow-md">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 border-b-2 border-gray-100 pb-4">
              <Lock size={20} /> Security
            </h2>
            <button className="w-full py-4 border-2 border-black rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
              Change Password
            </button>
            <button className="w-full py-4 mt-4 border-2 border-red-100 text-red-500 bg-red-50 rounded-xl font-bold hover:bg-red-100 flex items-center justify-center gap-2">
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Settings