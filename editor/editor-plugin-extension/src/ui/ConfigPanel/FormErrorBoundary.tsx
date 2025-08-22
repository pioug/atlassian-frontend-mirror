import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	editorAnalyticsChannel,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { configPanelMessages as messages } from '@atlaskit/editor-common/extensions';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

interface ErrorInfo {
	componentStack: string;
}
type AnalyticsErrorBoundaryAttributes = {
	error: string;
	errorInfo?: ErrorInfo;
	errorStack?: string;
};

interface Props {
	children: React.ReactNode;
	contextIdentifierProvider?: ContextIdentifierProvider;
	extensionKey: string;
	fields: FieldDefinition[];
}
interface State {
	error?: Error;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class FormErrorBoundaryInner extends React.Component<
	Props & WithAnalyticsEventsProps & WrappedComponentProps,
	State
> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context: any;
	state: State = { error: undefined };

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ error }, () => {
			// Log the error
			this.fireAnalytics({
				error: error.toString(),
				errorInfo,
				errorStack: error.stack,
			});
		});
	}

	private getProductName = async () => {
		const { contextIdentifierProvider } = this.props;

		if (contextIdentifierProvider) {
			const context = await contextIdentifierProvider;
			if (context.product) {
				return context.product;
			}
		}
		return 'atlaskit';
	};

	fireAnalytics = (analyticsErrorPayload: AnalyticsErrorBoundaryAttributes) => {
		const { createAnalyticsEvent, extensionKey, fields } = this.props;

		this.getProductName()
			.then((product) => {
				if (!createAnalyticsEvent) {
					// eslint-disable-next-line no-console
					console.error('ConfigPanel FormErrorBoundary: Missing `createAnalyticsEvent`', {
						channel: editorAnalyticsChannel,
						product,
						error: analyticsErrorPayload,
					});
					return;
				}

				const { error, errorInfo, errorStack } = analyticsErrorPayload;
				const payload: AnalyticsEventPayload = {
					action: ACTION.ERRORED,
					actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
					eventType: EVENT_TYPE.UI,
					attributes: {
						product,
						browserInfo: window?.navigator?.userAgent || 'unknown',
						extensionKey,
						fields: JSON.stringify(fields),
						error,
						errorInfo,
						errorStack,
					},
				};

				createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
			})
			.catch((e) => {
				// eslint-disable-next-line no-console
				console.error('Failed to resolve product name from contextIdentifierProvider.', e);
			});
	};

	render() {
		const { intl } = this.props;
		const { error } = this.state;

		if (!error) {
			return this.props.children;
		}

		return (
			<SectionMessage title={intl.formatMessage(messages.errorBoundaryTitle)} appearance="error">
				<Stack>
					<Text as="p">
						<i>{error.message}</i>
					</Text>

					<Text as="p">{intl.formatMessage(messages.errorBoundaryNote)}</Text>
				</Stack>
			</SectionMessage>
		);
	}
}

export const FormErrorBoundaryImpl = injectIntl(FormErrorBoundaryInner);

export const FormErrorBoundary = withAnalyticsContext()(
	withAnalyticsEvents()(FormErrorBoundaryImpl),
);
FormErrorBoundary.displayName = 'FormErrorBoundary';
