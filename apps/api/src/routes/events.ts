import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const [total, events] = await Promise.all([
    prisma.event.count(),
    prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { date: 'asc' },
    }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: events } });
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const event = await prisma.event.findUnique({ where: { slug: req.params.slug } });
  if (!event) {
    res.status(404).json({ success: false, error: 'Event not found' });
    return;
  }
  res.json({ success: true, data: event });
});

router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  [
    body('title').trim().notEmpty(),
    body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/),
    body('description').trim().notEmpty(),
    body('date').isISO8601(),
    body('location').trim().notEmpty(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, slug, description, date, location, imageUrl } = req.body;
    const event = await prisma.event.create({
      data: { title, slug, description, date: new Date(date), location, imageUrl, createdBy: req.user!.userId },
    });
    res.status(201).json({ success: true, data: event });
  }
);

router.put(
  '/:slug',
  authenticate,
  requireRole(Role.ADMIN),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('location').optional().trim().notEmpty(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, description, date, location, imageUrl } = req.body;
    const event = await prisma.event.update({
      where: { slug: req.params.slug },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
    res.json({ success: true, data: event });
  }
);

router.delete(
  '/:slug',
  authenticate,
  requireRole(Role.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.event.delete({ where: { slug: req.params.slug } });
    res.json({ success: true, data: null });
  }
);

router.post(
  '/:id/register',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) {
      res.status(404).json({ success: false, error: 'Event not found' });
      return;
    }

    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: req.user!.userId, eventId: event.id } },
    });
    if (existing) {
      res.status(409).json({ success: false, error: 'Already registered for this event' });
      return;
    }

    const registration = await prisma.registration.create({
      data: { userId: req.user!.userId, eventId: event.id },
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        message: `You have been registered for "${event.title}"`,
      },
    });

    res.status(201).json({ success: true, data: registration });
  }
);

export default router;
