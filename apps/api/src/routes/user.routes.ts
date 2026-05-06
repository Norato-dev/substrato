import { Router } from 'express';
import { listUsers, updateRole, updateProfile, myComments } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), listUsers);
router.put('/profile', authenticate, updateProfile);
router.get('/comments', authenticate, myComments);
router.put('/:id/role', authenticate, authorize('ADMIN'), updateRole);

export default router;