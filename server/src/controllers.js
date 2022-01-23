import dotenv from 'dotenv-safe';
import { sendJsonRequest, signToken, decodeToken } from './utils.js';

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

  // TODO: Write cleaner (try/catch json request helper)
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

  res.cookie('refresh-token', loginData.refresh, { httpOnly: false, secure: false });

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

  // TODO: Fix cookie properties https://github.com/jordan-git/tv-tracker/commit/4ea1307adbf5f32d3446258261b6e3b1fdeee70a#diff-4fbbf3f0c9b4ab9ae8628c10d748a746e7f3303a7d3c1c5fb6da13ca1a5fdd16L82
  res.cookie('refresh-token', refresh, { httpOnly: false, secure: false });

  res.json({ jwt });
}

export async function refresh (req, res) {
  const userRefresh = req.cookies['refresh-token'];

  if (!userRefresh) {
    res.status(403).json({ error: 'No refresh token' });
    return;
  }

  const jwt = req.headers.authorization.split(' ')[1];
  const { payload: { id }} = decodeToken(jwt, { complete: true });

  const { token: savedRefresh } = await sendJsonRequest(`/users/${id}/token`, 'GET');

  if (savedRefresh !== userRefresh) {
    res.status(403).json({ error: 'Invalid refresh token' });
    return;
  }

  const { refresh } = await sendJsonRequest(`/users/${id}/token`, 'POST');

  res.cookie('refresh-token', refresh, { httpOnly: false, secure: false });

  const newJwt = await signToken({ id }, process.env.JWT_SECRET, { expiresIn: '5s' });

  res.json({ jwt: newJwt });
}

export async function profile(req, res) {
  const { id } = req.user;

  const profile = await sendJsonRequest(`/users/${id}/profile`, 'GET');

  if (profile.error) {
    res.status(404).json({ error: profile.error });
    return;
  }

  res.json({ profile });
}