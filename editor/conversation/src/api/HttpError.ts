export class HttpError extends Error {
  status: number;
  canRetry: boolean;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;

    switch (status) {
      case 400:
      case 403:
      case 404:
        this.canRetry = false;
        break;
      default:
        this.canRetry = true;
        break;
    }
  }
}
