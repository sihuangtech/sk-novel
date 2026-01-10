'use client';

import React from 'react';
import { PublicLayout } from '../../../components/Layout';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase. Your account has been updated with your new membership or coins.
          </p>
          <Link 
            href="/"
            className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
