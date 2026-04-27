import { Router, Request, Response } from 'express';
import { body, query } from 'express-validator';
import { MemberCategory, MemberStatus, Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: MemberStatus.ACTIVE };
  if (req.query.category) where.category = req.query.category as MemberCategory;
  if (req.query.location) where.location = { contains: req.query.location as string, mode: 'insensitive' };
  if (req.query.stars) where.stars = parseInt(req.query.stars as string);
  if (req.query.search) {
    where.OR = [
      { businessName: { contains: req.query.search as string, mode: 'insensitive' } },
      { location: { contains: req.query.search as string, mode: 'insensitive' } },
    ];
  }

  const [total, members] = await Promise.all([
    prisma.memberProfile.count({ where }),
    prisma.memberProfile.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ stars: 'desc' }, { businessName: 'asc' }],
    }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: members } });
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const member = await prisma.memberProfile.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!member) {
    res.status(404).json({ success: false, error: 'Member not found' });
    return;
  }
  res.json({ success: true, data: member });
});

router.put(
  '/:id',
  authenticate,
  [
    body('businessName').optional().trim().notEmpty(),
    body('bio').optional().trim(),
    body('phone').optional().trim(),
    body('website').optional().trim().isURL(),
    body('location').optional().trim().notEmpty(),
    body('stars').optional().isInt({ min: 1, max: 5 }),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const member = await prisma.memberProfile.findUnique({ where: { id: req.params.id } });
    if (!member) {
      res.status(404).json({ success: false, error: 'Member not found' });
      return;
    }

    // MEMBER can only edit their own profile; ADMIN can edit any
    if (req.user!.role !== Role.ADMIN && member.userId !== req.user!.userId) {
      res.status(403).json({ success: false, error: 'Forbidden' });
      return;
    }

    const { businessName, bio, phone, website, location } = req.body;
    const updated = await prisma.memberProfile.update({
      where: { id: req.params.id },
      data: { businessName, bio, phone, website, location },
    });
    res.json({ success: true, data: updated });
  }
);

router.delete(
  '/:id',
  authenticate,
  requireRole(Role.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.memberProfile.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  }
);

export default router;
