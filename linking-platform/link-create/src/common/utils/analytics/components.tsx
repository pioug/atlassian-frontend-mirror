import { useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../common/constants';

import createEventPayload, { type AnalyticsEventAttributes } from './analytics.codegen';

export type ScreenViewedEventProps = {
	screen: keyof {
		[Key in keyof AnalyticsEventAttributes as Key extends `screen.${infer ScreenName}.viewed`
			? ScreenName
			: never]: any;
	};
};

export const ScreenViewedEvent = ({ screen }: ScreenViewedEventProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		createAnalyticsEvent(createEventPayload(`screen.${screen}.viewed`, {})).fire(ANALYTICS_CHANNEL);
	}, [createAnalyticsEvent, screen]);

	return null;
};
