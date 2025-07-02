import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, CheckCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import ServiceCard from '../components/customer/ServiceCard';
import useServiceStore from '../store/serviceStore';

const HomePage: React.FC = () => {
  const { services, fetchServices, isLoading } = useServiceStore();
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const featuredServices = services.slice(0, 6);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Event background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the Perfect Event Service Providers
            </h1>
            <p className="text-xl mb-8">
              Connect with trusted professionals for your special occasions.
              From catering to photography, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/services">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
              <Link to="/vendor/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-700">
                  Become a Vendor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
            EventsMadeEaze makes it easy to find and book the perfect service providers for your events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Browse through our extensive list of verified service providers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-gray-600">
                Request a booking with your chosen vendor for your event date.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy</h3>
              <p className="text-gray-600">
                Relax and enjoy your event with professional service providers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular event services from trusted professionals.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from satisfied customers who found the perfect service providers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Wedding</p>
                </div>
              </div>
              <p className="text-gray-600">
                "We found an amazing caterer for our wedding through EventsMadeEaze. The food was incredible and the service was impeccable. Highly recommend!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">Corporate Event</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The event planner we hired through this platform made our company anniversary celebration stress-free and memorable. Everything was perfect!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">P</span>
                </div>
                <div>
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-gray-500 text-sm">Birthday Party</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The decorator we found created the most beautiful setup for my daughter's sweet sixteen. The booking process was simple and the communication was great."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Event?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found the perfect service providers for their special occasions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/services">
              <Button variant="outline" size='lg' className="w-full sm:w-auto bg-white text-blue-600 hover:bg-white-100 hover:text-white-600">
                Find Services
              </Button>
            </Link>
            <Link to="/vendor/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                Become a Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;