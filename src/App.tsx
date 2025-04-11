import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const Voting = React.lazy(() => import('./pages/Voting'));
const Awards = React.lazy(() => import('./pages/Awards'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const PaymentVerification = React.lazy(() => import('./pages/PaymentVerification'));
const AttendanceAnalytics = React.lazy(() => import('./pages/Dashboard/AttendanceAnalytics'));

function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <PaymentProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <ErrorBoundary>
                  <Navbar />
                </ErrorBoundary>
                
                <main className="container mx-auto px-4 py-8">
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/voting" element={<Voting />} />
                        <Route path="/awards" element={<Awards />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard/*" element={<Dashboard />} />
                        <Route path="/dashboard/analytics/:eventId" element={<AttendanceAnalytics />} />
                        <Route path="/payment/verify" element={<PaymentVerification />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>

                <ErrorBoundary>
                  <Footer />
                </ErrorBoundary>

                <Toaster />
              </div>
            </Router>
          </PaymentProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;