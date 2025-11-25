// eSewa Payment Configuration

const isProduction = process.env.NODE_ENV === 'production';

export const ESEWA_CONFIG = {
  // Merchant credentials
  merchantId: process.env.ESEWA_MERCHANT_ID || 'EPAYTEST',
  secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
  
  // URLs
  successUrl: process.env.ESEWA_SUCCESS_URL || 'http://localhost:5173/payment/success',
  failureUrl: process.env.ESEWA_FAILURE_URL || 'http://localhost:5173/payment/failure',
  
  // Payment Gateway URLs (using production URL for both - EPAYTEST works on production)
  paymentUrl: 'https://esewa.com.np/epay/main',
  
  // Verification URLs
  verifyUrl: 'https://esewa.com.np/epay/transrec',
  
  // Environment
  environment: isProduction ? 'production' : 'test'
};

// Plan pricing in NPR
export const PLANS = {
  starter: {
    amount: 600, // NPR 600 (~$5)
    credits: { resumeGenerations: 20, portfolios: 3 },
    name: 'Starter Plan'
  },
  pro: {
    amount: 1800, // NPR 1800 (~$15)
    credits: { resumeGenerations: 999, portfolios: 10 },
    name: 'Pro Plan'
  }
};

// Test credentials info
export const TEST_INFO = {
  merchantId: 'EPAYTEST',
  testAmount: 100,
  note: 'Use these credentials for testing. Get production credentials from https://merchant.esewa.com.np/'
};
