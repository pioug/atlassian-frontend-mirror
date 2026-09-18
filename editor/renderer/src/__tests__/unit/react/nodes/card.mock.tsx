import { useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

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
