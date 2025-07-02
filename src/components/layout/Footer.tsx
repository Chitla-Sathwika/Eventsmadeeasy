import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EventsMadeEaze</h3>
            <p className="text-gray-300 text-sm mb-4">
              Connecting customers with the best event service providers in your area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/services/catering" className="hover:text-white">Catering</Link></li>
              <li><Link to="/services/event-planning" className="hover:text-white">Event Planning</Link></li>
              <li><Link to="/services/decoration" className="hover:text-white">Decoration</Link></li>
              <li><Link to="/services/photography" className="hover:text-white">Photography</Link></li>
              <li><Link to="/services" className="hover:text-white">View All Services</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/vendor/register" className="hover:text-white">Become a Vendor</Link></li>
              {/* <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Event Street, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <span>+91 7396983993</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <span>eventsmadeeaze@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EventsMadeEaze. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-gray-400">
              {/* <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li> */}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;