'use client';

import { AppProvider } from '../store';
import { ToastProvider } from '../contexts/ToastContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </ToastProvider>
    );
}
