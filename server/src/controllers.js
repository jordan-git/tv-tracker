import { sendRequest } from './util.js';

// TODO: Move register/login controllers to user service & handle with sendRequest helper function
export async function register(req, res) {
  const { username, email, password, gender, birthday } = req.body;

  // Create user
  const userData = await sendRequest('/users', 'POST', { username, email, password });

  if (userData.error) {
    res.json({ error: userData.error });
    return;
  }

  // Create profile
  const profileData = await sendRequest('/profiles', 'POST', { gender, birthday, user_id: userData.id });

  if (profileData.error) {
    res.json({ error: profileData.error });
    return;
  }

  // Get JWT token
  const loginData = await sendRequest('/users/login', 'POST', { email, password });

  if (loginData.error) {
    res.json({ error: loginData.error });
    return;
  }

  res.json({ token: loginData.token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const response = await sendRequest('/users/login', 'POST', { email, password });

  res.json(response);
}