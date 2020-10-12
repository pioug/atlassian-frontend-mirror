import { AuthErrorType } from './types';

export class AuthError extends Error {
  public constructor(
    public readonly message: string,
    public readonly type?: AuthErrorType,
  ) {
    super(message);
    this.name = 'AuthError';
    this.type = type;
    this.message = message;
  }
}
