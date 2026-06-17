import React from 'react';

import { ACTION, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ComponentCaughtDomErrorAEP, ComponentCrashErrorAEP } from '../../analytics/events';
import { PLATFORM } from '../../analytics/events';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const FAILED_TO_EXECUTE_REGEX = /Failed to execute.*on 'Node'.*/;

interface ErrorBoundaryProps {
	additionalInfo?: string;
	children: React.ReactNode;
	component: ComponentCrashErrorAEP['actionSubject'];
	componentId?: ComponentCrashErrorAEP['actionSubjectId'];
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	fallbackComponent?: React.ReactNode;
	rethrowError?: boolean;
}

interface ErrorBoundaryState {
	domError: boolean;
	domErrorCount: number;
	errorCaptured: boolean;
}
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = { errorCaptured: false, domError: false, domErrorCount: 0 };

	private fireAnalyticsEvent(event: ComponentCrashErrorAEP | ComponentCaughtDomErrorAEP) {
		const { createAnalyticsEvent } = this.props;

		if (createAnalyticsEvent) {
			const channel = FabricChannel.editor;
			createAnalyticsEvent(event).fire(channel);
		}
	}

	private hasFallback() {
		return typeof this.props.fallbackComponent !== 'undefined';
	}

	private shouldRecover() {
		return this.hasFallback() && this.state.errorCaptured;
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		const additionalInfo = this.props.additionalInfo ?? '';

		this.fireAnalyticsEvent({
			action: ACTION.CRASHED,
			actionSubject: this.props.component,
			actionSubjectId: this.props.componentId,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				platform: PLATFORM.WEB,
				errorMessage: `${additionalInfo}${error?.message}`,
				componentStack: errorInfo?.componentStack || undefined,
				errorRethrown: Boolean(this.props.rethrowError),
			},
		});
		logException(error, { location: 'renderer' });
		const matchesPattern = FAILED_TO_EXECUTE_REGEX.test(error.message);

		if (matchesPattern) {
			this.fireAnalyticsEvent({
				action: ACTION.CAUGHT_DOM_ERROR,
				actionSubject: this.props.component,
				actionSubjectId: this.props.componentId,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					platform: PLATFORM.WEB,
					errorMessage: `${additionalInfo}${error?.message}`,
				},
			});
			this.setState((prevState) => ({
				domError: true,
				domErrorCount: prevState.domErrorCount + 1,
			}));
		}
		if (this.hasFallback()) {
			this.setState({ errorCaptured: true }, () => {
				if (this.props.rethrowError) {
					throw error;
				}
			});
		}
	}

	render():
		| string
		| number
		| boolean
		| Iterable<React.ReactNode>
		| React.JSX.Element
		| null
		| undefined {
		if (this.state.domError) {
			return <React.Fragment key={this.state.domErrorCount}>{this.props.children}</React.Fragment>;
		}
		if (this.shouldRecover()) {
			return this.props.fallbackComponent;
		}
		return this.props.children;
	}
}
