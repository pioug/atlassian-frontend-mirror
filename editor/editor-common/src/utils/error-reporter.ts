export type ErrorReporterTags = { [key: string]: string };

export interface ErrorReportingHandler {
  captureMessage: (msg: string, tags?: ErrorReporterTags) => void;
  captureException: (err: Error, tags?: ErrorReporterTags) => void;
}

export default class ErrorReporter {
  private handlerStorage: ErrorReportingHandler | null = null;

  captureMessage(msg: string, tags?: ErrorReporterTags) {
    if (this.handlerStorage) {
      this.handlerStorage.captureMessage(msg, tags);
    }
  }

  captureException(err: Error, tags?: ErrorReporterTags) {
    if (this.handlerStorage) {
      this.handlerStorage.captureException(err, tags);
    }
  }

  set handler(handler: ErrorReportingHandler | null) {
    this.handlerStorage = handler;
  }
}
