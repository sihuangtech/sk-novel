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

    const { id: novelId } = await params;

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_novelId: {
          userId: payload.userId,
          novelId: novelId,
        },
      },
    });

    let isBookmarked = false;

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_novelId: {
            userId: payload.userId,
            novelId: novelId,
          },
        },
      });
      isBookmarked = false;
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: payload.userId,
          novelId: novelId,
        },
      });
      isBookmarked = true;
    }

    return NextResponse.json({ success: true, isBookmarked });

  } catch (error) {
    console.error('Bookmark error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
