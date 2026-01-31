import { Link, useNavigate } from 'react-router-dom'
import { Sprout, User, Menu, X, LogOut, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  
  // Get Real Auth State from Context
  const { user, logout } = useAuth()

  // Handle Logout
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Smart Logo Link: Market for logged in users, Landing for visitors
  const logoLink = user ? (user.role === 'seller' ? '/seller/home' : '/buyer/home') : '/'

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b-2 border-black z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* LOGO */}
        <Link to={logoLink} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sprout size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">ECOSETU</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/learn" className="font-bold text-sm uppercase tracking-wider hover:text-green-700 transition-colors">Learn</Link>
          <Link to="/about" className="font-bold text-sm uppercase tracking-wider hover:text-green-700 transition-colors">About</Link>
          
          <div className="h-6 w-0.5 bg-gray-200"></div>

          {/* Account / Login State */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* Role Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border border-black ${
                user.role === 'seller' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
              }`}>
                {user.role} Mode
              </span>

              {/* Wallet Display */}
              <div className="flex items-center gap-1 font-bold text-sm mr-2">
                <Wallet size={16} /> ₹{user.wallet_balance || 0}
              </div>

              {/* --- RESTORED: MY ACCOUNT BUTTON --- */}
              <Link 
                to="/account" 
                className="p-2 bg-gray-100 border border-black text-black rounded-full hover:bg-gray-200 hover:scale-110 transition-all"
                title="My Profile"
              >
                <User size={20} />
              </Link>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p-2 bg-black text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
             <Link to="/login" className="font-bold text-sm uppercase tracking-wider hover:text-green-700">
               Log In
             </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-black">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b-2 border-black p-4 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top-5">
          {user && (
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-2">
                <p className="font-black text-lg">Hi, {user.name}</p>
                <p className="text-xs font-bold text-gray-400 uppercase">{user.role}</p>
                <div className="mt-2 flex items-center gap-2 font-black text-green-600">
                  <Wallet size={16}/> ₹{user.wallet_balance || 0}
                </div>
                
                {/* Mobile Account Link */}
                <Link 
                  to="/account" 
                  onClick={() => setIsOpen(false)}
                  className="mt-4 block w-full py-2 bg-white border border-black text-center font-bold rounded-lg hover:bg-gray-100"
                >
                  View Profile
                </Link>
             </div>
          )}
          
          <Link to="/learn" className="font-bold text-lg" onClick={() => setIsOpen(false)}>Learn Recycling</Link>
          <Link to="/about" className="font-bold text-lg" onClick={() => setIsOpen(false)}>About Us</Link>
          
          {user ? (
            <button onClick={handleLogout} className="font-bold text-lg text-red-500 text-left flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link to="/login" className="font-bold text-lg" onClick={() => setIsOpen(false)}>Log In</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar