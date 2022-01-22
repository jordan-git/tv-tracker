import { Router } from '@phoenix35/express-async-methods';
import { register, login, refresh } from './controllers.js';
import { createRequiredFieldsMiddleWare, verifyJWT } from './middleware.js';

const router = Router();

router.postAsync('/register', createRequiredFieldsMiddleWare(['username', 'email', 'password']), register);

router.postAsync('/login', createRequiredFieldsMiddleWare(['email', 'password']), login);

// TODO Consider refreshing automatically in /auth
router.getAsync('/auth', verifyJWT, (req, res) => {
  res.json({ user: req.user });
});

router.getAsync('/refresh', refresh);

export default router;
