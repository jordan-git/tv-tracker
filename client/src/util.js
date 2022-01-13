export async function fetchApi(url, method = 'GET', body) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
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