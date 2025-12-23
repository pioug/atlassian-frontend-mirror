import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type CardInnerAppearance } from '../../view/Card/types';
import { type AnalyticsPayload } from '../types';

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

export class SmartLinkEvents {
	public insertSmartLink(
		url: string,
		type: CardInnerAppearance,
		createAnalyticsEvent?: CreateUIAnalyticsEvent,
	): void {
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
): void => {
	if (createAnalyticsEvent) {
		createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
	}
};
