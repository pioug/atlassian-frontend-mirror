import type React from 'react';
import { useEffect } from 'react';

import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import type { AIEventSummaryViewedProps } from './types';

const AIEventSummaryViewed: React.FC<AIEventSummaryViewedProps> = ({ fromCache = null }) => {
	const { fireEvent } = useAnalyticsEvents();

	useEffect(() => {
		fireEvent('ui.summary.viewed', { fromCache });
		if (fromCache) {
			fireEvent('track.aiInteraction.initiated', {
				aiFeatureName: 'Smart Links Summary',
				proactiveAIGenerated: 1,
				userGeneratedAI: 0,
			});
		}
	}, [fireEvent, fromCache]);

	return null;
};

export default AIEventSummaryViewed;
