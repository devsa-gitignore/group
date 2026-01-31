import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Sprout, Building2, MapPin, Phone, Lock } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState('buyer')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    orgName: '',
    location: '',
    phone: '',
    otp: '' 
  })

  const getCoordinates = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve([0, 0]); 
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve([position.coords.longitude, position.coords.latitude]),
          () => resolve([0, 0])
        );
      }
    });
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const coordinates = await getCoordinates();

      const payload = {
        phone: formData.phone,
        otp: formData.otp, 
        organization_name: formData.orgName, 
        role: role,
        location: formData.location, 
        coordinates: coordinates 
      }

      // Call the register API
      const data = await apiRequest('/auth/register', 'POST', payload);

      // Update AuthContext with user data
      login(data);

      alert('Registration Successful!')

      // Navigate to correct page based on role
      if (data.role === 'seller') {
        navigate('/seller/home')
      } else {
        navigate('/buyer/home')
      }
      
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage p-4">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
            <Sprout size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Join EcoSetu</h1>
          <p className="font-bold text-sm text-black/60 uppercase tracking-widest mt-1">
            Create your account
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex border-2 border-black rounded-lg overflow-hidden mb-6">
          <button type="button" onClick={() => setRole('buyer')} className={`flex-1 py-3 font-black text-sm uppercase tracking-widest transition-colors ${role === 'buyer' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}>
            Buyer
          </button>
          <div className="w-0.5 bg-black"></div>
          <button type="button" onClick={() => setRole('seller')} className={`flex-1 py-3 font-black text-sm uppercase tracking-widest transition-colors ${role === 'seller' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'}`}>
            Seller
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Org Name */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input type="text" required className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" placeholder="e.g. Green Works Ltd." value={formData.orgName} onChange={(e) => setFormData({...formData, orgName: e.target.value})} />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">Location / City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input type="text" required className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" placeholder="e.g. Mumbai, India" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input type="tel" required className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" placeholder="98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          {/* OTP FIELD */}
          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">OTP Verification</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
              <input type="text" required className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" placeholder="Enter 1234" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 text-right uppercase tracking-wider">* Use '1234' for Demo</p>
          </div>

          <button disabled={loading} className={`w-full bg-black text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'} 
            {!loading && <ArrowRight size={20} strokeWidth={3} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-bold text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-black underline underline-offset-4 decoration-2">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup