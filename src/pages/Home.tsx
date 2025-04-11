import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, Crown, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your All-in-One Event Management Platform
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create, manage, and promote your events. Run secure voting contests and award ceremonies.
        </p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" variant="secondary">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <Calendar className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Event Management</h3>
            <p className="text-gray-600 mb-4">
              Create and manage events with ease. Sell tickets and track attendance.
            </p>
            <Link to="/events" className="text-purple-600 hover:text-purple-700 font-medium">
              Learn more →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <Award className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Voting System</h3>
            <p className="text-gray-600 mb-4">
              Run secure and transparent voting contests. Real-time results tracking.
            </p>
            <Link to="/voting" className="text-purple-600 hover:text-purple-700 font-medium">
              Learn more →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <Crown className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Award Ceremonies</h3>
            <p className="text-gray-600 mb-4">
              Organize and manage award ceremonies. Handle nominations and voting.
            </p>
            <Link to="/awards" className="text-purple-600 hover:text-purple-700 font-medium">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-600">1M+</div>
              <div className="text-gray-600">Event Tickets Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">Voting Contests</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">100+</div>
              <div className="text-gray-600">Award Ceremonies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">50K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;