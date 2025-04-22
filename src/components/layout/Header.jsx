import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaGlobeAmericas, FaSearch, FaRoute, FaSuitcase, FaBars, FaTimes } from 'react-icons/fa'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  
  // Handle scroll effect for transparent/solid header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  // Determine if we're on the homepage to show transparent header
  const isHomePage = location.pathname === '/'
  const headerClass = isHomePage && !isScrolled && !isMenuOpen
    ? 'bg-transparent text-white'
    : 'bg-white text-gray-800 shadow-md'
    
  // Navigation links
  const navLinks = [
    { to: '/search', label: 'Destinations', icon: <FaSearch className="mr-2" /> },
    { to: '/planner', label: 'Plan Trip', icon: <FaRoute className="mr-2" /> },
    { to: '/saved-trips', label: 'Saved Trips', icon: <FaSuitcase className="mr-2" /> },
  ]
  
  return (
    <header className={`fixed w-full z-40 transition-all duration-300 ${headerClass}`}>
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center font-bold text-xl transition-transform hover:scale-105"
          >
            <FaGlobeAmericas className="text-primary-500 mr-2 text-2xl" />
            <span className={isHomePage && !isScrolled && !isMenuOpen ? 'text-white' : 'text-gray-800'}>
              Wander<span className="text-primary-500">lust</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center font-medium hover:text-primary-500 transition-colors ${
                    isActive 
                      ? 'text-primary-500' 
                      : isHomePage && !isScrolled 
                        ? 'text-white hover:text-white/80' 
                        : 'text-gray-700'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white py-4 px-6 shadow-lg animate-fade-in">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center py-2 text-lg font-medium ${
                      isActive ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'
                    }`
                  }
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header