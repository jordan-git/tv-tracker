import dotenv from 'dotenv-safe';
import { sendJsonRequest, signToken } from './utils.js';

dotenv.config();

// TODO: Move register/login controllers to user service & handle with sendJsonRequest helper function
export async function register (req, res) {
  const { username, email, password, gender, birthday } = req.body;

  // Create user
  const userData = await sendJsonRequest('/users', 'POST', { username, email, password });

  if (userData.error) {
    let status;
    switch (userData.error) {
      case 'Email already in use':
      case 'Username already in use':
        status = 409;
        break;
      default:
        status = 400;
    }
    res.status(status).json({ error: userData.error });
    return;
  }

  // Create profile
  const profileData = await sendJsonRequest('/profiles', 'POST', { gender, birthday, user_id: userData.id });

  if (profileData.error) {
    let status;
    switch (profileData.error) {
      case 'User already has a profile':
        status = 409;
        break;
      default:
        status = 400;
    }
    res.status(status).json({ error: profileData.error });
    return;
  }

  // Get JWT token
  const loginData = await sendJsonRequest('/users/login', 'POST', { email, password });

  if (loginData.error) {
    let status;
    switch (loginData.error) {
      case 'Invalid email/password combination':
        status = 401;
        break;
      default:
        status = 400;
    }
    res.status(status).json({ error: loginData.error });
    return;
  }

  res.cookie('refresh-token', loginData.refresh, { httpOnly: true, sameSite: 'strict', secure: false });

  res.json({ jwt: loginData.jwt });
}

export async function login (req, res) {
  const { email, password } = req.body;

  const { jwt, refresh, error } = await sendJsonRequest('/users/login', 'POST', { email, password });

  if (error) {
    let status;
    switch (error) {
      case 'Invalid email/password combination':
        status = 401;
        break;
      default:
        status = 400;
    }
    res.status(status).json({ error });
    return;
  }

  res.cookie('refresh-token', refresh, { httpOnly: true, sameSite: 'strict', secure: false });

  res.json({ jwt });
}

export async function auth (req, res) {
  const refreshToken = req.cookies['refresh-token'];

  if (!refreshToken) {
    res.status(404).json({ error: 'No refresh token' });
    return;
  }

  const response = await sendJsonRequest(`/users/${req.user.id}/token`, 'GET');

  res.cookie('refresh-token', response.refresh, { httpOnly: true, sameSite: 'strict', secure: false });

  const jwt = await signToken({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '3m' });

  res.json({ jwt });
}
