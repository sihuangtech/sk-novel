import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
        coins: true,
        isSubscribedToEmail: true,
        bookmarks: {
            select: { novelId: true }
        },
        unlockedChapters: {
            select: { chapterId: true }
        }
      }
    });

    if (!user) {
        return NextResponse.json({ user: null }, { status: 404 });
    }
    
    // Transform to match frontend User interface expectation
    const formattedUser = {
        ...user,
        bookmarks: user.bookmarks.map(b => b.novelId),
        unlockedChapters: user.unlockedChapters.map(c => c.chapterId)
    };

    return NextResponse.json({ user: formattedUser });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isSubscribedToEmail, username } = body;

    // Filter allowed fields
    const updates: any = {};
    if (typeof isSubscribedToEmail === 'boolean') updates.isSubscribedToEmail = isSubscribedToEmail;
    // if (username) updates.username = username; // Allow username update? Maybe separate check for uniqueness.

    if (Object.keys(updates).length === 0) {
       return NextResponse.json({ success: true, message: 'No valid updates provided' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updates,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        tier: true,
        coins: true,
        isSubscribedToEmail: true,
        bookmarks: { select: { novelId: true } },
        unlockedChapters: { select: { chapterId: true } }
      }
    });
    
    const formattedUser = {
        ...updatedUser,
        bookmarks: updatedUser.bookmarks.map(b => b.novelId),
        unlockedChapters: updatedUser.unlockedChapters.map(c => c.chapterId)
    };

    return NextResponse.json({ user: formattedUser });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
