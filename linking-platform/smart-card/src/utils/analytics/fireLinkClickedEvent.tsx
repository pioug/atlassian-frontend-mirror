import React from 'react';

import { type GasPayload } from '@atlaskit/analytics-gas-types';
import type { AnalyticsEventPayload } from '@atlaskit/analytics-next/AnalyticsEvent';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { ANALYTICS_CHANNEL } from './analytics';
import { createLinkClickedPayload } from './createLinkClickedPayload';
import { type UiLinkClickedEventProps } from './types';

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

export const fireLinkClickedEvent =
	(
		createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent,
	): ((
		event: React.MouseEvent,
		overrides?: DeepPartial<
			Omit<GasPayload, 'attributes'> & { attributes: UiLinkClickedEventProps }
		>,
	) => void) =>
	(event, overrides = {}) => {
		const payload = createLinkClickedPayload(event);
		if (payload) {
			createAnalyticsEvent({
				...payload,
				...overrides,
				attributes: {
					...payload.attributes,
					...overrides?.attributes,
				},
				nonPrivacySafeAttributes: {
					...payload.nonPrivacySafeAttributes,
					...overrides?.nonPrivacySafeAttributes,
				},
			}).fire(ANALYTICS_CHANNEL);
		}
	};
