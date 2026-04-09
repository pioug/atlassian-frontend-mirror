export { EVENT_CHANNEL } from './constants';

import { useAnalyticsEvents } from './generated/use-analytics-events';

export const useDatasourceAnalyticsEvents = (): ReturnType<typeof useAnalyticsEvents> =>
	useAnalyticsEvents();
