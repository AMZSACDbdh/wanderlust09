import { createContext, useContext, useReducer, useEffect } from 'react'

// Create context
const TripContext = createContext()

// Initial state
const initialState = {
  selectedDestination: null,
  currentTrip: {
    destination: null,
    startDate: null,
    endDate: null,
    travelers: 1,
    activities: [],
    accommodation: null,
    notes: '',
  },
  savedTrips: [],
  searchHistory: [],
  loading: false,
  error: null,
}

// Action types
const ActionTypes = {
  SET_SELECTED_DESTINATION: 'SET_SELECTED_DESTINATION',
  UPDATE_CURRENT_TRIP: 'UPDATE_CURRENT_TRIP',
  RESET_CURRENT_TRIP: 'RESET_CURRENT_TRIP',
  SAVE_TRIP: 'SAVE_TRIP',
  REMOVE_TRIP: 'REMOVE_TRIP',
  ADD_TO_SEARCH_HISTORY: 'ADD_TO_SEARCH_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
}

// Reducer function
function tripReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_DESTINATION:
      return {
        ...state,
        selectedDestination: action.payload,
        currentTrip: {
          ...state.currentTrip,
          destination: action.payload,
        },
      }
    case ActionTypes.UPDATE_CURRENT_TRIP:
      return {
        ...state,
        currentTrip: {
          ...state.currentTrip,
          ...action.payload,
        },
      }
    case ActionTypes.RESET_CURRENT_TRIP:
      return {
        ...state,
        currentTrip: initialState.currentTrip,
        selectedDestination: null,
      }
    case ActionTypes.SAVE_TRIP:
      const newTrip = {
        ...state.currentTrip,
        id: action.payload.id || Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      return {
        ...state,
        savedTrips: [...state.savedTrips, newTrip],
        currentTrip: initialState.currentTrip,
      }
    case ActionTypes.REMOVE_TRIP:
      return {
        ...state,
        savedTrips: state.savedTrips.filter(trip => trip.id !== action.payload),
      }
    case ActionTypes.ADD_TO_SEARCH_HISTORY:
      // Prevent duplicates in search history
      if (state.searchHistory.some(item => item.query === action.payload.query)) {
        return state
      }
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory].slice(0, 10),
      }
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    default:
      return state
  }
}

// Provider component
export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState)

  // Load saved trips from localStorage on initial render
  useEffect(() => {
    const savedTrips = localStorage.getItem('savedTrips')
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips)
      parsedTrips.forEach(trip => {
        dispatch({
          type: ActionTypes.SAVE_TRIP,
          payload: { id: trip.id },
        })
      })
    }
  }, [])

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedTrips', JSON.stringify(state.savedTrips))
  }, [state.savedTrips])

  // Actions
  const setSelectedDestination = (destination) => {
    dispatch({
      type: ActionTypes.SET_SELECTED_DESTINATION,
      payload: destination,
    })
  }

  const updateCurrentTrip = (tripData) => {
    dispatch({
      type: ActionTypes.UPDATE_CURRENT_TRIP,
      payload: tripData,
    })
  }

  const resetCurrentTrip = () => {
    dispatch({ type: ActionTypes.RESET_CURRENT_TRIP })
  }

  const saveTrip = () => {
    dispatch({
      type: ActionTypes.SAVE_TRIP,
      payload: { id: Date.now().toString() },
    })
  }

  const removeTrip = (tripId) => {
    dispatch({
      type: ActionTypes.REMOVE_TRIP,
      payload: tripId,
    })
  }

  const addToSearchHistory = (searchItem) => {
    dispatch({
      type: ActionTypes.ADD_TO_SEARCH_HISTORY,
      payload: {
        ...searchItem,
        timestamp: new Date().toISOString(),
      },
    })
  }

  const setLoading = (isLoading) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: isLoading,
    })
  }

  const setError = (error) => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: error,
    })
  }

  // Context value
  const value = {
    ...state,
    setSelectedDestination,
    updateCurrentTrip,
    resetCurrentTrip,
    saveTrip,
    removeTrip,
    addToSearchHistory,
    setLoading,
    setError,
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

// Custom hook for using the trip context
export function useTrip() {
  const context = useContext(TripContext)
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider')
  }
  return context
}