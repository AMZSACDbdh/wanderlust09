import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const DestinationSearchPage = lazy(() => import('./pages/DestinationSearchPage'))
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage'))
const SavedTripsPage = lazy(() => import('./pages/SavedTripsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<DestinationSearchPage />} />
            <Route path="/planner" element={<TripPlannerPage />} />
            <Route path="/planner/:destinationId" element={<TripPlannerPage />} />
            <Route path="/saved-trips" element={<SavedTripsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App