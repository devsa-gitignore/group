import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from 'lucide-react'

function Contact() {
  return (
    <div className="min-h-screen bg-sage pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
          <p className="font-bold text-gray-500 text-lg max-w-2xl mx-auto">
            Have questions about recycling rates, pickup schedules, or enterprise partnerships? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: INFO CARDS */}
          <div className="space-y-6">
            
            {/* Address Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black mb-2">Headquarters</h3>
              <p className="font-bold text-gray-500">
                124, Green Tech Park,<br/>
                Andheri East, Mumbai,<br/>
                Maharashtra 400093
              </p>
            </div>

            {/* Contacts Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
              <div className="w-12 h-12 bg-green-100 text-green-800 border-2 border-green-800 rounded-full flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-black mb-2">Direct Lines</h3>
              <div className="space-y-2">
                <p className="font-bold text-gray-500 flex items-center gap-2">
                  <Phone size={14} /> +91 98765 43210 (Support)
                </p>
                <p className="font-bold text-gray-500 flex items-center gap-2">
                  <Mail size={14} /> help@ecosetu.com
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform">
               <div className="w-12 h-12 bg-blue-100 text-blue-800 border-2 border-blue-800 rounded-full flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-black mb-2">Operating Hours</h3>
              <p className="font-bold text-gray-500">Mon - Sat: 9:00 AM - 8:00 PM</p>
              <p className="font-bold text-gray-400 text-sm">Sunday Closed</p>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-2 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <MessageSquare className="text-green-600" /> Send a Message
              </h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest ml-1">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" placeholder="john@company.com" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest ml-1">Subject</label>
                  <select className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black focus:bg-white transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Partnership Proposal</option>
                    <option>Report an Issue</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest ml-1">Message</label>
                  <textarea rows="5" placeholder="How can we help you today?" className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black focus:bg-white transition-all resize-none"></textarea>
                </div>

                <button type="button" className="w-full py-4 bg-black text-white font-black text-xl rounded-xl hover:scale-[1.01] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg">
                  SEND MESSAGE <Send size={20} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact