import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role, MemberCategory } from '@prisma/client';
import prisma from '../lib/prisma';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

function signAccessToken(userId: string, role: Role): string {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
}

function signRefreshToken(userId: string, role: Role): string {
  return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
}

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .matches(/[A-Z]/)
      .matches(/[0-9]/)
      .withMessage('Password must be 8+ chars with uppercase and number'),
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    body('category').isIn(Object.values(MemberCategory)).withMessage('Invalid category'),
    body('location').trim().notEmpty().withMessage('Location is required'),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, businessName, category, location, phone, website, bio } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.MEMBER,
        profile: {
          create: {
            businessName,
            category: category as MemberCategory,
            location,
            phone: phone ?? null,
            website: website ?? null,
            bio: bio ?? null,
          },
        },
      },
      include: { profile: true },
    });

    res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshTokenValue = signRefreshToken(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  }
);

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ success: false, error: 'No refresh token' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string; role: Role };
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      res.status(401).json({ success: false, error: 'Refresh token expired or revoked' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    const accessToken = signAccessToken(user.id, user.role);
    res.json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, profile: user.profile },
      },
    });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, data: null });
});

export default router;
