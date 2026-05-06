import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const data = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: { ...data, authorId: req.user!.id },
      include: { author: { select: { id: true, name: true, username: true, avatar: true } } },
    });
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id as string } });
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
    if (comment.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sin permisos' });
    }
    await prisma.comment.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Comentario eliminado' });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};