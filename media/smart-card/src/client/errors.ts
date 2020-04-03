export type FetchErrorKind = 'fatal' | 'auth' | 'fallback';
export class FetchError extends Error {
  public readonly kind: FetchErrorKind;
  constructor(kind: FetchErrorKind, message: string) {
    super(`${kind}: ${message}`);
    this.kind = kind;
    this.name = 'FetchError';
  }
}
