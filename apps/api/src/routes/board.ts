import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const board = await prisma.boardMember.findMany({ orderBy: { order: 'asc' } });
  res.json({ success: true, data: board });
});

router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  [body('name').trim().notEmpty(), body('title').trim().notEmpty()],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { name, title, photoUrl, order } = req.body;
    const member = await prisma.boardMember.create({
      data: { name, title, photoUrl: photoUrl ?? null, order: order ?? 0 },
    });
    res.status(201).json({ success: true, data: member });
  }
);

router.put(
  '/:id',
  authenticate,
  requireRole(Role.ADMIN),
  [
    body('name').optional().trim().notEmpty(),
    body('title').optional().trim().notEmpty(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { name, title, photoUrl, order } = req.body;
    const member = await prisma.boardMember.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(title && { title }),
        ...(photoUrl !== undefined && { photoUrl }),
        ...(order !== undefined && { order }),
      },
    });
    res.json({ success: true, data: member });
  }
);

router.delete(
  '/:id',
  authenticate,
  requireRole(Role.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.boardMember.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  }
);

export default router;
