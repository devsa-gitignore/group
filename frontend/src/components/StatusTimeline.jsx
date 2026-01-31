function StatusTimeline({ steps }) {
  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={index} className="relative pb-8 last:pb-0">
          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div className={`absolute left-4 top-8 w-0.5 h-full ${
              step.completed ? 'bg-eco-600' : 'bg-gray-300'
            }`} />
          )}
          
          {/* Step content */}
          <div className="relative flex items-start">
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-eco-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.completed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              )}
            </div>
            
            {/* Details */}
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-sm font-semibold ${
                  step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </h3>
                {step.timestamp && (
                  <span className="text-xs text-gray-500">
                    {new Date(step.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              
              {step.hash && (
                <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                  {step.hash.substring(0, 16)}...
                </div>
              )}
              
              {step.description && (
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusTimeline
