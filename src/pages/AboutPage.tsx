import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About EventsMadeEaze</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in creating memorable events and connecting you with the best service providers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              At EventsMadeEaze, we're dedicated to simplifying the event planning process by connecting customers 
              with trusted, professional service providers. Our platform makes it easy to find, compare, and book 
              the perfect vendors for any occasion.
            </p>
            <p className="text-gray-600">
              We believe that every event, big or small, deserves exceptional service and attention to detail. 
              Our mission is to make professional event services accessible to everyone while supporting local 
              businesses and entrepreneurs.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Event planning meeting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Why Choose EventsMadeEaze?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Verified Vendors</h3>
              <p className="text-gray-600">
                All our service providers are thoroughly vetted to ensure quality and reliability.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Time-Saving</h3>
              <p className="text-gray-600">
                Find and book the right services quickly with our streamlined platform.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Connect directly with vendors to discuss your specific needs and requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ready to Start Planning?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found the perfect service providers for their events.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/services" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Services
            </a>
            <a 
              href="/contact" 
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;