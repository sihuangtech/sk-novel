import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, hashPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { UserRole } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    let user;

    // 1. Check if it's the Admin from ENV
    if (email === process.env.ADMIN_EMAIL) {
        if (password === process.env.ADMIN_PASSWORD) {
            // Admin authenticated via ENV credentials
            // Upsert Admin user in DB to ensure ID exists for relations
            const hashedPassword = await hashPassword(password);
            user = await prisma.user.upsert({
                where: { email: process.env.ADMIN_EMAIL },
                update: {
                    role: 'AUTHOR', // Admin gets AUTHOR role (or we could add ADMIN role if needed)
                    // We don't necessarily update password here if we want to keep DB password separately, 
                    // but for consistency let's update it or leave it. 
                    // To strictly follow "config in ENV", we rely on ENV password check.
                },
                create: {
                    email: process.env.ADMIN_EMAIL!,
                    username: 'Admin',
                    password: hashedPassword, // Store hashed version even if we check ENV
                    role: 'AUTHOR',
                    tier: 'SUPPORTER'
                }
            });
        } else {
             return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } else {
        // 2. Regular user login
        user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    }

    // Generate token
    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    // Set cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tier: user.tier,
        coins: user.coins
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
