export const FETCH_ERROR_NAME = 'FetchError';

export type ErrorWithStatus = Error & {
  status: number;
};

export function enrichFetchError(
  error: Error,
  status: number,
): ErrorWithStatus {
  return {
    name: FETCH_ERROR_NAME,
    message: error.message,
    stack: error.stack,
    status,
  };
}

export const fetchJson = <T>(url: string, init?: RequestInit): Promise<T> =>
  fetch(url, { credentials: 'include', ...init }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw enrichFetchError(
      new Error(
        `Unable to fetch ${url} ${response.status} ${response.statusText}`,
      ),
      response.status,
    );
  });

export const postJson = <T>(url: string, data: any) =>
  fetchJson<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
