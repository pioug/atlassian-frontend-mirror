import React from 'react';

import type { EventType } from '@atlaskit/analytics-gas-types';
import Button from '@atlaskit/button/new';

import { useAnalyticsEvents } from '../../src/common/utils/generated/use-analytics-events';

type Props = {
	eventType: EventType;
};

const BasicButton = (props: Props): React.JSX.Element => {
	const { fireEvent } = useAnalyticsEvents();
	const onClick = () => {
		switch (props.eventType) {
			case 'operational':
				fireEvent('operational.automation.fired.analyticsExample', { testAttribute: 'testValue' });
				break;
			case 'track':
				fireEvent('track.automation.triggered.analyticsExample', { testAttribute: 'testValue' });
				break;
			case 'screen':
				fireEvent('screen.analyticsExampleScreen.viewed', { testAttribute: 'testValue' });
				break;
			case 'ui':
			default:
				fireEvent('ui.button.clicked.analyticsExample', { testAttribute: 'testValue' });
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
