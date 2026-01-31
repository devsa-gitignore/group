import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Handshake, X, CreditCard, CheckCircle } from 'lucide-react'
import { apiRequest } from '../lib/api' 
import { useAuth } from '../context/AuthContext' 

function Chat() {
  // Assuming your route is /chat/:id
  const { id: interestId } = useParams() 
  const navigate = useNavigate()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)

  // Deal & Payment States
  const [showDealModal, setShowDealModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [dealPrice, setDealPrice] = useState('')

  // Helper to determine sender (Me vs Them)
  // safe check (?.) prevents crash if user is null during load
  const isMe = (msgSenderId) => msgSenderId === user?._id; 

  // 1. FETCH MESSAGES (Polling)
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const data = await apiRequest(`/chat/${interestId}`);
        // Backend returns { messages: [...] } or the Chat object directly
        // We handle both cases to be safe
        setMessages(data.messages || data || []);
      } catch (err) {
        console.error("Chat load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChat(); 
    const interval = setInterval(fetchChat, 3000); 
    return () => clearInterval(interval);
  }, [interestId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. SEND MESSAGE
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      // Optimistic UI Update (Show message immediately before server confirms)
      const tempMsg = {
        _id: Date.now(), // temporary ID
        sender_id: user._id,
        text: inputText,
        type: 'text',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, tempMsg]);
      setInputText('');

      // Send to Backend
      await apiRequest(`/chat/${interestId}/send`, 'POST', {
        text: tempMsg.text,
        type: 'text'
      });
      
      // Ideally, we replace the tempMsg with the real one from server here, 
      // but polling will catch it in 3 seconds anyway.
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  }

  // 3. PROPOSE DEAL
  const handleProposeDeal = async () => {
    if (!dealPrice) return;
    try {
      await apiRequest(`/chat/${interestId}/send`, 'POST', {
        price: dealPrice,
        type: 'deal'
      });
      
      setShowDealModal(false);
      setDealPrice('');
      // Polling will fetch the new deal card shortly
    } catch (err) {
      alert("Failed to propose deal");
    }
  }

  // 4. ACCEPT / DECLINE
  const updateDealStatus = async (msgId, newStatus) => {
    try {
      await apiRequest(`/chat/${interestId}/message/${msgId}`, 'PUT', {
        status: newStatus
      });
      
      // Update local state immediately
      setMessages(prev => prev.map(msg => 
        msg._id === msgId ? { ...msg, deal_status: newStatus } : msg
      ));
    } catch (err) {
      alert("Action failed");
    }
  }

  // 5. MOCK PAYMENT
  const handlePaymentComplete = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
        setIsProcessingPayment(false);
        setShowPaymentModal(false);
        alert("Payment Successful! (Mock)");
        navigate('/buyer/home'); 
    }, 2000);
  }

  if (loading) return <div className="p-10 text-center">Loading Chat...</div>;

  return (
    <div className="min-h-screen bg-sage flex flex-col pt-20">
      
      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center relative">
            {isProcessingPayment ? (
              <div className="py-10">
                <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-black">Processing...</h3>
              </div>
            ) : (
              <>
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4"><X /></button>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-2xl font-black mb-2">Complete Purchase</h3>
                <p className="text-gray-500 font-bold mb-6">Total Payable</p>
                <button onClick={handlePaymentComplete} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Pay via UPI <ArrowLeft className="rotate-180" size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- PROPOSE DEAL MODAL --- */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
            <button onClick={() => setShowDealModal(false)} className="absolute top-4 right-4"><X /></button>
            <h3 className="text-2xl font-black text-center mb-6">Propose Offer</h3>
            <div className="mb-6">
              <label className="block text-xs font-black uppercase mb-1">Total Price (₹)</label>
              <input 
                type="number" 
                value={dealPrice}
                onChange={(e) => setDealPrice(e.target.value)}
                className="w-full p-4 border-2 border-black rounded-xl font-bold text-xl"
                autoFocus
              />
            </div>
            <button onClick={handleProposeDeal} className="w-full py-3 bg-black text-white font-bold rounded-xl">SEND PROPOSAL</button>
          </div>
        </div>
      )}

      {/* --- CHAT HEADER --- */}
      <div className="flex-1 bg-white flex flex-col max-w-3xl mx-auto w-full md:border-x-2 md:border-black shadow-2xl">
        <div className="h-16 border-b-2 border-black flex items-center justify-between px-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
            <div>
              <h3 className="font-bold text-lg leading-tight">Chat Room</h3>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-wider">● Live</p>
            </div>
          </div>
        </div>

        {/* --- MESSAGES AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg._id || msg.timestamp} className={`flex ${isMe(msg.sender_id) ? 'justify-end' : 'justify-start'}`}>
              
              {/* DEAL CARD */}
              {msg.type === 'deal' ? (
                <div className="bg-white border-2 border-black p-5 rounded-2xl rounded-br-none min-w-[280px] shadow-md">
                  <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-100 pb-2">
                    <Handshake size={20} className="text-black" />
                    <span className="font-black uppercase tracking-wider text-sm">Official Offer</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs font-bold uppercase">Price</p>
                    <p className="text-3xl font-black">₹{msg.price}</p>
                  </div>

                  {/* DEAL ACTIONS */}
                  {msg.deal_status === 'pending' ? (
                    isMe(msg.sender_id) ? (
                      <div className="bg-gray-100 py-2 rounded-lg text-center text-xs font-bold text-gray-500">Waiting for response...</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => updateDealStatus(msg._id, 'declined')} className="py-2 bg-white border-2 border-red-100 text-red-500 font-bold rounded-lg">Decline</button>
                        <button onClick={() => updateDealStatus(msg._id, 'accepted')} className="py-2 bg-black text-white font-bold rounded-lg">Accept</button>
                      </div>
                    )
                  ) : msg.deal_status === 'accepted' ? (
                    <div className="space-y-3">
                        <div className="bg-green-100 py-2 rounded-lg text-center font-bold text-green-800 border border-green-200 flex items-center justify-center gap-2">
                          <CheckCircle size={16} /> Accepted
                        </div>
                        {/* Only show PAY button to the person who did NOT send the proposal (The Buyer) */}
                        {!isMe(msg.sender_id) && (
                          <button onClick={() => setShowPaymentModal(true)} className="w-full py-3 bg-black text-white font-bold rounded-lg animate-pulse">Pay Now</button>
                        )}
                    </div>
                  ) : (
                    <div className="bg-red-50 py-2 rounded-lg text-center font-bold text-red-500 border border-red-100">Declined</div>
                  )}
                </div>
              ) : (
                /* TEXT MESSAGE */
                <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-bold shadow-sm ${isMe(msg.sender_id) ? 'bg-black text-white rounded-br-none' : 'bg-white border-2 border-gray-200 text-black rounded-bl-none'}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT AREA --- */}
        <div className="p-4 bg-white border-t-2 border-black flex gap-3 items-center">
          <button onClick={() => setShowDealModal(true)} className="p-3 border-2 border-black rounded-xl hover:bg-gray-100">
            <Handshake size={24} />
          </button>
          <form onSubmit={handleSend} className="flex-1 flex gap-2">
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              className="flex-1 bg-gray-50 border-2 border-transparent focus:border-black rounded-xl px-4 font-bold outline-none" 
              placeholder="Type message..." 
            />
            <button type="submit" className="p-3 bg-black text-white rounded-xl">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat;

// import { useState, useEffect, useRef } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Send, Phone, MoreVertical, Handshake, X, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react'
// import { apiRequest } from '../lib/api' // Use your existing helper
// import { useAuth } from '../context/AuthContext' // Import your Auth Context

// function Chat() {
//   const { id: interestId } = useParams() // Assuming URL is /chat/:interestId
//   const navigate = useNavigate()
//   const { user } = useAuth()
//   const messagesEndRef = useRef(null)

//   // Determine user role for UI logic
//   const userRole = user?.role || 'buyer' 
  
//   const [messages, setMessages] = useState([])
//   const [inputText, setInputText] = useState('')
//   const [loading, setLoading] = useState(true)

//   // Deal & Payment States
//   const [showDealModal, setShowDealModal] = useState(false)
//   const [showPaymentModal, setShowPaymentModal] = useState(false)
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false)
//   const [dealPrice, setDealPrice] = useState('')

//   // 1. FETCH MESSAGES (Polling every 3 seconds)
//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const data = await apiRequest(`/chat/${interestId}`);
//         if (data.messages) setMessages(data.messages);
//       } catch (err) {
//         console.error("Chat load error", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChat(); // Initial load
//     const interval = setInterval(fetchChat, 3000); // Poll every 3s
//     return () => clearInterval(interval);
//   }, [interestId]);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleExit = () => {
//     navigate(userRole === 'seller' ? '/market' : '/market');
//   }

//   // 2. SEND MESSAGE (Text)
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!inputText.trim()) return;

//     try {
//       const newMsg = await apiRequest(`/chat/${interestId}/send`, 'POST', {
//         text: inputText,
//         type: 'text'
//       });
//       setMessages([...messages, newMsg]); // Optimistic update
//       setInputText('');
//     } catch (err) {
//       alert("Failed to send message");
//     }
//   }

//   // 3. PROPOSE DEAL (Deal Card)
//   const handleProposeDeal = async () => {
//     if (!dealPrice) return;
//     try {
//       const newMsg = await apiRequest(`/chat/${interestId}/send`, 'POST', {
//         price: dealPrice,
//         type: 'deal'
//       });
//       setMessages([...messages, newMsg]);
//       setShowDealModal(false);
//       setDealPrice('');
//     } catch (err) {
//       alert("Failed to propose deal");
//     }
//   }

//   // 4. ACCEPT / DECLINE LOGIC
//   const updateDealStatus = async (msgId, newStatus) => {
//     try {
//       const updatedMsg = await apiRequest(`/chat/${interestId}/message/${msgId}`, 'PUT', {
//         status: newStatus
//       });
      
//       // Update local state to reflect change immediately
//       setMessages(messages.map(msg => 
//         msg._id === msgId ? { ...msg, deal_status: newStatus } : msg
//       ));
//     } catch (err) {
//       alert("Action failed");
//     }
//   }

//   // 5. PROCESS PAYMENT -> CREATE TRANSACTION
//   const handlePaymentComplete = async () => {
//     setIsProcessingPayment(true);
    
//     // Find the accepted deal to get the price
//     const acceptedDeal = messages.find(m => m.type === 'deal' && m.deal_status === 'accepted');

//     try {
//       // Call backend to create the immutable transaction record
//       const transaction = await apiRequest('/transactions/create', 'POST', {
//         interest_id: interestId,
//         agreed_price: acceptedDeal?.price || 0,
//         payment_method: 'UPI' // or 'Card'
//       });

//       // Simulating delay for UX
//       setTimeout(() => {
//         setIsProcessingPayment(false);
//         setShowPaymentModal(false);
//         // Redirect to Tracking Page
//         navigate(`/track/${transaction._id}`); 
//       }, 2000);

//     } catch (err) {
//       console.error(err);
//       setIsProcessingPayment(false);
//       alert("Payment failed. Please try again.");
//     }
//   }

//   // Helper to determine sender (Me vs Them)
//   const isMe = (msgSenderId) => msgSenderId === user._id;

//   return (
//     <div className="min-h-screen bg-sage flex flex-col pt-20">
      
//       {/* ... (Keep your Payment & Deal Modals exactly the same as before) ... */}

//       {/* --- PAYMENT MODAL (Buyer Only) --- */}
//       {showPaymentModal && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center relative">
//             {isProcessingPayment ? (
//               <div className="py-10">
//                 <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//                 <h3 className="text-xl font-black">Processing...</h3>
//                 <p className="text-gray-500 font-bold">Securely transferring funds.</p>
//               </div>
//             ) : (
//               <>
//                 <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4"><X /></button>
//                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <CreditCard size={32} />
//                 </div>
//                 <h3 className="text-2xl font-black mb-2">Complete Purchase</h3>
//                 <p className="text-gray-500 font-bold mb-6">
//                   Total Payable: <span className="text-black">₹{messages.find(m => m.type === 'deal' && m.deal_status === 'accepted')?.price}</span>
//                 </p>
                
//                 <div className="space-y-3">
//                   <button onClick={handlePaymentComplete} className="w-full py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
//                     Pay via UPI <ArrowLeft className="rotate-180" size={18} />
//                   </button>
//                   {/* ... other buttons ... */}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ... (Keep Deal Modal same, just verify onClick handlers match new names) ... */}

//       {/* --- PROPOSE DEAL MODAL --- */}
//       {showDealModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
//             <button onClick={() => setShowDealModal(false)} className="absolute top-4 right-4"><X /></button>
//             <div className="text-center mb-6">
//               <h3 className="text-2xl font-black">Propose Offer</h3>
//             </div>
//             <div className="mb-6">
//               <label className="block text-xs font-black uppercase mb-1">Total Price (₹)</label>
//               <input 
//                 type="number" 
//                 value={dealPrice}
//                 onChange={(e) => setDealPrice(e.target.value)}
//                 className="w-full p-4 border-2 border-black rounded-xl font-bold text-xl"
//                 autoFocus
//               />
//             </div>
//             <button onClick={handleProposeDeal} className="w-full py-3 bg-black text-white font-bold rounded-xl">
//               SEND PROPOSAL
//             </button>
//           </div>
//         </div>
//       )}

//       {/* --- CHAT HEADER --- */}
//       <div className="flex-1 bg-white flex flex-col max-w-3xl mx-auto w-full md:border-x-2 md:border-black shadow-2xl">
//         <div className="h-16 border-b-2 border-black flex items-center justify-between px-4 sticky top-0 bg-white z-10">
//           <div className="flex items-center gap-3">
//             <button onClick={handleExit} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
//             <div>
//               <h3 className="font-bold text-lg leading-tight">{userRole === 'seller' ? 'Buyer' : 'Seller'}</h3>
//               <p className="text-[10px] text-green-600 font-black uppercase tracking-wider">● Online</p>
//             </div>
//           </div>
//         </div>

//         {/* --- MESSAGES AREA --- */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//           {messages.map((msg) => (
//             <div key={msg._id} className={`flex ${isMe(msg.sender_id) ? 'justify-end' : 'justify-start'}`}>
              
//               {/* DEAL CARD LOGIC */}
//               {msg.type === 'deal' ? (
//                 <div className="bg-white border-2 border-black p-5 rounded-2xl rounded-br-none min-w-[280px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
//                   <div className="flex items-center gap-2 mb-4 border-b-2 border-gray-100 pb-2">
//                     <Handshake size={20} className="text-black" />
//                     <span className="font-black uppercase tracking-wider text-sm">Official Offer</span>
//                   </div>
                  
//                   <div className="mb-4">
//                     <p className="text-gray-400 text-xs font-bold uppercase">Total Deal Price</p>
//                     <p className="text-3xl font-black">₹{msg.price}</p>
//                   </div>

//                   {/* STATUS LOGIC */}
//                   {msg.deal_status === 'pending' ? (
//                     isMe(msg.sender_id) ? (
//                       <div className="bg-gray-100 py-2 rounded-lg text-center text-xs font-bold text-gray-500">
//                         Waiting for response...
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-2 gap-2">
//                         <button onClick={() => updateDealStatus(msg._id, 'declined')} className="py-2 bg-white border-2 border-red-100 text-red-500 font-bold rounded-lg">Decline</button>
//                         <button onClick={() => updateDealStatus(msg._id, 'accepted')} className="py-2 bg-black text-white font-bold rounded-lg">Accept</button>
//                       </div>
//                     )
//                   ) : msg.deal_status === 'accepted' ? (
//                     <div className="space-y-3">
//                         <div className="bg-green-100 py-2 rounded-lg text-center font-bold text-green-800 border border-green-200 flex items-center justify-center gap-2">
//                           <CheckCircle size={16} /> Offer Accepted
//                         </div>
//                         {userRole === 'buyer' && (
//                           <button onClick={() => setShowPaymentModal(true)} className="w-full py-3 bg-black text-white font-bold rounded-lg animate-pulse">
//                             Pay Now
//                           </button>
//                         )}
//                     </div>
//                   ) : (
//                     <div className="bg-red-50 py-2 rounded-lg text-center font-bold text-red-500 border border-red-100">
//                       Offer Declined
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 /* TEXT MESSAGE LOGIC */
//                 <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-bold shadow-sm ${isMe(msg.sender_id) ? 'bg-black text-white rounded-br-none' : 'bg-white border-2 border-gray-200 text-black rounded-bl-none'}`}>
//                   {msg.text}
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* --- INPUT AREA --- */}
//         <div className="p-4 bg-white border-t-2 border-black flex gap-3 items-center">
//           <button onClick={() => setShowDealModal(true)} className="p-3 border-2 border-black rounded-xl hover:bg-gray-100">
//             <Handshake size={24} />
//           </button>
//           <form onSubmit={handleSend} className="flex-1 flex gap-2">
//             <input 
//               type="text" 
//               value={inputText} 
//               onChange={(e) => setInputText(e.target.value)} 
//               className="flex-1 bg-gray-50 border-2 border-transparent focus:border-black rounded-xl px-4 font-bold outline-none" 
//               placeholder="Type message..." 
//             />
//             <button type="submit" className="p-3 bg-black text-white rounded-xl">
//               <Send size={20} />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Chat