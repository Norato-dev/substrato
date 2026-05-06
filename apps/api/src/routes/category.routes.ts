import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createCategory);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN', 'EDITOR'), deleteCategory);

export default router;