import { Router } from 'express';
import { upload } from '../lib/cloudinary';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

const router = Router();

router.post('/image', authenticate, upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const file = req.file as any;
    const media = await prisma.media.create({
      data: {
        url: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
    res.json({ url: media.url, id: media.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Error al subir' });
  }
});

export default router;