import { Router } from 'express';
import { createCategory, getCategories } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createCategory);

export default router;