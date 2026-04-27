import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, parseInt(req.query.limit as string) || 9);
  const skip = (page - 1) * limit;
  const isAdmin = req.query.all === 'true';

  const where = isAdmin ? {} : { published: true };

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        coverUrl: true, published: true, createdAt: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  res.json({ success: true, data: { total, page, limit, data: posts } });
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const post = await prisma.post.findUnique({
    where: { slug: req.params.slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || (!post.published)) {
    res.status(404).json({ success: false, error: 'Post not found' });
    return;
  }
  res.json({ success: true, data: post });
});

router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  [
    body('title').trim().notEmpty(),
    body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/),
    body('content').trim().notEmpty(),
    body('published').optional().isBoolean(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, slug, content, excerpt, coverUrl, published } = req.body;
    const post = await prisma.post.create({
      data: {
        title, slug, content,
        excerpt: excerpt ?? null,
        coverUrl: coverUrl ?? null,
        published: published ?? false,
        authorId: req.user!.userId,
      },
    });
    res.status(201).json({ success: true, data: post });
  }
);

router.put(
  '/:slug',
  authenticate,
  requireRole(Role.ADMIN),
  [
    body('title').optional().trim().notEmpty(),
    body('content').optional().trim().notEmpty(),
    body('published').optional().isBoolean(),
  ],
  validate,
  async (req: Request, res: Response): Promise<void> => {
    const { title, content, excerpt, coverUrl, published } = req.body;
    const post = await prisma.post.update({
      where: { slug: req.params.slug },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(published !== undefined && { published }),
      },
    });
    res.json({ success: true, data: post });
  }
);

router.delete(
  '/:slug',
  authenticate,
  requireRole(Role.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.post.delete({ where: { slug: req.params.slug } });
    res.json({ success: true, data: null });
  }
);

export default router;
