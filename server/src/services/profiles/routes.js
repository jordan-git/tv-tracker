import { Router } from '@phoenix35/express-async-methods';
import { getProfiles, getProfile, createProfile, updateProfile, deleteProfile } from './controllers.js';
import { createRequiredFieldsMiddleWare } from '../../middleware.js';

const router = Router();

router.getAsync('/', getProfiles);

router.getAsync('/:id', getProfile);

router.postAsync('/', createRequiredFieldsMiddleWare(['user_id']), createProfile);

router.putAsync('/:id', updateProfile);

router.deleteAsync('/:id', deleteProfile);

export default router;
