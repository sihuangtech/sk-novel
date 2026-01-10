'use client';

import React from 'react';
import PricingManagement from '../../../views/admin/PricingManagement';
import { AdminLayout } from '../../../components/Layout';

export default function PricingPage() {
    return (
        <AdminLayout>
            <PricingManagement />
        </AdminLayout>
    );
}
