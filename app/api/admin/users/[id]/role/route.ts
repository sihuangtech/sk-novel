import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Define types locally to avoid editor resolution issues with Prisma Client exports
type UserRole = 'READER' | 'AUTHOR';
type MembershipTier = 'FREE' | 'MEMBER' | 'SUPPORTER';

const VALID_ROLES: UserRole[] = ['READER', 'AUTHOR'];
const VALID_TIERS: MembershipTier[] = ['FREE', 'MEMBER', 'SUPPORTER'];

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    // Only AUTHOR (which is Admin in this context) can promote users
    if (!payload || payload.role !== 'AUTHOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role, tier } = await request.json();
    const updates: any = {};

    if (role && VALID_ROLES.includes(role)) {
        updates.role = role as UserRole;
    }

    if (tier && VALID_TIERS.includes(tier)) {
        updates.tier = tier as MembershipTier;
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updates
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        tier: updatedUser.tier
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
