import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../contexts/TripContext'
import { FaCalendarAlt, FaUserFriends, FaHotel, FaListUl, FaSave, FaTimes, FaSun, FaCloudSun, FaCloud, FaCloudRain, FaSnowflake } from 'react-icons/fa'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { weatherAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Activity options based on categories
const ACTIVITY_OPTIONS = {
  sightseeing: [
    'Visit Museums', 
    'Historical Sites Tour', 
    'City Walking Tour',
    'Landmark Photography',
    'Architectural Tour'
  ],
  outdoor: [
    'Hiking', 
    'Beach Day', 
    'National Park Visit', 
    'Cycling Tour',
    'Water Sports',
    'Mountain Biking',
    'Rock Climbing'
  ],
  food: [
    'Food Tour', 
    'Cooking Class', 
    'Restaurant Hopping', 
    'Wine Tasting',
    'Street Food Exploration',
    'Local Market Visit'
  ],
  entertainment: [
    'Concert/Show', 
    'Nightlife Experience', 
    'Theater Performance', 
    'Cultural Festival',
    'Local Sports Event'
  ],
  relaxation: [
    'Spa Day', 
    'Beach Relaxation', 
    'Yoga Retreat', 
    'Hot Springs',
    'Meditation Session'
  ],
  shopping: [
    'Shopping Tour', 
    'Local Markets', 
    'Souvenir Hunting', 
    'Mall Experience',
    'Antique Shopping'
  ]
}

// Accommodation options
const ACCOMMODATION_OPTIONS = [
  'Hotel',
  'Hostel',
  'Vacation Rental',
  'Resort',
  'Bed & Breakfast',
  'Camping',
  'Apartment',
  'Guest House'
]

// Weather icon mapping
const getWeatherIcon = (code) => {
  if (code >= 200 && code < 300) return <FaCloudRain className="text-2xl" />  // Thunderstorm
  if (code >= 300 && code < 400) return <FaCloudRain className="text-2xl" />  // Drizzle
  if (code >= 500 && code < 600) return <FaCloudRain className="text-2xl" />  // Rain
  if (code >= 600 && code < 700) return <FaSnowflake className="text-2xl" />  // Snow
  if (code >= 700 && code < 800) return <FaCloud className="text-2xl" />      // Atmosphere
  if (code === 800) return <FaSun className="text-2xl text-yellow-500" />     // Clear
  return <FaCloudSun className="text-2xl" />                                  // Clouds
}

function TripPlannerPage() {
  const navigate = useNavigate()
  const { 
    selectedDestination, 
    currentTrip, 
    updateCurrentTrip,
    resetCurrentTrip,
    saveTrip,
  } = useTrip()
  
  const [errors, setErrors] = useState({})
  const [weatherData, setWeatherData] = useState(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [selectedActivities, setSelectedActivities] = useState([])
  
  // Redirect if no destination is selected
  useEffect(() => {
    if (!selectedDestination && !currentTrip.destination) {
      navigate('/search')
    }
  }, [selectedDestination, currentTrip.destination, navigate])
  
  // Initialize selected activities from current trip
  useEffect(() => {
    if (currentTrip.activities) {
      setSelectedActivities(currentTrip.activities)
    }
  }, [currentTrip.activities])
  
  // Fetch weather data when a destination is selected
  useEffect(() => {
    const fetchWeather = async () => {
      if (selectedDestination?.location) {
        setIsLoadingWeather(true)
        try {
          const weather = await weatherAPI.getForecast(
            selectedDestination.location.lat,
            selectedDestination.location.lon
          )
          setWeatherData(weather)
        } catch (error) {
          console.error('Error fetching weather:', error)
        } finally {
          setIsLoadingWeather(false)
        }
      }
    }
    
    fetchWeather()
  }, [selectedDestination])
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    updateCurrentTrip({ [name]: value })
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  // Handle date changes
  const handleDateChange = (field, date) => {
    updateCurrentTrip({ [field]: date })
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
  
  // Handle activity selection
  const handleActivityChange = (activity) => {
    const updatedActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter(item => item !== activity)
      : [...selectedActivities, activity]
    
    setSelectedActivities(updatedActivities)
    updateCurrentTrip({ activities: updatedActivities })
  }
  
  // Validate form before saving
  const validateForm = () => {
    const newErrors = {}
    
    if (!currentTrip.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!currentTrip.endDate) {
      newErrors.endDate = 'End date is required'
    } else if (currentTrip.startDate && currentTrip.endDate < currentTrip.startDate) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    if (!currentTrip.travelers || currentTrip.travelers < 1) {
      newErrors.travelers = 'At least 1 traveler is required'
    }
    
    if (!currentTrip.accommodation) {
      newErrors.accommodation = 'Please select an accommodation type'
    }
    
    if (!selectedActivities.length) {
      newErrors.activities = 'Please select at least one activity'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Handle save trip
  const handleSaveTrip = () => {
    if (validateForm()) {
      saveTrip()
      navigate('/saved-trips')
    }
  }
  
  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset this trip? All unsaved changes will be lost.')) {
      resetCurrentTrip()
      setSelectedActivities([])
      navigate('/search')
    }
  }
  
  // Create a 5-day forecast from weather data
  const createForecast = () => {
    if (!weatherData || !weatherData.list) return []
    
    const forecast = []
    const dates = {}
    
    // Group by date and take first entry of each day
    weatherData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!dates[date]) {
        dates[date] = item
        forecast.push(item)
      }
    })
    
    return forecast.slice(0, 5) // Return 5-day forecast
  }
  
  return (
    <div className="pt-20 md:pt-24 bg-gray-50 min-h-screen page-transition">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Plan Your Trip</h1>
        
        {/* Destination header */}
        {selectedDestination && (
          <div className="mb-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDestination.name}</h2>
                  <p className="text-gray-600">
                    {selectedDestination.kind?.split(',')[0].replace(/_/g, ' ')}
                  </p>
                </div>
                
                <button
                  className="btn-outline flex items-center text-sm"
                  onClick={handleReset}
                >
                  <FaTimes className="mr-2" />
                  Change Destination
                </button>
              </div>
              
              {/* Weather forecast */}
              {isLoadingWeather ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Loading weather forecast...</p>
                  <LoadingSpinner size="small" />
                </div>
              ) : weatherData ? (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-3">5-Day Weather Forecast</h3>
                  <div className="flex overflow-x-auto pb-2 gap-4">
                    {createForecast().map((day, index) => {
                      const date = new Date(day.dt * 1000)
                      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
                      const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
                      
                      return (
                        <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 text-center min-w-24">
                          <p className="font-semibold">{dayName}</p>
                          <p className="text-xs text-gray-500">{formattedDate}</p>
                          <div className="my-2 flex justify-center">
                            {getWeatherIcon(day.weather[0].id)}
                          </div>
                          <p className="font-medium">{Math.round(day.main.temp)}°C</p>
                          <p className="text-xs text-gray-500 capitalize">{day.weather[0].description}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
        
        {/* Trip Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Trip Details</h2>
              
              <div className="space-y-6">
                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Date</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <FaCalendarAlt />
                      </div>
                      <DatePicker
                        selected={currentTrip.startDate}
                        onChange={(date) => handleDateChange('startDate', date)}
                        minDate={new Date()}
                        className="input-field pl-10"
                        placeholderText="Select start date"
                      />
                    </div>
                    {errors.startDate && <p className="form-error">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <label className="form-label">End Date</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <FaCalendarAlt />
                      </div>
                      <DatePicker
                        selected={currentTrip.endDate}
                        onChange={(date) => handleDateChange('endDate', date)}
                        minDate={currentTrip.startDate || new Date()}
                        className="input-field pl-10"
                        placeholderText="Select end date"
                      />
                    </div>
                    {errors.endDate && <p className="form-error">{errors.endDate}</p>}
                  </div>
                </div>
                
                {/* Travelers */}
                <div>
                  <label htmlFor="travelers" className="form-label">Number of Travelers</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaUserFriends />
                    </div>
                    <input
                      type="number"
                      id="travelers"
                      name="travelers"
                      min="1"
                      value={currentTrip.travelers || ''}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Number of travelers"
                    />
                  </div>
                  {errors.travelers && <p className="form-error">{errors.travelers}</p>}
                </div>
                
                {/* Accommodation */}
                <div>
                  <label htmlFor="accommodation" className="form-label">Accommodation</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaHotel />
                    </div>
                    <select
                      id="accommodation"
                      name="accommodation"
                      value={currentTrip.accommodation || ''}
                      onChange={handleInputChange}
                      className="input-field pl-10 appearance-none"
                    >
                      <option value="">Select accommodation type</option>
                      {ACCOMMODATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.accommodation && <p className="form-error">{errors.accommodation}</p>}
                </div>
                
                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="form-label">Trip Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={currentTrip.notes || ''}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field"
                    placeholder="Add any special notes or requirements for your trip..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Activities */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <FaListUl className="text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Activities</h2>
              </div>
              
              {Object.entries(ACTIVITY_OPTIONS).map(([category, activities]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-md font-medium mb-2 capitalize">{category}</h3>
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div key={activity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`activity-${activity}`}
                          checked={selectedActivities.includes(activity)}
                          onChange={() => handleActivityChange(activity)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor={`activity-${activity}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {activity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {errors.activities && <p className="form-error">{errors.activities}</p>}
            </div>
            
            {/* Save Button */}
            <button
              onClick={handleSaveTrip}
              className="btn-primary w-full flex items-center justify-center py-3"
            >
              <FaSave className="mr-2" />
              Save Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlannerPage