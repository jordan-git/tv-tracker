import dotenv from 'dotenv-safe';

import { sendJsonRequest, sendRequest } from './utils.js';

dotenv.config();

// TODO: Add delete functionality for cleanup
// TODO: Fix test that relies on cookie

let jwt;
const endpoints = {
  login: '/login',
  register: '/register',
  refresh: '/auth'
};
const dummyData = {
  username: Math.random().toString(36).slice(2),
  email: Math.random().toString(36).slice(2),
  password: Math.random().toString(36).slice(2)
};

describe('Main Service', () => {
  test('Can handle register', async () => {
    const response = await sendRequest(endpoints.register, 'POST', dummyData);
    const data = await response.json();

    console.log(response);

    expect(data).toHaveProperty('jwt') && expect(response.cookies);
    jwt = data.jwt;
  });

  test('Can handle login', async () => {
    const { email, password } = dummyData;

    const data = await sendJsonRequest(endpoints.login, 'POST', { email, password });

    expect(data).toHaveProperty('jwt');
  });

  test('Can refresh token', async () => {
    const data = await sendJsonRequest(endpoints.refresh, 'POST', { jwt });

    expect(data).toHaveProperty('verified') && expect(data.verified).toBe(true);
  });
});
