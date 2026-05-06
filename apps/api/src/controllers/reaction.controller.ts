import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const reactionSchema = z.object({
  postId: z.string(),
  type: z.string().default('like'),
});

export const toggleReaction = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, type } = reactionSchema.parse(req.body);
    const userId = req.user!.id;

    const existing = await prisma.reaction.findUnique({
      where: { userId_postId_type: { userId, postId, type } },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      const count = await prisma.reaction.count({ where: { postId, type } });
      return res.json({ active: false, count });
    }

    await prisma.reaction.create({ data: { userId, postId, type } });
    const count = await prisma.reaction.count({ where: { postId, type } });
    res.json({ active: true, count });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const getReactionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId as string;
    const type = (req.query.type as string) || 'like';

    const [existing, count] = await Promise.all([
      prisma.reaction.findUnique({ where: { userId_postId_type: { userId, postId, type } } }),
      prisma.reaction.count({ where: { postId, type } }),
    ]);

    res.json({ active: !!existing, count });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};