'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2 } from 'lucide-react';

function WeChatPayContent() {
  const searchParams = useSearchParams();
  const qrCodeUrl = searchParams.get('qr');
  const paymentId = searchParams.get('id');

  useEffect(() => {
    // In a real implementation, we would poll the server to check payment status
    // and redirect when completed.
    if (!paymentId) return;

    const pollInterval = setInterval(async () => {
        try {
            // We need a status check endpoint. 
            // Currently we don't have a public endpoint to check status without auth?
            // Actually usually frontend polls an endpoint.
            // Let's assume we implement a simple check endpoint or just wait for user to click "I have paid"
            // For now, we'll just leave it as display.
        } catch (e) {
            console.error(e);
        }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [paymentId]);

  if (!qrCodeUrl) {
    return <div className="p-20 text-center">Invalid Request</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">WeChat Pay</h1>
        <p className="text-gray-500 mb-8">Scan the QR code with WeChat to pay</p>
        
        <div className="bg-white p-4 border-2 border-brand-100 rounded-xl inline-block mb-8">
            <QRCodeSVG value={decodeURIComponent(qrCodeUrl)} size={200} />
        </div>

        <div className="flex flex-col gap-3">
            <button 
                onClick={() => window.location.href = '/payment/success'}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
            >
                I have paid
            </button>
            <button 
                onClick={() => window.history.back()}
                className="w-full py-3 text-gray-400 hover:text-gray-600 font-bold"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
}

export default function WeChatPayPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
        }>
            <WeChatPayContent />
        </Suspense>
    );
}
