import { Link } from 'react-router-dom'
import { FaGlobeAmericas, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center font-bold text-xl mb-4">
              <FaGlobeAmericas className="text-primary-500 mr-2 text-2xl" />
              <span>Wander<span className="text-primary-500">lust</span></span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your personal travel planner for discovering amazing destinations around the world.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Find Destinations
                </Link>
              </li>
              <li>
                <Link to="/planner" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link to="/saved-trips" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Saved Trips
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Travel Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Travel Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>support@wanderlust.com</li>
              <li>+91 9999999999 </li>
              <li>123 Travel Avenue, New Delhi , India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>© {currentYear} Wanderlust Travel Planner. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
