async function fetchApi (url, method = 'GET', { headers = {}, body = null } = {}) {
  const options = {
    credentials: 'include',
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (data.error) {
    throw data.error;
  }

  return data;
}

export { fetchApi };