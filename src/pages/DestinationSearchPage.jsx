import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaInfo } from 'react-icons/fa'
import { useTrip } from '../contexts/TripContext'
import { destinationAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function DestinationSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [destinations, setDestinations] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { addToSearchHistory, setSelectedDestination } = useTrip()
  
  // Check for query parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('q')
    
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [location.search])
  
  // Search for destinations
  const handleSearch = async (query) => {
    if (!query.trim()) return
    
    setIsLoading(true)
    setError(null)
    setDestinations([])
    
    try {
      const result = await destinationAPI.searchDestinations(query)
      
      if (result) {
        setDestinations(result.details || [])
        // Add to search history
        addToSearchHistory({
          query,
          result: result.city + ', ' + result.country,
        })
      } else {
        setError('No destinations found. Try a different search term.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Error searching destinations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
      // Update URL with search query
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  // Get place details
  const getPlaceDetails = async (xid) => {
    setIsLoading(true)
    
    try {
      const details = await destinationAPI.getPlaceDetails(xid)
      setSelectedPlace(details)
    } catch (err) {
      console.error('Error getting place details:', err)
      setError('Error fetching place details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Select a destination and go to planner
  const selectDestination = (place) => {
    setSelectedDestination({
      id: place.xid,
      name: place.name,
      location: {
        lat: place.point.lat,
        lon: place.point.lon,
      },
      kind: place.kinds,
    })
    
    navigate(`/planner`)
  }
  
  return (
    <div className="pt-20 md:pt-24 bg-gray-50 min-h-screen page-transition">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Next Destination</h1>
        
        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              className="input-field py-3 pr-12"
              placeholder="Search for a city, country, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-primary-500"
              aria-label="Search destinations"
            >
              <FaSearch className="text-xl" />
            </button>
          </div>
        </form>
        
        {/* Error message */}
        {error && (
          <div className="bg-error-500 bg-opacity-10 text-error-500 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && <LoadingSpinner />}
        
        {/* Results display */}
        {!isLoading && destinations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Results list */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destinations.map((place) => (
                  <div
                    key={place.xid}
                    className="card hover:scale-[1.02] transition-transform"
                  >
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                      <p className="text-gray-600 flex items-center mb-4">
                        <FaMapMarkerAlt className="mr-1 text-primary-500" />
                        <span>
                          {place.kinds.split(',')[0].replace(/_/g, ' ')}
                        </span>
                      </p>
                      <div className="flex justify-between mt-4">
                        <button
                          className="btn-outline text-sm px-3 py-1"
                          onClick={() => getPlaceDetails(place.xid)}
                        >
                          <FaInfo className="mr-1" />
                          Details
                        </button>
                        <button
                          className="btn-primary text-sm px-3 py-1"
                          onClick={() => selectDestination(place)}
                        >
                          Plan a Trip
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Selected place details */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold mb-4">Destination Details</h2>
              {selectedPlace ? (
                <div className="card p-6">
                  {selectedPlace.preview?.source && (
                    <div className="mb-4">
                      <img
                        src={selectedPlace.preview.source}
                        alt={selectedPlace.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{selectedPlace.name}</h3>
                  
                  {selectedPlace.address && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-700">Address:</h4>
                      <p className="text-gray-600">
                        {[
                          selectedPlace.address.road,
                          selectedPlace.address.city,
                          selectedPlace.address.state,
                          selectedPlace.address.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {selectedPlace.kinds && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-700">Type:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.kinds.split(',').slice(0, 3).map((kind, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                          >
                            {kind.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedPlace.wikipedia_extracts?.text && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Description:</h4>
                      <p className="text-gray-600 text-sm">
                        {selectedPlace.wikipedia_extracts.text}
                      </p>
                    </div>
                  )}
                  
                  <button
                    className="btn-primary w-full mt-4"
                    onClick={() => selectDestination(selectedPlace)}
                  >
                    Plan a Trip Here
                  </button>
                </div>
              ) : (
                <div className="card p-6 bg-gray-100">
                  <p className="text-gray-600">
                    Select a destination from the results to see detailed information.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* No results message */}
        {!isLoading && searchQuery && destinations.length === 0 && !error && (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-lg text-gray-600 mb-4">
              No destinations found for "{searchQuery}".
            </p>
            <p className="text-gray-500">
              Try searching for a different city, country, or landmark.
            </p>
          </div>
        )}
        
        {/* Initial state - no search yet */}
        {!isLoading && !searchQuery && destinations.length === 0 && !error && (
          <div className="bg-gray-100 p-8 rounded-lg text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Ready to explore?</h2>
            <p className="text-lg text-gray-600 mb-4">
              Search for a city, country, or landmark to start planning your next adventure.
            </p>
            <p className="text-gray-500">
              Try popular destinations like "Paris", "Tokyo", or "Grand Canyon".
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationSearchPage