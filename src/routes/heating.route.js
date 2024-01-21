import { Router } from 'express';
import { heating } from '../controllers/heating.controller.js';

const router = Router();

router.get('/', heating);

export default router;
