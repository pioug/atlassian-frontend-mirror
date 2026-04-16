import React, { useCallback } from 'react';

import { AnalyticsContext, AnalyticsListener, type UIAnalyticsEvent } from '../src';

import AnalyticsButton from './helpers/AnalyticsButton';

const SaveButton = () => {
	const onClick = useCallback(
		(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			analyticsEvent.fire();
		},
		[],
	);

	return (
		<AnalyticsButton
			analyticsEventPayload={{
				action: 'clicked',
				actionSubject: 'button',
				componentName: 'save-button',
				packageName: '@atlaskit/analytics-next',
				packageVersion: '11.2.0',
			}}
			onClick={onClick}
		>
			Save
		</AnalyticsButton>
	);
};

const App = (): React.JSX.Element => {
	const onEvent = ({ context }: UIAnalyticsEvent) => console.log('Event context:', context);

	return (
		<AnalyticsListener onEvent={onEvent}>
			<AnalyticsContext data={{ issueId: 123 }}>
				<AnalyticsContext data={{ panel: 'right' }}>
					<SaveButton />
				</AnalyticsContext>
			</AnalyticsContext>
		</AnalyticsListener>
	);
};

export default App;
