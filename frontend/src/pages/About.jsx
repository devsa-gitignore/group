import { motion } from 'framer-motion'
import { Leaf, Heart, Users } from 'lucide-react'

function About() {
  return (
    <div className="min-h-screen bg-sage-50 pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-black text-forest-900 mb-6">Our Mission</h1>
        <p className="text-xl text-gray-500 font-medium mb-12">Building the future of waste management.</p>
        <div className="space-y-6">
          {[{ icon: Leaf, title: "Eco-First", desc: "Every transaction saves CO2." }, { icon: Users, title: "Community", desc: "Connecting buyers & sellers." }, { icon: Heart, title: "Impact", desc: "Real tracking, real change." }].map((item, i) => (
            <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-[2.5rem] shadow-lg flex items-center gap-6 border border-white">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center text-forest-900"><item.icon size={32} /></div>
              <div className="text-left"><h3 className="text-xl font-bold text-forest-900">{item.title}</h3><p className="text-gray-400 font-bold text-sm">{item.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About