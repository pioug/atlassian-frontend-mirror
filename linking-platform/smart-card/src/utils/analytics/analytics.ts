import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type CardInnerAppearance } from '../../view/Card/types';
import { getMeasure } from '../performance';
import { type AnalyticsPayload } from '../types';

import {
	type InvokeFailedEventProps,
	type InvokeSucceededEventProps,
	type UiActionClickedEventProps,
	type UiRenderFailedEventProps,
	type UiRenderSuccessEventProps,
} from './types';

export const ANALYTICS_CHANNEL = 'media';

export const context = {
	componentName: 'smart-cards',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

export enum TrackQuickActionType {
	StatusUpdate = 'StatusUpdate',
}

export enum TrackQuickActionFailureReason {
	PermissionError = 'PermissionError',
	ValidationError = 'ValidationError',
	UnknownError = 'UnknownError',
}

const uiActionSubjectIds: Record<string, string> = {
	DownloadAction: 'downloadDocument',
	PreviewAction: 'invokePreviewScreen',
	ViewAction: 'shortcutGoToLink',
	StatusAction: 'issueStatusUpdate',
};

export class SmartLinkEvents {
	public insertSmartLink(
		url: string,
		type: CardInnerAppearance,
		createAnalyticsEvent?: CreateUIAnalyticsEvent,
	) {
		fireSmartLinkEvent(
			{
				action: 'inserted',
				actionSubject: 'smartLink',
				eventType: 'track',
				attributes: {
					type,
				},
				nonPrivacySafeAttributes: {
					domainName: url,
				},
			},
			createAnalyticsEvent,
		);
	}
}

export const fireSmartLinkEvent = (
	payload: AnalyticsPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
) => {
	if (createAnalyticsEvent) {
		createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
	}
};

export const invokeSucceededEvent = ({
	id,
	actionType,
	display,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: InvokeSucceededEventProps): AnalyticsPayload => {
	const measure = id ? getMeasure(id, 'resolved') : undefined;
	return {
		action: 'resolved',
		actionSubject: 'smartLinkAction',
		eventType: 'operational',
		attributes: {
			...context,
			id,
			actionType,
			display,
			definitionId,
			destinationProduct,
			destinationSubproduct,
			location,
			extensionKey,
			duration: measure?.duration,
		},
	};
};

export const invokeFailedEvent = ({
	id,
	actionType,
	display,
	reason,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: InvokeFailedEventProps): AnalyticsPayload => {
	const measure = id ? getMeasure(id, 'errored') : undefined;
	return {
		action: 'unresolved',
		actionSubject: 'smartLinkAction',
		eventType: 'operational',
		attributes: {
			...context,
			id,
			actionType,
			display,
			extensionKey,
			definitionId,
			destinationProduct,
			destinationSubproduct,
			location,
			duration: measure?.duration,
			reason,
		},
	};
};

export const uiActionClickedEvent = ({
	id,
	actionType,
	extensionKey,
	display,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: UiActionClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: uiActionSubjectIds[actionType],
	eventType: 'ui',
	attributes: {
		...context,
		id,
		display,
		actionType: actionType,
		extensionKey: extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
	},
});

export const uiRenderSuccessEvent = ({
	display,
	status,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
	canBeDatasource,
}: UiRenderSuccessEventProps): AnalyticsPayload => ({
	action: 'renderSuccess',
	actionSubject: 'smartLink',
	eventType: 'ui',
	attributes: {
		...context,
		status,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
		display,
		canBeDatasource,
	},
});

export const uiRenderFailedEvent = ({
	display,
	error,
	errorInfo,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: UiRenderFailedEventProps): AnalyticsPayload => ({
	actionSubject: 'smartLink',
	action: 'renderFailed',
	eventType: 'ui',
	attributes: {
		...context,
		error,
		errorInfo,
		display,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
	},
});
