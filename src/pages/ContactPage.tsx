import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      alert('Thank you for your message. We will get back to you soon!');
    } catch (error) {
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We're here to help and answer any questions you might have.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Your name"
                fullWidth
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="your.email@example.com"
                fullWidth
              />
              
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
                placeholder="What is this regarding?"
                fullWidth
              />
              
              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Your message here..."
                rows={4}
                fullWidth
              />
              
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
              >
                <Send size={16} className="mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-blue-600 w-5 h-5 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">123 Event Street, Suite 100<br />New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-blue-600 w-5 h-5 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+91 7396983993</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-blue-600 w-5 h-5 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">eventsmadeeaze@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        {/* <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Our Location</h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg"> */}
            {/* Here you would typically integrate with a map service like Google Maps */}
            {/* <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Map integration will be added here
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ContactPage;