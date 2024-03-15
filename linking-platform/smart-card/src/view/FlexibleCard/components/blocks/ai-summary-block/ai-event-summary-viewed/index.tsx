import React, { useEffect } from 'react';

import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';
import type { AIEventSummaryViewedProps } from './types';

const AIEventSummaryViewed: React.FC<AIEventSummaryViewedProps> = ({
  fromCache = null,
}) => {
  const { fireEvent } = useAnalyticsEvents();

  useEffect(() => {
    fireEvent('ui.summary.viewed', { fromCache });
  }, [fireEvent, fromCache]);

  return null;
};

export default AIEventSummaryViewed;
