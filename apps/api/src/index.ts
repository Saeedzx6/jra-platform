import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import { logger } from './lib/logger';

import authRoutes from './routes/auth';
import membersRoutes from './routes/members';
import eventsRoutes from './routes/events';
import trainingsRoutes from './routes/trainings';
import postsRoutes from './routes/posts';
import adminRoutes from './routes/admin';
import boardRoutes from './routes/board';
import notificationsRoutes from './routes/notifications';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { message: err.message });
  res.status(500).json({ success: false, error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`JRA API running on port ${PORT}`);
});

export default app;
