import axios from 'axios'

// Create an axios instance with defaults
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Destinations API - Using OpenTripMap for destination data
const OPEN_TRIP_MAP_API_KEY = import.meta.env.VITE_OPEN_TRIP_MAP_API_KEY
const OPEN_TRIP_MAP_BASE_URL = 'https://api.opentripmap.com/0.1/en'

// Weather API - Using OpenWeatherMap
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY
const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Country data API - RESTCountries
const REST_COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1'

// Destinations API
export const destinationAPI = {
  // Search destinations by name
  searchDestinations: async (query, limit = 10) => {
    try {
      const response = await axios.get(
        `${OPEN_TRIP_MAP_BASE_URL}/places/geoname`,
        {
          params: {
            name: query,
            apikey: OPEN_TRIP_MAP_API_KEY,
          },
        }
      )
      
      if (response.data && response.status === 200) {
        // If we find the place, get additional details
        if (response.data.name) {
          const details = await destinationAPI.getDestinationDetails(
            response.data.lat,
            response.data.lon,
            limit
          )
          return {
            city: response.data.name,
            country: response.data.country,
            details,
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('Error searching destinations:', error)
      throw error
    }
  },
  
  // Get destination details by coordinates
  getDestinationDetails: async (lat, lon, limit = 10, radius = 1000) => {
    try {
      const response = await axios.get(
        `${OPEN_TRIP_MAP_BASE_URL}/places/radius`,
        {
          params: {
            radius,
            lat,
            lon,
            limit,
            apikey: OPEN_TRIP_MAP_API_KEY,
            rate: 3, // Only include important places
            format: 'json',
          },
        }
      )
      
      if (response.data && response.status === 200) {
        return response.data
      }
      
      return []
    } catch (error) {
      console.error('Error getting destination details:', error)
      throw error
    }
  },
  
  // Get place details
  getPlaceDetails: async (xid) => {
    try {
      const response = await axios.get(
        `${OPEN_TRIP_MAP_BASE_URL}/places/xid/${xid}`,
        {
          params: {
            apikey: OPEN_TRIP_MAP_API_KEY,
          },
        }
      )
      
      if (response.data && response.status === 200) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Error getting place details:', error)
      throw error
    }
  },
}

// Weather API
export const weatherAPI = {
  // Get current weather by coordinates
  getCurrentWeather: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${OPEN_WEATHER_BASE_URL}/weather`,
        {
          params: {
            lat,
            lon,
            appid: OPEN_WEATHER_API_KEY,
            units: 'metric',
          },
        }
      )
      
      if (response.data && response.status === 200) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Error getting current weather:', error)
      throw error
    }
  },
  
  // Get 5-day forecast by coordinates
  getForecast: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${OPEN_WEATHER_BASE_URL}/forecast`,
        {
          params: {
            lat,
            lon,
            appid: OPEN_WEATHER_API_KEY,
            units: 'metric',
          },
        }
      )
      
      if (response.data && response.status === 200) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Error getting forecast:', error)
      throw error
    }
  },
}

// Country data API
export const countryAPI = {
  // Get country details by name
  getCountryDetails: async (name) => {
    try {
      const response = await axios.get(
        `${REST_COUNTRIES_BASE_URL}/name/${name}?fullText=true`
      )
      
      if (response.data && response.status === 200) {
        return response.data[0]
      }
      
      return null
    } catch (error) {
      console.error('Error getting country details:', error)
      throw error
    }
  },
  
  // Get countries by region
  getCountriesByRegion: async (region) => {
    try {
      const response = await axios.get(
        `${REST_COUNTRIES_BASE_URL}/region/${region}`
      )
      
      if (response.data && response.status === 200) {
        return response.data
      }
      
      return []
    } catch (error) {
      console.error('Error getting countries by region:', error)
      throw error
    }
  },
}

export default {
  destinationAPI,
  weatherAPI,
  countryAPI,
}