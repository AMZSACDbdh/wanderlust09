import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../contexts/TripContext'
import { FaCalendarAlt, FaUserFriends, FaHotel, FaMapMarkerAlt, FaTrash, FaPencilAlt, FaListUl } from 'react-icons/fa'
import { format } from 'date-fns'

function SavedTripsPage() {
  const navigate = useNavigate()
  const { savedTrips, removeTrip } = useTrip()
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (error) {
      return 'Invalid date'
    }
  }
  
  // Calculate trip duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays
    } catch (error) {
      return null
    }
  }
  
  // Handle trip deletion
  const handleDeleteClick = (tripId) => {
    setShowConfirmDelete(tripId)
  }
  
  const confirmDelete = (tripId) => {
    removeTrip(tripId)
    setShowConfirmDelete(null)
  }
  
  const cancelDelete = () => {
    setShowConfirmDelete(null)
  }
  
  return (
    <div className="pt-20 md:pt-24 bg-gray-50 min-h-screen page-transition">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Your Saved Trips</h1>
        
        {savedTrips.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">No Saved Trips Yet</h2>
            <p className="text-gray-600 mb-6">
              Start planning your dream vacation by searching for a destination.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="btn-primary py-3 px-6"
            >
              Find Destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((trip) => {
              const duration = calculateDuration(trip.startDate, trip.endDate)
              
              return (
                <div key={trip.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  {/* Trip header */}
                  <div className="bg-primary-500 text-white p-4">
                    <h2 className="text-xl font-bold mb-1">
                      {trip.destination?.name || 'Trip Destination'}
                    </h2>
                    <p className="flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-1" />
                      {trip.destination?.kind?.split(',')[0].replace(/_/g, ' ') || 'Destination'}
                    </p>
                  </div>
                  
                  {/* Trip details */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* Dates */}
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-primary-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Dates</p>
                          <p>
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            {duration && ` (${duration} days)`}
                          </p>
                        </div>
                      </div>
                      
                      {/* Travelers */}
                      <div className="flex items-start">
                        <FaUserFriends className="text-primary-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Travelers</p>
                          <p>{trip.travelers || 1}</p>
                        </div>
                      </div>
                      
                      {/* Accommodation */}
                      <div className="flex items-start">
                        <FaHotel className="text-primary-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Accommodation</p>
                          <p>{trip.accommodation || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      {/* Activities */}
                      <div className="flex items-start">
                        <FaListUl className="text-primary-500 mt-1 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Activities</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {trip.activities?.length > 0 ? (
                              trip.activities.slice(0, 3).map((activity, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                                >
                                  {activity}
                                </span>
                              ))
                            ) : (
                              <p className="text-sm">No activities planned</p>
                            )}
                            {trip.activities?.length > 3 && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                +{trip.activities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Notes (if any) */}
                      {trip.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-700">{trip.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => handleDeleteClick(trip.id)}
                        className="flex items-center text-gray-600 hover:text-error-500 transition-colors"
                      >
                        <FaTrash className="mr-1" />
                        <span>Delete</span>
                      </button>
                      
                      <button
                        onClick={() => navigate(`/planner/${trip.id}`)}
                        className="flex items-center text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <FaPencilAlt className="mr-1" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    {/* Delete confirmation */}
                    {showConfirmDelete === trip.id && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-error-500">
                        <p className="text-sm text-gray-800 mb-3">
                          Are you sure you want to delete this trip? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelDelete}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => confirmDelete(trip.id)}
                            className="px-3 py-1 text-sm bg-error-500 text-white hover:bg-error-600 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedTripsPage