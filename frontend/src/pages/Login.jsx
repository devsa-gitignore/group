import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Lock, Phone, Sprout, ArrowRight } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists
      const res = await apiRequest("/auth/check-user", "POST", { phone });
      
      if (res.exists) {
        // User exists, move to OTP step
        alert("OTP sent! Use 1234 for demo");
        setStep(2);
      } else {
        // User doesn't exist, redirect to signup
        alert("Account not found. Please sign up first.");
        navigate("/signup");
      }
    } catch (err) {
      alert(err.message || "Failed to check user");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("/auth/login", "POST", {
        phone,
        otp
      });

      // Update AuthContext with user data
      login(res);

      alert("Login successful!");

      // Navigate based on role
      if (res.role === "seller") {
        navigate("/seller/home");
      } else {
        navigate("/buyer/home");
      }

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage p-4">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
            <Sprout size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
          <p className="font-bold text-sm text-black/60 uppercase tracking-widest mt-1">
            Log in to EcoSetu
          </p>
        </div>

        {/* Step 1: Enter Phone Number */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                <input 
                  type="tel" 
                  required 
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" 
                  placeholder="98765 43210" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit"
              className={`w-full bg-black text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'CHECKING...' : 'SEND OTP'}
              {!loading && <ArrowRight size={20} strokeWidth={3} />}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Display (Read-only) */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50" size={20} />
                <input 
                  type="tel" 
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-black/20 rounded-lg text-lg font-bold text-black/50 cursor-not-allowed" 
                  value={phone} 
                />
              </div>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-black underline underline-offset-2 ml-1"
              >
                Change number
              </button>
            </div>

            {/* OTP Input */}
            <div className="space-y-1">
              <label className="block text-xs font-black uppercase tracking-widest text-black ml-1">
                OTP Verification
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
                <input 
                  type="text" 
                  required 
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-lg text-lg font-bold text-black focus:outline-none focus:ring-4 focus:ring-black/10 placeholder-gray-300" 
                  placeholder="Enter 1234" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 text-right uppercase tracking-wider">
                * Use '1234' for Demo
              </p>
            </div>

            <button 
              disabled={loading} 
              type="submit"
              className={`w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg mt-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'LOGGING IN...' : 'VERIFY & LOGIN'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="font-bold text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-black underline underline-offset-4 decoration-2">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}