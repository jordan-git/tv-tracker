import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import knex from './connection.js'

const validateToken = util.promisify(jsonwebtoken.verify);

export async function verifyJWT(req, res, next) {
  const [, token] = req.headers.authorization.split(' ');
  try {
    const { id } = await validateToken(token, process.env.JWT_SECRET);

    const user = await knex('users').select("*").where({ id }).first();

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