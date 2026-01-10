import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PaymentType, MembershipTier } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const plans = await prisma.pricingPlan.findMany({
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({ plans });

  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, currency, type, tier, coinsAmount, bonusCoins, creemProductId, isActive } = body;

    if (!name || price === undefined || !type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        currency: currency || 'USD',
        type: type as PaymentType,
        tier: tier ? tier as MembershipTier : null,
        coinsAmount: coinsAmount ? parseInt(coinsAmount) : null,
        bonusCoins: bonusCoins ? parseInt(bonusCoins) : 0,
        creemProductId,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ plan });

  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
