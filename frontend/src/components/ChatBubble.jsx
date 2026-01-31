function ChatBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isOwn 
            ? 'bg-eco-600 text-white rounded-br-none' 
            : 'bg-white shadow-md rounded-bl-none'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-2 ${
            isOwn ? 'text-eco-100' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-eco-200 flex items-center justify-center mr-2 order-0">
          <svg className="w-4 h-4 text-eco-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      
      {isOwn && (
        <div className="w-8 h-8 rounded-full bg-eco-600 flex items-center justify-center ml-2 order-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default ChatBubble
