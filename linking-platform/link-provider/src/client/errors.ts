import { ErrorType } from './types/responses';

export type APIErrorKind = 'fatal' | 'auth' | 'error' | 'fallback';

export class APIError extends Error {
  public constructor(
    public readonly kind: APIErrorKind,
    public readonly hostname: string,
    public readonly message: string,
    public readonly type?: ErrorType,
  ) {
    super(`${kind}: ${message}`);
    this.name = 'APIError';
    // The error type received from the server.
    this.type = type;
    // The kind mapped to on the client.
    this.kind = kind;
    // The message received from the server.
    this.message = message;
    // The hostname of the URL which failed - do NOT log this (contains PII/UGC).
    this.hostname = hostname;
  }
}
