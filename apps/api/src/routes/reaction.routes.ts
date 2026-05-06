import { Router } from 'express';
import { toggleReaction, getReactionStatus } from '../controllers/reaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/toggle', authenticate, toggleReaction);
router.get('/post/:postId', authenticate, getReactionStatus);

export default router;