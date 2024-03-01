export class ResponseError extends Error {
  constructor(message: string) {
    super(message);
  }
}
