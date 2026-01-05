import React from 'react';

import { ACTION, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ComponentCaughtDomErrorAEP, ComponentCrashErrorAEP } from '../../analytics/events';
import { PLATFORM } from '../../analytics/events';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

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
	errorCaptured: boolean;
}
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = { errorCaptured: false, domError: false };

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
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		const pattern = /Failed to execute.*on 'Node'.*/;
		const matchesPattern = pattern.test(error.message);

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
			this.setState(() => ({
				domError: true,
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

	render() {
		if (this.state.domError) {
			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			return <React.Fragment key={uuid()}>{this.props.children}</React.Fragment>;
		}
		if (this.shouldRecover()) {
			return this.props.fallbackComponent;
		}
		return this.props.children;
	}
}
