import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: chapterId } = await params;

    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Check if already unlocked
    const existingUnlock = await prisma.unlockedChapter.findUnique({
      where: {
        userId_chapterId: {
          userId: payload.userId,
          chapterId: chapterId,
        },
      },
    });

    if (existingUnlock) {
      return NextResponse.json({ success: true, message: 'Already unlocked' });
    }

    // Check user balance
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.coins < chapter.price) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 403 });
    }

    // Perform transaction
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: payload.userId },
        data: { coins: { decrement: chapter.price } },
      }),
      prisma.unlockedChapter.create({
        data: {
          userId: payload.userId,
          chapterId: chapterId,
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      coins: updatedUser.coins 
    });

  } catch (error) {
    console.error('Unlock chapter error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
