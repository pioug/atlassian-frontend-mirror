import React, { type ErrorInfo } from 'react';

import uuid from 'uuid';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ErrorEventAttributes, ErrorEventPayload } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	editorAnalyticsChannel,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { getDocStructure } from '@atlaskit/editor-common/core-utils';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { IntlErrorBoundary } from '@atlaskit/editor-common/ui';
import type { UserBrowserExtensionResults } from '@atlaskit/editor-common/utils';
import { isOutdatedBrowser } from '@atlaskit/editor-common/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CustomData } from '@atlaskit/ufo/types';

import type { FeatureFlags } from '../types/feature-flags';

import { WithEditorView } from './WithEditorView';

export type ErrorBoundaryProps = {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	editorView?: EditorView;
	rethrow?: boolean;
	children: React.ReactNode;
	featureFlags: FeatureFlags;
	errorTracking?: boolean;
};

export type ErrorBoundaryState = {
	error?: Error;
};

type AnalyticsErrorBoundaryAttributes = {
	error: Error;
	info?: ErrorInfo;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
};

export class ErrorBoundaryWithEditorView extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	featureFlags: FeatureFlags;
	browserExtensions?: UserBrowserExtensionResults = undefined;
	experienceStore?: ExperienceStore;

	static defaultProps = {
		rethrow: true,
		errorTracking: true,
	};

	state = {
		error: undefined,
	};

	constructor(props: ErrorBoundaryProps) {
		super(props);

		this.featureFlags = props.featureFlags;

		if (props.editorView) {
			this.experienceStore = ExperienceStore.getInstance(props.editorView);
		}
	}

	private sendErrorData = async (analyticsErrorPayload: AnalyticsErrorBoundaryAttributes) => {
		const product = await this.getProductName();
		const { error, errorInfo, errorStack } = analyticsErrorPayload;
		const sharedId = uuid();
		const browserInfo = window?.navigator?.userAgent || 'unknown';

		const attributes: ErrorEventAttributes = {
			product,
			browserInfo,
			error: error.toString() as unknown as Error,
			errorInfo,
			errorId: sharedId,
			browserExtensions: this.browserExtensions,
			docStructure:
				this.featureFlags.errorBoundaryDocStructure && this.props.editorView
					? getDocStructure(this.props.editorView.state.doc, { compact: true })
					: undefined,
			outdatedBrowser: isOutdatedBrowser(browserInfo),
		};

		this.fireAnalyticsEvent({
			action: ACTION.EDITOR_CRASHED,
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes,
		});
		this.fireAnalyticsEvent({
			action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
			actionSubject: ACTION_SUBJECT.EDITOR,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				errorId: sharedId,
			},
		});

		if (this.featureFlags.ufo && this.props.editorView) {
			this.experienceStore?.failAll({
				...this.getExperienceMetadata(attributes),
				errorStack,
			});
		}

		logException(error, {
			location: 'editor-core/create-editor',
			product,
		});
	};

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

	private fireAnalyticsEvent = (event: ErrorEventPayload) => {
		this.props.createAnalyticsEvent?.(event).fire(editorAnalyticsChannel);
	};

	private getExperienceMetadata = (attributes: ErrorEventAttributes): CustomData => ({
		browserInfo: attributes.browserInfo,
		error: attributes.error.toString(),
		errorInfo: {
			componentStack: attributes.errorInfo.componentStack || undefined,
		},
		errorId: attributes.errorId,
		browserExtensions: attributes.browserExtensions?.toString(),
		docStructure: attributes.docStructure as string,
	});

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Only report and re-render once, to avoid over-reporting errors and infinite rerendering
		if (this.state.error) {
			return;
		}

		if (this.props.errorTracking) {
			this.sendErrorData({
				error,
				errorInfo,
				errorStack: error.stack,
			});
		}

		// Update state to allow a re-render to attempt graceful recovery (in the event that
		// the error was caused by a race condition or is intermittent)
		this.setState({ error }, () => {
			if (this.props.rethrow) {
				// Now that a re-render has occurred, we re-throw to allow product error boundaries
				// to catch and handle the error too.
				//
				// Note that when rethrowing inside a error boundary, the stack trace
				// from a higher error boundary's componentDidCatch.info param will reset
				// to this component, instead of the original component which threw it.
				throw error;
			}
		});
	}

	// FIXME: This is causing more problems then it's solving. The async check to sniff the browser extensions is block some
	// react unit tests. Essentially jest never completes and just hangs. This was code was added 3yrs ago so that errors
	// would detail if the browser had grammarly extension installed or not. I'm not sure if anyone has every inspecting this
	// as it doesn't look like any dashboards exist for it.
	// You can see the open handles that are block tests if you run unit tests with --detectOpenHandles
	// async componentDidMount() {
	// 	this.browserExtensions = await sniffUserBrowserExtensions({
	// 		extensions: ['grammarly'],
	// 		async: true,
	// 		asyncTimeoutMs: 20000,
	// 	});
	// }

	render() {
		return <IntlErrorBoundary>{this.props.children}</IntlErrorBoundary>;
	}
}

export default WithEditorView(ErrorBoundaryWithEditorView);
