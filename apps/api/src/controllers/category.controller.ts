import { Request, Response } from 'express';
import { z } from 'zod';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';

const categorySchema = z.object({
  name: z.string().min(2),
  color: z.string().optional(),
});

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({
      data: { name: data.name, slug: slugify(data.name, { lower: true }), color: data.color },
    });
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.partial().parse(req.body);
    const update: any = { ...data };
    if (data.name) update.slug = slugify(data.name, { lower: true });
    const category = await prisma.category.update({
      where: { id: req.params.id as string },
      data: update,
    });
    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const postCount = await prisma.post.count({ where: { categoryId: req.params.id as string } });
    if (postCount > 0) {
      return res.status(400).json({ error: `No se puede eliminar: tiene ${postCount} artículo(s)` });
    }
    await prisma.category.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Categoría eliminada' });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};