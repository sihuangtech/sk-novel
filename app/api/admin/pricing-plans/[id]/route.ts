import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { PaymentType, MembershipTier } from '@prisma/client';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    const plan = await prisma.pricingPlan.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        currency,
        type: type ? type as PaymentType : undefined,
        tier: tier ? tier as MembershipTier : null, // explicit null if user wants to remove it? Or just undefined to keep? Let's assume replace if provided.
        coinsAmount: coinsAmount !== undefined ? parseInt(coinsAmount) : undefined,
        bonusCoins: bonusCoins !== undefined ? parseInt(bonusCoins) : undefined,
        creemProductId,
        isActive,
      },
    });

    return NextResponse.json({ plan });

  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

    await prisma.pricingPlan.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
