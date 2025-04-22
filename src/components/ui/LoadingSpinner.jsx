function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  }
  
  return (
    <div className="flex justify-center items-center p-8 h-full w-full">
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-primary-500 animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}

export default LoadingSpinner