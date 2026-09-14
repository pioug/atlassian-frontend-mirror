import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { useEffect } from 'react';

export const MockCardComponent = () => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		createAnalyticsEvent({
			action: 'rendered',
			actionSubject: 'link',
		}).fire('atlaskit');
	}, [createAnalyticsEvent]);

	return null;
};
