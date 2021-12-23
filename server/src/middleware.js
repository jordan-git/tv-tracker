import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import knex from './connection.js'
import { verifyToken } from './utils.js';

export async function verifyJWT(req, res, next) {
  try {
    const { jwt } = req.body;

    const decoded = await verifyToken(jwt, process.env.JWT_SECRET);

    req.user = decoded;

    const user = await knex('users').select("*").where({ id: decoded.id }).first();

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    next();
  } catch (err) {
    switch (err.message) {
      case 'jwt expired':
        res.status(401).json({ error: 'Token expired' });
        break;
      case 'token is not defined':
        res.status(400).json({ error: 'Token missing' });
        break;
      case 'jwt malformed':
      case 'invalid signature':
      default:
        console.error(err.message)
        res.status(401).json({ error: 'Invalid token' });
        break;
    }
  }
}

export function createRequiredFieldsMiddleWare(fields) {
  return (req, res, next) => {
    const missingFields = fields.reduce(((acc, field) =>
      !Object.prototype.hasOwnProperty.call(req.body, field) ? [...acc, field] : acc
    ), []);

    if (missingFields.length) {
      res.status(400).json({
        error: `Missing field${missingFields.length === 1 ? '' : 's'}`,
        fields: missingFields
      });
      return;
    }

    next();
  }
}