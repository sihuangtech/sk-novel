'use client';

import React from 'react';
import UserManagement from '../../../views/admin/UserManagement';
import { AdminLayout } from '../../../components/Layout';

export default function UsersPage() {
    return (
        <AdminLayout>
            <UserManagement />
        </AdminLayout>
    );
}
