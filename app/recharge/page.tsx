'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { PublicLayout } from '../../components/Layout';
import { Coins, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { PaymentModal, PaymentMethod } from '../../components/PaymentModal';

interface RechargePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  coinsAmount: number;
  bonusCoins: number;
}

export default function RechargePage() {
  const { currentUser, updateUser } = useStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [plans, setPlans] = useState<RechargePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{amount: number, price: number} | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/pricing-plans?type=RECHARGE');
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans);
        }
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleRechargeClick = (plan: RechargePlan) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setSelectedPlanId(plan.id);
    setSelectedPlanDetails({ amount: plan.coinsAmount + plan.bonusCoins, price: plan.price });
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = async (method: PaymentMethod) => {
    if (!selectedPlanId) return;

    setLoadingPackage(selectedPlanId);
    setShowPaymentModal(false);

    try {
      const res = await fetch('/api/user/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: selectedPlanId,
          paymentMethod: method
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.paymentUrl) {
           window.location.href = data.paymentUrl;
        } else if (data.qrCode) {
             // For WeChat, redirect to a QR display page
             window.location.href = `/payment/wechat?qr=${encodeURIComponent(data.qrCode)}&id=${selectedPlanId}`; 
        } else {
           updateUser(data.user);
           showToast(`Successfully purchased coins!`, 'success');
        }
      } else {
        showToast(data.error || 'Recharge failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoadingPackage(null);
      setSelectedPlanId(null);
    }
  };

  return (
    <PublicLayout>
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={handlePaymentSelect}
        loading={loadingPackage !== null}
        amount={selectedPlanDetails ? selectedPlanDetails.price.toString() : '0'}
        title={selectedPlanDetails ? `Buy ${selectedPlanDetails.amount} Coins` : 'Buy Coins'}
      />

      <div className="py-24 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Get Coins
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Purchase coins to unlock premium chapters and support your favorite authors.
          </p>
          {currentUser && (
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-gray-900">{currentUser.coins} Coins Balance</span>
            </div>
          )}
        </div>

        {loadingPlans ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((pkg) => (
                <div 
                key={pkg.id}
                className={`relative bg-white p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group
                    ${loadingPackage === pkg.id ? 'border-brand-200 bg-brand-50' : 'border-transparent hover:border-brand-200'}
                `}
                onClick={() => handleRechargeClick(pkg)}
                >
                {pkg.bonusCoins > 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    +{pkg.bonusCoins} Bonus
                    </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-8 w-8 text-brand-600" />
                    </div>
                    
                    <div className="text-3xl font-serif font-black text-gray-900 mb-2">
                    {pkg.coinsAmount}
                    <span className="text-sm font-sans font-bold text-gray-400 ml-1">Coins</span>
                    </div>
                    
                    <div className="text-xl font-bold text-gray-400 group-hover:text-brand-600 transition-colors mb-6">
                    ${pkg.price}
                    </div>
                    
                    <button 
                    disabled={loadingPackage === pkg.id}
                    className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl group-hover:bg-brand-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                    {loadingPackage === pkg.id ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                        </>
                    ) : (
                        'Purchase Now'
                    )}
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400">
            Secure payment processing via Stripe, Alipay, and WeChat Pay. <br/>
            Coins are added to your account immediately after payment confirmation.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
