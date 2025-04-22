import { Link } from 'react-router-dom'
import { FaHome, FaSearch, FaRoute } from 'react-icons/fa'

function NotFoundPage() {
  return (
    <div className="pt-20 flex items-center justify-center min-h-screen bg-gray-50 page-transition">
      <div className="container-custom py-8 text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track for your next adventure.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary py-3 px-6 flex items-center justify-center w-full sm:w-auto"
          >
            <FaHome className="mr-2" />
            Go Home
          </Link>
          <Link
            to="/search"
            className="btn-outline py-3 px-6 flex items-center justify-center w-full sm:w-auto"
          >
            <FaSearch className="mr-2" />
            Find Destinations
          </Link>
          <Link
            to="/planner"
            className="btn-secondary py-3 px-6 flex items-center justify-center w-full sm:w-auto"
          >
            <FaRoute className="mr-2" />
            Plan a Trip
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage