'use client';

import React, { useState } from 'react';
import { Loader2, X, CreditCard, Smartphone } from 'lucide-react';
// import { Dialog } from '@headlessui/react'; // Not using headless ui to avoid dependency


export type PaymentMethod = 'CREEM' | 'WECHAT' | 'ALIPAY';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
  loading: boolean;
  amount: number | string;
  title: string;
}

export function PaymentModal({ isOpen, onClose, onSelect, loading, amount, title }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 mb-6">Total to pay: <span className="font-bold text-gray-900">${amount}</span></p>

          <div className="space-y-3">
            <button
              onClick={() => onSelect('CREEM')}
              disabled={loading}
              className="w-full p-4 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition flex items-center gap-4 group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-900">International Card</div>
                <div className="text-xs text-gray-500">Powered by Creem</div>
              </div>
            </button>

            <button
              onClick={() => onSelect('WECHAT')}
              disabled={loading}
              className="w-full p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition flex items-center gap-4 group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-900">WeChat Pay</div>
                <div className="text-xs text-gray-500">微信支付</div>
              </div>
            </button>

            <button
              onClick={() => onSelect('ALIPAY')}
              disabled={loading}
              className="w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition flex items-center gap-4 group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Alipay</div>
                <div className="text-xs text-gray-500">支付宝</div>
              </div>
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
