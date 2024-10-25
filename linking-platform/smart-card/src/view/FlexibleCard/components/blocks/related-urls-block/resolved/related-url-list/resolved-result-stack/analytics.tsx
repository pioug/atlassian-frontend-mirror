import React from 'react';

import { type JsonLd } from 'json-ld-types';

import {
	AnalyticsContext,
	type AnalyticsEventPayload,
	type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';

import { ANALYTICS_CHANNEL } from '../../../../../../../../utils/analytics';
import { type AnalyticsPayload } from '../../../../../../../../utils/types';

import { type UiRelatedLinksViewedEventProps } from './types';

const createUiRelatedLinksViewedEventPayload = ({
	relatedLinksCount,
}: UiRelatedLinksViewedEventProps): AnalyticsPayload => ({
	action: 'viewed',
	actionSubject: 'relatedLinks',
	eventType: 'ui',
	attributes: {
		relatedLinksCount,
	},
});

export const fireRelatedLinksViewedEvent =
	(
		createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent,
	): ((attributes: UiRelatedLinksViewedEventProps) => void) =>
	(attributes) => {
		const payload = createUiRelatedLinksViewedEventPayload(attributes);

		if (payload) {
			createAnalyticsEvent({
				...payload,
			}).fire(ANALYTICS_CHANNEL);
		}
	};

type RelatedUrlItemAnalyticsContextProps = {
	details: JsonLd.Response;
	children?: React.ReactNode;
};

export const RelatedUrlItemAnalyticsContext = (props: RelatedUrlItemAnalyticsContextProps) => {
	const { children, details } = props;

	/**
	 * We don't really need the `url` to get the attributes here so set
	 * it to an empty string to just make typescript happy
	 */
	const attributes = getResolvedAttributes({ url: '' }, details);

	return (
		<AnalyticsContext
			data={{
				attributes,
				component: 'relatedLink',
			}}
		>
			{children}
		</AnalyticsContext>
	);
};
