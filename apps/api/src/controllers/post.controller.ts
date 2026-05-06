import { Response } from 'express';
import { z } from 'zod';
import slugify from 'slugify';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

const postSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.any(),
  coverImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  categoryId: z.string(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  readTime: z.number().optional(),
  featured: z.boolean().optional(),
});

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const data = postSchema.parse(req.body);
    const slug = slugify(data.title, { lower: true, strict: true });

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status ?? 'DRAFT',
        categoryId: data.categoryId,
        authorId: req.user!.id,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        readTime: data.readTime,
        featured: data.featured ?? false,
        tags: data.tags ? {
          create: data.tags.map(tagId => ({ tag: { connect: { id: tagId } } }))
        } : undefined,
      },
      include: { author: { select: { id: true, name: true, username: true } }, category: true, tags: { include: { tag: true } } },
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { status, categoryId, featured, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (featured) where.featured = featured === 'true';

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, username: true, avatar: true } },
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true, reactions: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({ posts, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, username: true, avatar: true, bio: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            replies: { include: { author: { select: { id: true, name: true, avatar: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { reactions: true } },
      },
    });

    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

    res.json(post);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const data = postSchema.partial().parse(req.body);
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN' && req.user!.role !== 'EDITOR') {
      return res.status(403).json({ error: 'Sin permisos' });
    }

    const updated = await prisma.post.update({
      where: { id: req.params.id },
      data: {
        ...data,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
        tags: data.tags ? {
          deleteMany: {},
          create: data.tags.map(tagId => ({ tag: { connect: { id: tagId } } }))
        } : undefined,
      },
      include: { author: { select: { id: true, name: true, username: true } }, category: true, tags: { include: { tag: true } } },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    if (post.authorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sin permisos' });
    }
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post eliminado' });
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};