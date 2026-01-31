import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Home() {
  return (
    <div className="min-h-screen bg-[#A3D9A5] relative overflow-hidden flex flex-col items-center pt-16">
      
      {/* Background Organic Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <svg className="w-full h-full" viewBox="0 0 375 812" preserveAspectRatio="none">
            <path d="M0 200 Q 100 150 200 250 T 400 300 V 812 H 0 Z" fill="#74B96E" />
            <path d="M0 400 Q 150 350 300 450 V 812 H 0 Z" fill="#1B3C24" opacity="0.1" />
         </svg>
      </div>

      <div className="w-full max-w-md px-8 relative z-10 text-center flex flex-col h-full">
        
        {/* Typography */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold text-[#1B3C24] leading-[1.1] mb-2"
        >
          Platform of <br/> waste <br/> management.
        </motion.h1>

        {/* THE ILLUSTRATION */}
        <div className="relative h-[400px] w-full flex items-center justify-center mt-4">
          <div className="relative w-64 h-64">
             
             {/* 1. Yellow Can (Floating) */}
             <motion.div 
               animate={{ y: [-10, 0, -10], rotate: [10, 20, 10] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-10 left-10 z-20 w-12"
             >
               <svg viewBox="0 0 40 60" className="drop-shadow-lg">
                 <path d="M5 10 V 50 C 5 55 35 55 35 50 V 10" fill="#FFD166" stroke="#1B3C24" strokeWidth="2" />
                 <ellipse cx="20" cy="10" rx="15" ry="5" fill="#FFE08A" stroke="#1B3C24" strokeWidth="2" />
                 <path d="M10 20 H 30" stroke="#1B3C24" strokeWidth="1" opacity="0.5" />
               </svg>
             </motion.div>

             {/* 2. Crumpled Paper (Floating) */}
             <motion.div 
               animate={{ y: [0, 15, 0], rotate: [-10, -30, -10] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute top-0 right-0 z-20 w-16"
             >
               <svg viewBox="0 0 50 40" className="drop-shadow-lg">
                 <path d="M5 10 L 15 5 L 45 15 L 40 35 L 10 30 Z" fill="#F0F0F0" stroke="#1B3C24" strokeWidth="2" />
                 <path d="M15 5 L 20 20 L 45 15" stroke="#1B3C24" strokeWidth="1" fill="none" />
               </svg>
             </motion.div>

             {/* 3. The Green Bin (Main) */}
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="absolute top-10 left-0 w-full"
             >
               <svg viewBox="0 0 200 220">
                 {/* Bin Body */}
                 <path d="M20 50 L 45 200 C 45 210 155 210 155 200 L 180 50" fill="#74B96E" stroke="#1B3C24" strokeWidth="3" />
                 {/* Shadow inside bin */}
                 <path d="M20 50 L 45 200 C 45 210 155 210 155 200 L 180 50 L 20 50" fill="black" opacity="0.1" />
                 
                 {/* Bin Rim */}
                 <rect x="5" y="30" width="190" height="25" rx="10" fill="#88C48B" stroke="#1B3C24" strokeWidth="3" />
                 
                 {/* Recycle Icon (White Arrows) */}
                 <g transform="translate(65, 100) scale(0.4)">
                    <path d="M100 20 L 140 80 H 60 Z" fill="none" stroke="white" strokeWidth="15" strokeLinejoin="round" />
                    <path d="M60 80 L 20 140 H 100" fill="none" stroke="white" strokeWidth="15" strokeLinejoin="round" />
                    <path d="M140 80 L 180 140 H 100" fill="none" stroke="white" strokeWidth="15" strokeLinejoin="round" />
                    {/* Simplified arrows for visual */}
                    <path d="M50 50 L 150 50 L 100 130 Z" stroke="white" strokeWidth="8" fill="none" />
                 </g>
               </svg>
             </motion.div>

             {/* 4. Plants/Leaves Decoration */}
             <svg className="absolute bottom-0 -left-10 w-24 h-24 text-[#1B3C24] opacity-20" viewBox="0 0 100 100">
               <path d="M50 100 Q 10 50 20 20 Q 50 10 50 100 Z" fill="currentColor" />
               <path d="M50 100 Q 90 50 80 20 Q 50 10 50 100 Z" fill="currentColor" />
             </svg>
          </div>
        </div>

        <div className="mt-auto mb-10 w-full space-y-4">
          <Link to="/login" className="btn-black block">
            Get Started
          </Link>
          <p className="text-[#1B3C24] text-sm font-medium opacity-60">Already have an account? Log in</p>
        </div>

      </div>
    </div>
  )
}

export default Home