/**
 * Represents a error occurring when trying to parse JQL into a Jast.
 */
export class JQLParseError extends Error {
  /**
   * The original JS error that was thrown trying to parse JQL.
   */
  cause?: Error;

  /**
   * The error message. We use a separate property here so consumers can perform shallow comparison of error objects.
   */
  description: string;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'JQLParseError';
    this.cause = cause;
    this.description = message;
  }
}
