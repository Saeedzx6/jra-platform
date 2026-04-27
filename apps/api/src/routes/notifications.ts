import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ success: true, data: notifications });
});

router.patch('/:id/read', async (req: Request, res: Response): Promise<void> => {
  const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
  if (!notification || notification.userId !== req.user!.userId) {
    res.status(404).json({ success: false, error: 'Notification not found' });
    return;
  }
  const updated = await prisma.notification.update({
    where: { id: req.params.id },
    data: { read: true },
  });
  res.json({ success: true, data: updated });
});

router.patch('/read-all', async (req: Request, res: Response): Promise<void> => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.userId, read: false },
    data: { read: true },
  });
  res.json({ success: true, data: null });
});

export default router;
