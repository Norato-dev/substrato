import { Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().optional(),
  password: z.string().min(8).optional(),
});

const updateRoleSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR', 'READER']),
});

export const listUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true, name: true, role: true, bio: true, avatar: true, createdAt: true, _count: { select: { posts: true, comments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = updateRoleSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { role },
      select: { id: true, email: true, username: true, name: true, role: true },
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const update: any = { ...data };
    if (data.password) update.password = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: update,
      select: { id: true, email: true, username: true, name: true, bio: true, avatar: true, role: true },
    });
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const myComments = async (req: AuthRequest, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: req.user!.id },
      include: { post: { select: { id: true, title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};