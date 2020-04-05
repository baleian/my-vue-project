import { Router } from 'express';

import * as User from '../../controllers/user';


const router = Router();

router.get('/', User.getUserList);
router.get('/:id', User.getUserProfile);
router.put('/:id', User.setUser);

export default router;
