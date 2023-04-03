export class NotConnectedError extends Error {
  name = 'NotConnectedError';
  constructor(message: string) {
    super(message);
  }
}

export class NotInitializedError extends Error {
  name = 'NotInitializedError';

  constructor(message: string) {
    super(message);
  }
}
