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

  const [total, trainings] = await Promise.all([
    prisma.training.count(),
    prisma.training.findMany({ skip, take: limit, orderBy: { date: 'asc' } }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: trainings } });
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const training = await prisma.training.findUnique({ where: { slug: req.params.slug } });
  if (!training) {
    res.status(404).json({ success: false, error: 'Training not found' });
    return;
  }
  res.json({ success: true, data: training });
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
    body('price').isFloat({ min: 0 }),
    body('seats').isInt({ min: 1 }),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, slug, description, date, price, seats, imageUrl } = req.body;
    const training = await prisma.training.create({
      data: {
        title, slug, description,
        date: new Date(date),
        price: parseFloat(price),
        seats: parseInt(seats),
        imageUrl,
        createdBy: req.user!.userId,
      },
    });
    res.status(201).json({ success: true, data: training });
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
    body('price').optional().isFloat({ min: 0 }),
    body('seats').optional().isInt({ min: 1 }),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, description, date, price, seats, imageUrl } = req.body;
    const training = await prisma.training.update({
      where: { slug: req.params.slug },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(seats !== undefined && { seats: parseInt(seats) }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });
    res.json({ success: true, data: training });
  }
);

router.delete(
  '/:slug',
  authenticate,
  requireRole(Role.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.training.delete({ where: { slug: req.params.slug } });
    res.json({ success: true, data: null });
  }
);

router.post(
  '/:id/register',
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const training = await prisma.training.findUnique({ where: { id: req.params.id } });
    if (!training) {
      res.status(404).json({ success: false, error: 'Training not found' });
      return;
    }

    const existing = await prisma.registration.findUnique({
      where: { userId_trainingId: { userId: req.user!.userId, trainingId: training.id } },
    });
    if (existing) {
      res.status(409).json({ success: false, error: 'Already registered for this training' });
      return;
    }

    const count = await prisma.registration.count({
      where: { trainingId: training.id, status: 'CONFIRMED' },
    });
    if (count >= training.seats) {
      res.status(400).json({ success: false, error: 'Training is fully booked' });
      return;
    }

    const registration = await prisma.registration.create({
      data: { userId: req.user!.userId, trainingId: training.id },
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        message: `You have registered for training: "${training.title}"`,
      },
    });

    res.status(201).json({ success: true, data: registration });
  }
);

export default router;
