'use client';

import React from 'react';
import Home from '../views/public/Home';
import { PublicLayout } from '../components/Layout';

export default function Page() {
    return (
        <PublicLayout>
            <Home />
        </PublicLayout>
    );
}
