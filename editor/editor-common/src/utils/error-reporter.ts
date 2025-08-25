export type ErrorReporterTags = { [key: string]: string };

export interface ErrorReportingHandler {
	captureException: (err: Error, tags?: ErrorReporterTags) => void;
	captureMessage: (msg: string, tags?: ErrorReporterTags) => void;
}

export class ErrorReporter {
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
