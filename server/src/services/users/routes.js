import { Router } from '@phoenix35/express-async-methods';

import { verifyCredentials, createUser, getUsers, getUser } from './controllers.js';
import { verifyJWT, createRequiredFieldsMiddleWare } from '../../middleware.js';

const router = Router();

router.getAsync('/', getUsers);

router.getAsync('/:id', getUser);

router.postAsync('/', createRequiredFieldsMiddleWare(['username', 'email', 'password']), createUser);

router.postAsync('/login', createRequiredFieldsMiddleWare(['email', 'password']), verifyCredentials);

export default router;