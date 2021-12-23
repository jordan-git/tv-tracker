import dotenv from 'dotenv-safe';
import fetch from 'node-fetch';
import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const logsFolderPath = path.join(__dirname, '../logs');

export async function sendRequest(endpoint, method, payload = null, headers = {}) {
  const options = {
    method,
    headers,
  };

  options.headers['Content-Type'] = 'application/json';

  if (payload && method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  const url = `http://localhost:${process.env.SERVER_PORT}/api${endpoint}${method === 'GET' && payload ? `?${new URLSearchParams(payload)}` : ''}`;

  const response = await fetch(url, options);

  return response.json();
}

export const signToken = util.promisify(jsonwebtoken.sign);
export const verifyToken = util.promisify(jsonwebtoken.verify);