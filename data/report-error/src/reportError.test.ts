import type { ErrorInfo } from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type ErrorPayload, installErrorHandler, reportError } from './reportError';

describe('Error Handling Module', () => {
	let mockHandler: jest.Mock;

	beforeEach(() => {
		mockHandler = jest.fn();
	});

	ffTest.on(
		'moving_jira_entry-points_api_under_platform',
		'when moving_jira_entry-points_api_under_platform is on',
		() => {
			test('should use the new handler immediately after installation', () => {
				const error1: Error = new Error('Buffered error');
				const errorInfo1: ErrorInfo = { componentStack: 'Stack trace info 1' };
				const payload1: ErrorPayload = { error: error1, errorInfo: errorInfo1 };
				const error2: Error = new Error('Immediate error');
				const errorInfo2: ErrorInfo = { componentStack: 'Stack trace info 2' };
				const payload2: ErrorPayload = { error: error2, errorInfo: errorInfo2 };

				// Report an error before the handler is installed
				reportError(payload1);
				// Install the error handler
				installErrorHandler(mockHandler);
				// Ensure the buffered error was processed
				expect(mockHandler).toHaveBeenCalledWith(payload1);

				// Report a new error after the handler is installed
				reportError(payload2);
				// Ensure the new error is immediately processed by the handler
				expect(mockHandler).toHaveBeenCalledWith(payload2);

				expect(mockHandler).toHaveBeenCalledTimes(2);
			});
		},
	);
});
