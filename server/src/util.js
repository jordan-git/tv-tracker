import dotenv from 'dotenv-safe';
import fetch from 'node-fetch';

dotenv.config();

export async function sendRequest(endpoint, method, payload = null, headers = {}) {
  const options = {
    method,
    headers,
  };

  options.headers['Content-Type'] = 'application/json';

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`http://localhost:${process.env.SERVER_PORT}/api${endpoint}`, options);

  return response.json();
}