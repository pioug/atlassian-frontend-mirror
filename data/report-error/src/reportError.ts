import type { ErrorInfo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

export type ErrorPayload = { error: Error; errorInfo: ErrorInfo; interactionId?: string };

const buffer: ErrorPayload[] = [];

let push = (payload: ErrorPayload) => {
	buffer.push(payload);
};

export function reportError(payload: ErrorPayload) {
	push(payload);
}

export function installErrorHandler(handler: (payload: ErrorPayload) => void) {
	if (fg('moving_jira_entry-points_api_under_platform')) {
		push = handler;
		buffer.forEach((payload) => handler(payload));
		buffer.length = 0;
	}
}
