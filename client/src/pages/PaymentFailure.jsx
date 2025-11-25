import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/pricing')}
            className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
