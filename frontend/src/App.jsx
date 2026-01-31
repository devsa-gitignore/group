import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Settings from './pages/Settings' // NEW IMPORT

import BuyerHome from './pages/BuyerHome'
import SellerHome from './pages/SellerHome'
import Track from './pages/Track'
import Chat from './pages/Chat'
import Learn from './pages/Learn'
import Contact from './pages/Contact'
import About from './pages/About'
import { AuthProvider } from './context/AuthContext'

// Layout Component to handle Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation()
  // Hide Navbar on Auth pages
  const hideNavbar = ['/login', '/signup'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} /> {/* NEW ROUTE */}
          
            <Route path="/buyer/home" element={<BuyerHome />} />
            <Route path="/seller/home" element={<SellerHome />} />
          
            <Route path="/track/:txnId" element={<Track />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App