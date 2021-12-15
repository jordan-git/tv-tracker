import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import knex from './database.js'

const validateToken = util.promisify(jsonwebtoken.verify);

export async function validateJWT(req, res, next) {
  const [, token] = req.headers.authorization.split(' ');
  try {
    const { id } = await validateToken(token, process.env.JWT_SECRET);

    const user = await knex('users').select("*").where({ id }).first();

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    console.log(user);

    next();
  } catch (err) {
    switch (err.message) {
      case 'jwt expired':
        res.status(401).json({ error: 'Token expired' });
        break;
      case 'jwt malformed':
      case 'invalid signature':
        res.status(401).json({ error: 'Invalid token' });
        break;
      default:
        res.status(500).json({ error: 'Internal server error' });
        console.error(`Uncaught JWT error: ${err}`);
    }
  }
}