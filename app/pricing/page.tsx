'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { PublicLayout } from '../../components/Layout';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { PaymentModal, PaymentMethod } from '../../components/PaymentModal';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  tier: string;
  description: string;
}

const tierFeatures = {
  FREE: ['Access to public chapters', 'Basic reading settings', 'Bookmark novels'],
  MEMBER: ['All Free features', 'Access to Member-only chapters', 'Ad-free experience', 'Priority support'],
  SUPPORTER: ['All Member features', 'Access to Supporter-only chapters', 'Early access to new novels', 'Exclusive author notes', 'Badge on profile'],
};

export default function PricingPage() {
  const { currentUser, updateUser } = useStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{name: string, price: number} | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/pricing-plans?type=UPGRADE');
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

  const handleUpgradeClick = (plan: PricingPlan) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    // Free tier logic (usually not an "upgrade" via payment, but if plan price is 0)
    if (plan.price === 0) {
      showToast('You are already on the Free plan.', 'info');
      return;
    }

    setSelectedPlanId(plan.id);
    setSelectedPlanDetails({ name: plan.name, price: plan.price });
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = async (method: PaymentMethod) => {
    if (!selectedPlanId) return;

    setLoadingTier(selectedPlanId);
    setShowPaymentModal(false);

    try {
      const res = await fetch('/api/user/upgrade', {
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
           window.location.href = `/payment/wechat?qr=${encodeURIComponent(data.qrCode)}&id=${selectedPlanId}`; 
        } else {
          if (data.user) updateUser(data.user);
          showToast(data.message || `Successfully upgraded!`, 'success');
        }
      } else {
        showToast(data.error || 'Upgrade failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoadingTier(null);
      setSelectedPlanId(null);
    }
  };

  // Merge default Free tier if not present in DB (usually Free is not a paid plan)
  // But we want to display it.
  const displayPlans = [
    { id: 'free', name: 'Free', price: 0, tier: 'FREE', description: 'Basic Access' },
    ...plans
  ];

  return (
    <PublicLayout>
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={handlePaymentSelect}
        loading={loadingTier !== null}
        amount={selectedPlanDetails ? selectedPlanDetails.price.toString() : '0'}
        title={selectedPlanDetails ? `Upgrade to ${selectedPlanDetails.name}` : 'Upgrade'}
      />

      <div className="py-24 px-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Membership Plans
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose the perfect plan for your reading habits. Upgrade anytime.
          </p>
        </div>

        {loadingPlans ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPlans.map((tier) => {
                const features = tierFeatures[tier.tier as keyof typeof tierFeatures] || [];
                const isCurrentTier = currentUser?.tier === tier.tier;
                
                return (
                <div 
                    key={tier.id}
                    className={`bg-white p-8 rounded-3xl border-2 flex flex-col
                    ${isCurrentTier ? 'border-brand-600 shadow-xl' : 'border-transparent hover:border-gray-200 hover:shadow-lg'}
                    transition-all duration-300
                    `}
                >
                    <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-wider">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-serif font-black text-gray-900">${tier.price}</span>
                        <span className="text-gray-500 font-bold">/month</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{tier.description}</p>
                    </div>

                    <div className="flex-1 space-y-4 mb-8">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 rounded-full p-1">
                            <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{feature}</span>
                        </div>
                    ))}
                    </div>

                    <button 
                    onClick={() => handleUpgradeClick(tier)}
                    disabled={isCurrentTier || loadingTier === tier.id || tier.price === 0}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${isCurrentTier 
                        ? 'bg-brand-50 text-brand-600 cursor-default'
                        : tier.price === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-gray-900 text-white hover:bg-brand-600 shadow-lg hover:shadow-brand-500/25'
                        }
                    `}
                    >
                    {loadingTier === tier.id ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                        </>
                    ) : isCurrentTier ? (
                        'Current Plan'
                    ) : tier.price === 0 ? (
                        'Default Plan'
                    ) : (
                        'Upgrade Now'
                    )}
                    </button>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </PublicLayout>
  );
}
