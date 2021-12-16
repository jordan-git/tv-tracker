import { Router } from '@phoenix35/express-async-methods';
import { register, login } from './controllers.js';
import { createRequiredFieldsMiddleWare } from './middleware.js';

const router = Router();

router.post('/register', createRequiredFieldsMiddleWare(['username', 'email', 'password']), register);

router.post('/login', createRequiredFieldsMiddleWare(['email', 'password']), login);

export default router;