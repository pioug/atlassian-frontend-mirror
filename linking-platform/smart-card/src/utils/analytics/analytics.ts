import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { SmartLinkActionType } from '@atlaskit/linking-types';

import { type CardInnerAppearance } from '../../view/Card/types';
import { getMeasure } from '../performance';
import { type AnalyticsPayload } from '../types';

import {
	type ConnectFailedEventProps,
	type ConnectSucceededEventProps,
	type InvokeFailedEventProps,
	type InvokeSucceededEventProps,
	type ResolvedEventProps,
	type ScreenAuthPopupEventProps,
	type UiActionClickedEventProps,
	type UiAuthAlternateAccountEventProps,
	type UiAuthEventProps,
	type UiCardClickedEventProps,
	type UiClosedAuthEventProps,
	type UiHoverCardDismissedEventProps,
	type UiHoverCardOpenLinkClickedEventProps,
	type UiHoverCardViewedEventProps,
	type UiRenderFailedEventProps,
	type UiRenderSuccessEventProps,
	type UiServerActionClickedEventProps,
	type UnresolvedEventProps,
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

export const SmartLinkActionTypeTrackingEventMapper: Record<string, string> = {
	[SmartLinkActionType.FollowEntityAction]: 'Follow',
	[SmartLinkActionType.StatusUpdateAction]: 'StatusUpdate',
	[SmartLinkActionType.UnfollowEntityAction]: 'Unfollow',
};

export const SmartLinkActionTypeUiEventMapper: Record<string, string> = {
	[SmartLinkActionType.FollowEntityAction]: 'smartLinkFollowButton',
	[SmartLinkActionType.UnfollowEntityAction]: 'smartLinkFollowButton',
};

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

export const resolvedEvent = (props: ResolvedEventProps): AnalyticsPayload => ({
	action: 'resolved',
	actionSubject: 'smartLink',
	eventType: 'operational',
	attributes: {
		...props,
		...context,
	},
});

export const unresolvedEvent = ({
	id,
	definitionId,
	extensionKey,
	resourceType,
	destinationSubproduct,
	destinationProduct,
	error,
	status,
	location,
}: UnresolvedEventProps): AnalyticsPayload => ({
	action: 'unresolved',
	actionSubject: 'smartLink',
	eventType: 'operational',
	attributes: {
		id,
		...context,
		...(definitionId ? { definitionId } : {}),
		...(extensionKey ? { extensionKey } : {}),
		...(resourceType ? { resourceType } : {}),
		...(destinationSubproduct ? { destinationSubproduct } : {}),
		...(destinationProduct ? { destinationProduct } : {}),
		...(location ? { location } : {}),
		reason: status,
		error: error
			? {
					message: error?.message,
					kind: error?.kind,
					type: error?.type,
				}
			: undefined,
	},
});

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

export const connectSucceededEvent = ({
	definitionId,
	extensionKey,
	destinationProduct,
	destinationSubproduct,
	location,
}: ConnectSucceededEventProps): AnalyticsPayload => ({
	action: 'connectSucceeded',
	actionSubject: 'smartLink',
	eventType: 'operational',
	attributes: {
		...context,
		definitionId,
		extensionKey,
		destinationProduct,
		destinationSubproduct,
		location,
	},
});

export const connectFailedEvent = ({
	definitionId,
	extensionKey,
	destinationProduct,
	destinationSubproduct,
	location,
	reason,
}: ConnectFailedEventProps): AnalyticsPayload => ({
	action: 'connectFailed',
	actionSubject: 'smartLink',
	actionSubjectId: reason,
	eventType: 'operational',
	attributes: {
		...context,
		reason,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
	},
});

export const uiAuthEvent = ({
	definitionId,
	extensionKey,
	destinationProduct,
	destinationSubproduct,
	location,
	display,
}: UiAuthEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'connectAccount',
	eventType: 'ui',
	attributes: {
		...context,
		definitionId,
		extensionKey,
		destinationProduct,
		destinationSubproduct,
		location,
		display,
	},
});

export const uiAuthAlternateAccountEvent = ({
	definitionId,
	extensionKey,
	destinationProduct,
	destinationSubproduct,
	location,
	display,
}: UiAuthAlternateAccountEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'smartLink',
	actionSubjectId: 'tryAnotherAccount',
	eventType: 'ui',
	attributes: {
		...context,
		definitionId,
		extensionKey,
		destinationProduct,
		destinationSubproduct,
		location,
		display,
	},
});

export const uiCardClickedEvent = ({
	id,
	display,
	status,
	definitionId,
	extensionKey,
	isModifierKeyPressed,
	location,
	destinationProduct,
	destinationSubproduct,
	actionSubjectId,
}: UiCardClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'smartLink',
	actionSubjectId,
	eventType: 'ui',
	attributes: {
		...context,
		id,
		status,
		definitionId,
		extensionKey,
		display,
		isModifierKeyPressed,
		location,
		destinationProduct,
		destinationSubproduct,
	},
});

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

export const uiClosedAuthEvent = ({
	display,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: UiClosedAuthEventProps): AnalyticsPayload => ({
	action: 'closed',
	actionSubject: 'consentModal',
	eventType: 'ui',
	attributes: {
		...context,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
		display,
	},
});

/**
 * @deprecated remove when platform_smart-card-migrate-screen-analytics is cleaned up
 */
export const screenAuthPopupEvent = ({
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: ScreenAuthPopupEventProps): AnalyticsPayload => ({
	actionSubject: 'consentModal',
	eventType: 'screen',
	attributes: {
		...context,
		extensionKey,
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

export const uiHoverCardViewedEvent = ({
	id,
	previewDisplay,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
	previewInvokeMethod,
	status,
}: UiHoverCardViewedEventProps): AnalyticsPayload => ({
	action: 'viewed',
	actionSubject: 'hoverCard',
	eventType: 'ui',
	attributes: {
		...context,
		id,
		previewDisplay,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
		previewInvokeMethod,
		status,
	},
});

export const uiHoverCardDismissedEvent = ({
	id,
	previewDisplay,
	hoverTime,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
	previewInvokeMethod,
	status,
}: UiHoverCardDismissedEventProps): AnalyticsPayload => ({
	action: 'dismissed',
	actionSubject: 'hoverCard',
	eventType: 'ui',
	attributes: {
		...context,
		id,
		previewDisplay,
		hoverTime,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
		previewInvokeMethod,
		status,
	},
});

export const uiHoverCardOpenLinkClickedEvent = ({
	id,
	previewDisplay,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
	previewInvokeMethod,
}: UiHoverCardOpenLinkClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'shortcutGoToLink',
	eventType: 'ui',
	attributes: {
		...context,
		id,
		previewDisplay,
		extensionKey,
		definitionId,
		destinationProduct,
		destinationSubproduct,
		location,
		previewInvokeMethod,
	},
});

export const uiLearnMoreLinkClickedEvent = (): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'learnMore',
	eventType: 'ui',
	attributes: {
		...context,
	},
});

export const chunkloadFailedEvent = ({
	display,
	error,
	errorInfo,
	extensionKey,
	definitionId,
	destinationProduct,
	destinationSubproduct,
	location,
}: UiRenderFailedEventProps): AnalyticsPayload => ({
	action: 'chunkLoadFailed',
	actionSubject: 'smartLink',
	eventType: 'operational',
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

export const uiSmartLinkStatusLozengeButtonClicked = (): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'smartLinkStatusLozenge',
	eventType: 'ui',
	attributes: {
		...context,
	},
});

export const uiSmartLinkStatusListItemButtonClicked = (): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'smartLinkStatusListItem',
	eventType: 'ui',
	attributes: {
		...context,
	},
});

export const uiSmartLinkStatusOpenPreviewButtonClicked = (): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'smartLinkStatusOpenPreview',
	eventType: 'ui',
	attributes: {
		...context,
	},
});

export const uiServerActionClicked = ({
	smartLinkActionType,
}: UiServerActionClickedEventProps): AnalyticsPayload => ({
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: SmartLinkActionTypeUiEventMapper[smartLinkActionType] ?? smartLinkActionType,
	eventType: 'ui',
	attributes: {
		...context,
	},
});
