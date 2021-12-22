import { Router } from '@phoenix35/express-async-methods';
import { register, login } from './controllers.js';
import { createRequiredFieldsMiddleWare, verifyJWT } from './middleware.js';

const router = Router();

router.postAsync('/register', createRequiredFieldsMiddleWare(['username', 'email', 'password']), register);

router.postAsync('/login', createRequiredFieldsMiddleWare(['email', 'password']), login);

router.getAsync('/verify', verifyJWT, (req, res) => {
  res.json({ verified: true });
});

export default router;