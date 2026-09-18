import React from 'react';

import type { AnalyticsEventPayload } from './events';

const AnalyticsContext: React.Context<{
	fireAnalyticsEvent: (event: AnalyticsEventPayload) => void;
}> = React.createContext<{
	fireAnalyticsEvent: (event: AnalyticsEventPayload) => void;
}>({
	fireAnalyticsEvent: (_event: AnalyticsEventPayload) => null,
});

export default AnalyticsContext;
