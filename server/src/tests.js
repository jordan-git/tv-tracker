import dotenv from 'dotenv-safe';

import { sendRequest } from './util';

dotenv.config();

// TODO: Add delete functionality for cleanup

let token;
const endpoints = {
  login: '/login',
  register: '/register',
  verify: '/verify',
}
const dummyData = {
  username: Math.random().toString(36).slice(2),
  email: Math.random().toString(36).slice(2),
  password: Math.random().toString(36).slice(2),
}

describe('Main Service', () => {
  test('Can handle register', async () => {
    const data = await sendRequest(endpoints.register, 'POST', dummyData);

    expect(data).toHaveProperty('token');
    token = data.token;
  });

  test('Can handle login', async () => {
    const { email, password } = dummyData;

    const data = await sendRequest(endpoints.login, 'POST', { email, password });

    expect(data).toHaveProperty('token');
  });

  test('Can verify JWT', async () => {
    const data = await sendRequest(endpoints.verify, 'GET', null, { Authorization: `Bearer ${token}` });

    expect(data).toHaveProperty('verified') && expect(data.verified).toBe(true);
  });
});