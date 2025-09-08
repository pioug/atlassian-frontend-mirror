import React from 'react';

import type { EventType } from '@atlaskit/analytics-gas-types';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/new';

import {
	fireOperationalEvent,
	fireScreenEvent,
	fireTrackEvent,
	fireUIEvent,
	operationalExampleEvent,
	screenExampleEvent,
	trackExampleEvent,
	uiExampleEvent,
} from './utils';

type Props = WithAnalyticsEventsProps & {
	eventType: EventType;
};

const BasicButton = (props: Props) => {
	const onClick = () => {
		switch (props.eventType) {
			case 'operational':
				fireOperationalEvent(props.createAnalyticsEvent, operationalExampleEvent);
				break;
			case 'track':
				fireTrackEvent(props.createAnalyticsEvent, trackExampleEvent);
				break;
			case 'screen':
				fireScreenEvent(props.createAnalyticsEvent, screenExampleEvent);
				break;
			case 'ui':
			default:
				fireUIEvent(props.createAnalyticsEvent, uiExampleEvent);
				break;
		}
	};
	return (
		<Button
			onClick={onClick}
			testId="button-with-analytics"
		>{`Fire ${props.eventType} Analytics Event`}</Button>
	);
};

export const ButtonWithAnalytics = withAnalyticsEvents()(BasicButton);
