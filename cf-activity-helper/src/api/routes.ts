import { Router } from 'express';
import accountRoutes from './account.routes';
import activityRoutes from './activity.routes';
import recordRoutes from './record.routes';
import engineRoutes from './engine.routes';

const router = Router();

router.use('/accounts', accountRoutes);
router.use('/activities', activityRoutes);
router.use('/records', recordRoutes);
router.use('/engine', engineRoutes);

export default router;