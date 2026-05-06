import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] },
    });
    if (exists) return res.status(409).json({ error: 'Email o username ya existe' });

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
      select: { id: true, email: true, username: true, name: true, role: true },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    res.status(500).json({ error: 'Error interno' });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, name: true, bio: true, avatar: true, role: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Error interno' });
  }
};