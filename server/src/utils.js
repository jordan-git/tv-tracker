import dotenv from 'dotenv-safe';
import fetch from 'node-fetch';
import jsonwebtoken from 'jsonwebtoken';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const logsFolderPath = path.join(__dirname, '../logs');

// TODO: Use error throwing to handle JSON errors
export async function sendRequest (endpoint, method, payload = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  };

  if (payload && method !== 'GET') {
    options.body = JSON.stringify(payload);
  }

  const url = `http://localhost:${process.env.SERVER_PORT}/api${endpoint}${method === 'GET' && payload ? `?${new URLSearchParams(payload)}` : ''}`;

  return fetch(url, options);
}

export async function sendJsonRequest (endpoint, method, payload = null, headers = {}) {
  const response = await sendRequest(endpoint, method, payload, headers);

  return response.json();
}

export const signToken = util.promisify(jsonwebtoken.sign);
export const verifyToken = util.promisify(jsonwebtoken.verify);
export const decodeToken = jsonwebtoken.decode;
