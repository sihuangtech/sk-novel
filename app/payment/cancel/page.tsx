'use client';

import React from 'react';
import { PublicLayout } from '../../../components/Layout';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-8">
            You have not been charged. If you experienced any issues, please try again or contact support.
          </p>
          <Link 
            href="/pricing"
            className="block w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
