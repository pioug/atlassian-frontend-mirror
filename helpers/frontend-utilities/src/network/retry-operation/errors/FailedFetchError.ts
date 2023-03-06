export interface FailedFetchErrorProps {
  error: Error;
  method: string;
  path: string;
}

export default class FailedFetchError extends Error {
  method: string;
  originalName: string;
  path: string;
  stack?: string;

  constructor({ error, path, method }: FailedFetchErrorProps) {
    super();
    this.name = 'FailedFetchError';
    this.message = error.message || 'Unknown fetch error';
    this.stack = error.stack;
    this.originalName = error.name;
    this.method = method;
    const p = path.split('?')[0];
    this.path = /^[/-a-z]+$/i.test(p) ? p : '';
  }
}
