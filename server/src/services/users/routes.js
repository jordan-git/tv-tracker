import { Router } from '@phoenix35/express-async-methods';

import { login, createUser, getUsers, getUser, updateUser, deleteUser, getRefreshToken, createRefreshToken, deleteRefreshToken } from './controllers.js';
import { createRequiredFieldsMiddleWare } from '../../middleware.js';

const router = Router();

router.getAsync('/', getUsers);

router.getAsync('/:id', getUser);

router.postAsync('/', createRequiredFieldsMiddleWare(['username', 'email', 'password']), createUser);

router.postAsync('/login', createRequiredFieldsMiddleWare(['email', 'password']), login);

router.putAsync('/:id', updateUser);

router.deleteAsync('/:id', deleteUser);

router.getAsync('/:id/token', getRefreshToken);

router.postAsync('/:id/token', createRefreshToken);

router.deleteAsync('/:id/token', deleteRefreshToken);

export default router;
