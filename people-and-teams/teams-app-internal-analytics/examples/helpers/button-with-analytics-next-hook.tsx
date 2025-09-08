import React from 'react';

import type { EventType } from '@atlaskit/analytics-gas-types';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
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

type Props = {
	eventType: EventType;
};

const BasicButton = (props: Props) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const onClick = () => {
		switch (props.eventType) {
			case 'operational':
				fireOperationalEvent(createAnalyticsEvent, operationalExampleEvent);
				break;
			case 'track':
				fireTrackEvent(createAnalyticsEvent, trackExampleEvent);
				break;
			case 'screen':
				fireScreenEvent(createAnalyticsEvent, screenExampleEvent);
				break;
			case 'ui':
			default:
				fireUIEvent(createAnalyticsEvent, uiExampleEvent);
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

export const ButtonWithAnalytics = BasicButton;
