import React from 'react';

import type { DispatchAnalyticsEvent, ErrorEventPayload } from '../../analytics';
import { ACTION, EVENT_TYPE } from '../../analytics';
import { logException } from '../../monitoring/error';

type ErrorCrashPayload = Extract<ErrorEventPayload, { action: ACTION.EDITOR_CRASHED }>;

interface ErrorBoundaryProps {
	children?: React.ReactNode;
	component: ErrorCrashPayload['actionSubject'];
	componentId?: ErrorCrashPayload['actionSubjectId'];
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	fallbackComponent?: React.ReactNode;
}

interface ErrorBoundaryState {
	errorCaptured: boolean;
}
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = { errorCaptured: false };

	hasFallback() {
		return typeof this.props.fallbackComponent !== 'undefined';
	}

	shouldRecover() {
		return this.hasFallback() && this.state.errorCaptured;
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (this.props.dispatchAnalyticsEvent) {
			this.props.dispatchAnalyticsEvent({
				action: ACTION.EDITOR_CRASHED,
				actionSubject: this.props.component,
				actionSubjectId: this.props.componentId,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					error,
					errorInfo,
					errorRethrown: !this.hasFallback(),
				},
			});
		}
		logException(error, { location: 'editor-common' });

		if (this.hasFallback()) {
			this.setState({ errorCaptured: true });
		}
	}

	render() {
		if (this.shouldRecover()) {
			return this.props.fallbackComponent;
		}
		return this.props.children;
	}
}
