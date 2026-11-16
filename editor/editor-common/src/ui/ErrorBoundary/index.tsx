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
	fallbackComponent?: React.ReactNode | ((error: Error) => React.ReactNode);
}

interface ErrorBoundaryState {
	error: Error | null;
}
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { error: null };

	hasFallback(): boolean {
		return typeof this.props.fallbackComponent !== 'undefined';
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
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
			this.setState({ error });
		}
	}

	render(): React.ReactNode {
		const { error } = this.state;
		if (error) {
			const { fallbackComponent } = this.props;
			return typeof fallbackComponent === 'function'
				? fallbackComponent(error)
				: (fallbackComponent ?? null);
		}
		return this.props.children;
	}
}
