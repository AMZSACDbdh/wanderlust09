import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkedAlt, FaCalendarAlt, FaSuitcase, FaSearch } from 'react-icons/fa'
import { countryAPI } from '../services/api'

function HomePage() {
  const [featuredDestinations, setFeaturedDestinations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch featured destinations on component mount
  useEffect(() => {
    async function fetchFeaturedDestinations() {
      try {
        // Get European countries as featured destinations
        const countries = await countryAPI.getCountriesByRegion('europe')
        // Take just a few countries for the featured section
        const featured = countries
          .filter(country => country.name.common && country.flags.png)
          .slice(0, 6)
          .map(country => ({
            id: country.cca3,
            name: country.name.common,
            image: country.flags.png,
            capital: country.capital?.[0] || '',
            region: country.region,
            subregion: country.subregion,
          }))
        
        setFeaturedDestinations(featured)
      } catch (error) {
        console.error('Error fetching featured destinations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFeaturedDestinations()
  }, [])
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }
  
  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Plan, organize, and save your dream vacations with our travel planner.
            </p>
            
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative flex mb-8">
              <input
                type="text"
                placeholder="Where would you like to go?"
                className="input-field text-gray-800 pr-12 py-3 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-primary-500"
                aria-label="Search destinations"
              >
                <FaSearch className="text-xl" />
              </button>
            </form>
            
            <div className="space-x-4">
              <Link to="/search" className="btn-primary py-3 px-6">
                Explore Destinations
              </Link>
              <Link to="/planner" className="btn-outline bg-transparent text-white border-white hover:bg-white/10 py-3 px-6">
                Plan a Trip
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plan your perfect vacation in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaMapMarkedAlt className="text-5xl text-primary-500 mb-6" />,
                title: 'Find Destinations',
                description: 'Search and discover amazing destinations around the world with detailed information.',
              },
              {
                icon: <FaCalendarAlt className="text-5xl text-primary-500 mb-6" />,
                title: 'Plan Your Trip',
                description: 'Create your itinerary with activities, accommodations, and important details.',
              },
              {
                icon: <FaSuitcase className="text-5xl text-primary-500 mb-6" />,
                title: 'Save & Share',
                description: 'Save your trips for later and share them with friends and family.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                {step.icon}
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/search" className="btn-primary py-3 px-6">
              Get Started
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked destinations for your next adventure
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="card group overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-70" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                      <p>{destination.capital && `${destination.capital}, `}{destination.subregion}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Link
                      to={`/search?q=${encodeURIComponent(destination.name)}`}
                      className="btn-primary inline-block w-full text-center"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/search" className="btn-outline py-3 px-6">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="relative py-20 bg-primary-500 text-white">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8">
              Create and plan your perfect trip today with Wanderlust. It's free and easy to use!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/search"
                className="btn-outline bg-transparent text-white border-white hover:bg-white hover:text-primary-500 transition-colors py-3 px-6"
              >
                Find Destinations
              </Link>
              <Link
                to="/planner"
                className="btn-outline bg-white text-primary-500 hover:bg-gray-100 py-3 px-6"
              >
                Plan a Trip
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-400 rounded-full opacity-20" />
          <div className="absolute top-40 -left-20 w-60 h-60 bg-primary-600 rounded-full opacity-20" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-400 rounded-full opacity-20" />
        </div>
      </section>
    </div>
  )
}

export default HomePage