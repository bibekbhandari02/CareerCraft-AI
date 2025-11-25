import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import api from '../lib/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const oid = searchParams.get('oid');
      const amt = searchParams.get('amt');
      const refId = searchParams.get('refId');

      const { data } = await api.get(`/payment/verify?oid=${oid}&amt=${amt}&refId=${refId}`);
      
      if (data.success) {
        setVerified(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {verifying ? (
          <>
            <Loader className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </>
        ) : verified ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your subscription has been activated</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">Unable to verify your payment</p>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
