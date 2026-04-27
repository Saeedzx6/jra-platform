import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { MemberStatus, Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate, requireRole(Role.ADMIN));

router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  const [members, events, trainings, posts, pending] = await Promise.all([
    prisma.memberProfile.count({ where: { status: MemberStatus.ACTIVE } }),
    prisma.event.count(),
    prisma.training.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.memberProfile.count({ where: { status: MemberStatus.PENDING } }),
  ]);
  res.json({ success: true, data: { members, events, trainings, posts, pending } });
});

router.get('/members', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;
  const status = req.query.status as MemberStatus | undefined;

  const where = status ? { status } : {};

  const [total, members] = await Promise.all([
    prisma.memberProfile.count({ where }),
    prisma.memberProfile.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: members } });
});

router.patch(
  '/members/:id/status',
  [body('status').isIn(Object.values(MemberStatus)).withMessage('Invalid status')],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const member = await prisma.memberProfile.update({
      where: { id: req.params.id },
      data: { status: status as MemberStatus },
      include: { user: true },
    });

    await prisma.notification.create({
      data: {
        userId: member.userId,
        message:
          status === MemberStatus.ACTIVE
            ? 'Your membership application has been approved. Welcome to JRA!'
            : `Your membership status has been updated to: ${status}`,
      },
    });

    res.json({ success: true, data: member });
  }
);

router.get('/registrations', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
  const skip = (page - 1) * limit;

  const [total, registrations] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.findMany({
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
        training: { select: { title: true } },
      },
      orderBy: { registeredAt: 'desc' },
    }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: registrations } });
});

export default router;
