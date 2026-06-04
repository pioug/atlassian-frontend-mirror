import type { ErrorReportingHandler } from '@atlaskit/editor-common/error-reporter';
import { ErrorReporter } from '@atlaskit/editor-common/error-reporter';

export function createErrorReporter(errorReporterHandler?: ErrorReportingHandler): ErrorReporter {
	const errorReporter = new ErrorReporter();
	if (errorReporterHandler) {
		errorReporter.handler = errorReporterHandler;
	}
	return errorReporter;
}
