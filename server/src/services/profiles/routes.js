import { Router } from '@phoenix35/express-async-methods';
import { getProfiles, createProfile } from './controllers.js';
import { createRequiredFieldsMiddleWare } from '../../middleware.js';

const router = Router();

router.get('/', getProfiles);

router.post('/', createRequiredFieldsMiddleWare(['user_id']), createProfile);

export default router;