import fetch from 'node-fetch';
import dotenv from 'dotenv-safe';

dotenv.config();

// TODO: add delete functionality for cleanup

let token;
const baseUrl = `http://localhost:${process.env.SERVER_PORT}`;
const endpoints = {
  login: '/api/login',
  register: '/api/register',
  verify: '/api/verify',
}
const dummyData = {
  username: Math.random().toString(36).slice(2),
  email: Math.random().toString(36).slice(2),
  password: Math.random().toString(36).slice(2),
}

describe('User service', () => {
  test('Can handle register', async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dummyData)
    }

    const response = await fetch(`${baseUrl}${endpoints.register}`, options);

    const data = await response.json();

    expect(data).toHaveProperty('token');
    token = data.token;
  });

  test('Can handle login', async () => {
    const { email, password } = dummyData;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    }

    const response = await fetch(`${baseUrl}${endpoints.login}`, options);

    const data = await response.json();

    expect(data).toHaveProperty('token');
  });

  test('Can verify JWT', async () => {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }

    const response = await fetch(`${baseUrl}${endpoints.verify}`, options);

    const data = await response.json();

    expect(data).toHaveProperty('verified') && expect(data.verified).toBe(true);
  });
});