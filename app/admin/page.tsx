'use client';

import React from 'react';
import Dashboard from '../../views/admin/Dashboard';
import { AdminLayout } from '../../components/Layout';

export default function AdminPage() {
    return (
        <AdminLayout>
            <Dashboard />
        </AdminLayout>
    );
}
