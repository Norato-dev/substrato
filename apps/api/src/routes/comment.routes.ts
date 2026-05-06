import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);

export default router;