import { useEffect } from 'react';

import { useAnalyticsEvents } from '../../../../../common/analytics/generated/use-analytics-events';

const AIEventErrorViewed = ({ reason }: { reason?: string }) => {
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.error.viewed.aiSummary', { reason });
	}, [fireEvent, reason]);

	return null;
};

export default AIEventErrorViewed;
