import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../lib/auth';
import { PaymentService, PaymentProvider } from '../../../../services/paymentService';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const { planId, paymentMethod } = await req.json();
    
    if (!planId) {
        return NextResponse.json({ error: 'Missing planId' }, { status: 400 });
    }

    // Default to CREEM if not provided
    const provider = (paymentMethod || 'CREEM') as PaymentProvider;

    const result = await PaymentService.createPayment({
      userId,
      provider,
      planId,
    });

    return NextResponse.json({ 
      success: true, 
      paymentUrl: result.paymentUrl,
      qrCode: result.qrCode,
      message: 'Payment initiated' 
    });

  } catch (error) {
    console.error('Recharge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
