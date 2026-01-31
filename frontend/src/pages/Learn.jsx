import { useState } from 'react'
import { Recycle, Truck, Factory, Sprout, ArrowRight, CheckCircle, AlertTriangle, Leaf, Globe, Droplets } from 'lucide-react'

const WasteCard = ({ title, desc, img, emoji, colorClass, tips }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-md hover:translate-y-[-4px] transition-transform group flex flex-col h-full">
      <div className={`h-40 w-full mb-6 overflow-hidden rounded-xl border-2 border-black relative flex items-center justify-center ${colorClass}`}>
        {!imgError ? (
          <img 
            src={img} 
            alt={title} 
            onError={() => setImgError(true)} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl animate-in fade-in zoom-in">{emoji}</span>
        )}
      </div>

      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <p className="text-sm font-bold text-gray-500 mb-4 flex-grow">{desc}</p>
      
      <ul className="space-y-2 mt-auto">
        {tips.map((tip, i) => (
          <li key={i} className={`flex items-start gap-2 text-xs font-bold ${tip.type === 'good' ? 'text-green-700' : 'text-red-500'}`}>
            {tip.type === 'good' ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
            {tip.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Learn() {
  const scrollToStart = () => {
    const element = document.getElementById('start-learning');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    {
      title: 'Plastic',
      emoji: '🥤',
      img: 'https://images.unsplash.com/photo-1595278069441-2cf29f52d921?auto=format&fit=crop&w=600&q=80',
      desc: 'PET bottles, HDPE containers, and packaging.',
      colorClass: 'bg-green-50',
      tips: [
        { text: 'Wash & dry before selling', type: 'good' },
        { text: 'No single-use thin bags', type: 'bad' }
      ]
    },
    {
      title: 'Metal',
      emoji: '🔩',
      img: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
      desc: 'Aluminum cans, copper wiring, steel scraps.',
      colorClass: 'bg-emerald-50',
      tips: [
        { text: 'Separate by magnetic type', type: 'good' },
        { text: 'High value per kg', type: 'good' }
      ]
    },
    {
      title: 'E-Waste',
      emoji: '🔌',
      img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
      desc: 'Old phones, cables, circuit boards, batteries.',
      colorClass: 'bg-teal-50',
      tips: [
        { text: 'Keep batteries separate', type: 'good' },
        { text: 'Do not break screens', type: 'bad' }
      ]
    },
    {
      title: 'Paper',
      emoji: '📦',
      img: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80',
      desc: 'Cardboard boxes, newspapers, office paper.',
      colorClass: 'bg-lime-50',
      tips: [
        { text: 'Flatten boxes to save space', type: 'good' },
        { text: 'Must be dry & oil-free', type: 'bad' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-sage pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO */}
        <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-800 text-green-800 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-6">
              <Sprout size={14} /> Knowledge Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Turn Waste Into <br/>
              <span className="text-green-600">Wealth & Worth.</span>
            </h1>
            <p className="text-xl font-bold text-gray-500 mb-8 max-w-lg">
              Understanding the circular economy is the first step. Learn how to sort, sell, and save the planet.
            </p>
            
            <button 
              onClick={scrollToStart}
              className="bg-black text-white px-8 py-4 rounded-xl font-black text-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              START LEARNING <ArrowRight />
            </button>
          </div>

          <div className="hidden md:block absolute -right-20 -bottom-40 opacity-20 md:opacity-100 md:right-10 md:bottom-[-50px] pointer-events-none">
             <div className="relative w-96 h-96">
               <div className="absolute top-0 right-10 animate-spin-slow">
                 <Recycle size={300} strokeWidth={1} className="text-green-200" />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black p-4 rounded-2xl shadow-lg rotate-12">
                 <Leaf size={48} className="text-green-600" />
               </div>
               <div className="absolute top-10 right-0 bg-white border-2 border-black p-3 rounded-xl shadow-lg -rotate-12">
                 <Factory size={32} className="text-black" />
               </div>
               <div className="absolute bottom-20 left-10 bg-white border-2 border-black p-3 rounded-xl shadow-lg -rotate-6">
                 <Truck size={32} className="text-black" />
               </div>
             </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div id="start-learning" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-lg text-lg">1</span>
            Know Your Waste
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <WasteCard key={index} {...cat} />
            ))}
          </div>
        </div>

        {/* PROCESS */}
        <div className="mb-16">
           <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-lg text-lg">2</span>
            How It Works
          </h2>

          <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-lg">
            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-0"></div>
              {[
                { title: 'Source', icon: Sprout, desc: 'Segregate waste at home.' },
                { title: 'Connect', icon: Truck, desc: 'Find verified buyers.' },
                { title: 'Trade', icon: CheckCircle, desc: 'Negotiate & schedule.' },
                { title: 'Revive', icon: Factory, desc: 'Recycled into new items.' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto bg-black text-white rounded-full flex items-center justify-center border-4 border-white mb-4 shadow-lg">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-2">{step.title}</h3>
                  <p className="text-sm font-bold text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-900 text-green-50 p-8 rounded-3xl border-2 border-black shadow-lg relative overflow-hidden group">
            <Globe className="absolute -right-6 -bottom-6 text-green-800 opacity-50 group-hover:scale-110 transition-transform" size={140} />
            <h3 className="text-4xl font-black mb-2 relative z-10">45%</h3>
            <p className="font-bold text-green-200 relative z-10">Less Ocean Plastic</p>
          </div>
          <div className="bg-emerald-800 text-emerald-50 p-8 rounded-3xl border-2 border-black shadow-lg relative overflow-hidden group">
            <Leaf className="absolute -right-6 -bottom-6 text-emerald-700 opacity-50 group-hover:scale-110 transition-transform" size={140} />
            <h3 className="text-4xl font-black mb-2 relative z-10">2.5M</h3>
            <p className="font-bold text-emerald-200 relative z-10">Trees Saved Yearly</p>
          </div>
           <div className="bg-teal-900 text-teal-50 p-8 rounded-3xl border-2 border-black shadow-lg relative overflow-hidden group">
            <Droplets className="absolute -right-6 -bottom-6 text-teal-800 opacity-50 group-hover:scale-110 transition-transform" size={140} />
            <h3 className="text-4xl font-black mb-2 relative z-10">80%</h3>
            <p className="font-bold text-teal-200 relative z-10">Energy Conserved</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Learn