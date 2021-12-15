import { Router } from '@phoenix35/express-async-methods';

import { login, register } from './controllers.js';
import { validateJWT } from './middleware.js';

const router = Router();

router.postAsync('/login', login);

router.postAsync('/register', register);

router.getAsync('/verify', validateJWT, (req, res) => {
  res.json({ verified: true });
});

export default router;