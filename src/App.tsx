import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NotificationsPage from './pages/NotificationsPage';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VendorProfileSetupPage from './pages/vendor/VendorProfileSetupPage';
import CustomerProfileSetupPage from './pages/customer/CustomerProfileSetupPage';
import VendorDashboardPage from './pages/vendor/VendorDashboardPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import ServicesPage from './pages/services/ServicesPage';
import ServiceCategoryPage from './pages/services/ServiceCategoryPage';
import VendorDetailPage from './pages/vendors/VendorDetailPage';
import BookingConfirmationPage from './pages/bookings/BookingConfirmationPage';
import BookingChatPage from './pages/bookings/BookingChatPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';

// Stores
import useServiceStore from './store/serviceStore';
import useVendorStore from './store/vendorStore';

function App() {
  const { fetchServices } = useServiceStore();
  const { fetchVendors } = useVendorStore();
  
  useEffect(() => {
    // Preload data
    fetchServices();
    fetchVendors();
  }, [fetchServices, fetchVendors]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/vendor/register" element={<RegisterPage />} />
            <Route path="/vendor/profile/setup" element={<VendorProfileSetupPage />} />
            <Route path="/customer/profile/setup" element={<CustomerProfileSetupPage />} />
            <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<ServiceCategoryPage />} />
            <Route path="/vendors/:id" element={<VendorDetailPage />} />
            <Route path="/bookings/:id/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/bookings/:id/chat" element={<BookingChatPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;