const ALLOWED_RESPONSE_STATUS_CODES = [200, 401, 404];

export async function request<T>(
  method: string,
  url: string,
  data?: any,
): Promise<T> {
  const requestConfig = {
    method,
    credentials: 'include' as RequestCredentials,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const response = await fetch(url, requestConfig);
  if (response.ok || ALLOWED_RESPONSE_STATUS_CODES.includes(response.status)) {
    return await response.json();
  }

  throw response;
}
