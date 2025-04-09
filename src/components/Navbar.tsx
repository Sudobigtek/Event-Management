import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, Crown, Menu, User, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">Elfrique</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/events" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </Link>
            <Link to="/voting" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
              <Award className="h-4 w-4" />
              <span>Voting</span>
            </Link>
            <Link to="/awards" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600">
              <Crown className="h-4 w-4" />
              <span>Awards</span>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-4">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/events" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </Link>
              <Link to="/voting" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <Award className="h-4 w-4" />
                <span>Voting</span>
              </Link>
              <Link to="/awards" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600">
                <Crown className="h-4 w-4" />
                <span>Awards</span>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;