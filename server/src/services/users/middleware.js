import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import knex from './database.js'

const verifyToken = util.promisify(jsonwebtoken.verify);

export async function verifyJWT(req, res, next) {
  const [, token] = req.headers.authorization.split(' ');
  try {
    const { id } = await verifyToken(token, process.env.JWT_SECRET);

    await knex('users').select("*").where({ id }).first();

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