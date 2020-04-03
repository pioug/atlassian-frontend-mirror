import React from 'react';
import { AnalyticsEventPayload } from './events';

const AnalyticsContext = React.createContext<{
  fireAnalyticsEvent: (event: AnalyticsEventPayload) => void;
}>({
  fireAnalyticsEvent: (_event: AnalyticsEventPayload) => null,
});

export default AnalyticsContext;
