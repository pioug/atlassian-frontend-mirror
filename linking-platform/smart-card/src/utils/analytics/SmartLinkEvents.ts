import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { type CardInnerAppearance } from '../../view/Card/types';
import { fireSmartLinkEvent } from './fireSmartLinkEvent';

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
