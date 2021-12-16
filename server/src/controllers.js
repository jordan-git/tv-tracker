import { response } from 'express';
import fetch from 'node-fetch';

async function sendRequest(endpoint, method, payload) {
  const response = await fetch(`http://localhost:${process.env.SERVER_PORT}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function register(req, res) {
  const { username, email, password, gender, birthday } = req.body;

  // Create user
  const userResponse = await sendRequest('/api/users', 'POST', { username, email, password });

  if (userResponse.error) {
    res.json({ error: userResponse.error });
    return;
  }

  // Create profile
  const profileResponse = await sendRequest('/api/profiles', 'POST', { gender, birthday, user_id: userResponse.id });

  if (profileResponse.error) {
    res.json({ error: profileResponse.error });
    return;
  }

  // Get JWT token
  const loginResponse = await sendRequest('/api/users/login', 'POST', { email, password });

  if (loginResponse.error) {
    res.json({ error: loginResponse.error });
    return;
  }

  res.json({ token: loginResponse.token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const response = await sendRequest('/api/users/login', 'POST', { email, password });

  res.json(response);
}