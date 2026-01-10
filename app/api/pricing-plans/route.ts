import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentType } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const where: any = {
      isActive: true,
    };

    if (type) {
      where.type = type as PaymentType;
    }

    const plans = await prisma.pricingPlan.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ plans });

  } catch (error) {
    console.error('Get public plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
