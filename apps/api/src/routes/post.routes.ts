import { Router } from 'express';
import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/post.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;