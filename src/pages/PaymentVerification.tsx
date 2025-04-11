import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePayment } from '@/contexts/PaymentContext';
import { Loader2 } from 'lucide-react';

export default function PaymentVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, isProcessing, error } = usePayment();
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const verifyTransaction = async () => {
      const reference = searchParams.get('reference') || searchParams.get('tx_hash');
      const paymentMethod = searchParams.get('method') as 'paystack' | 'crypto';

      if (!reference || !paymentMethod) {
        navigate('/dashboard');
        return;
      }

      try {
        const success = await verifyPayment(reference, paymentMethod);
        setVerificationComplete(true);
        
        setTimeout(() => {
          navigate(success ? '/dashboard/tickets' : '/dashboard/events');
        }, 3000);
      } catch (error) {
        setVerificationComplete(true);
      }
    };

    verifyTransaction();
  }, [searchParams, verifyPayment, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {isProcessing && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      )}

      {!isProcessing && verificationComplete && !error && (
        <div className="text-center">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Redirecting you to your tickets...</p>
        </div>
      )}

      {!isProcessing && error && (
        <div className="text-center">
          <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Payment Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting you back to events...</p>
        </div>
      )}
    </div>
  );
}