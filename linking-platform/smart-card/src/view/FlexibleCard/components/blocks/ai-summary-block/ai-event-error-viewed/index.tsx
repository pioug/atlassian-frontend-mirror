import React, { useEffect } from 'react';

import { useAnalyticsEvents } from '../../../../../../common/analytics/generated/use-analytics-events';

const AIEventErrorViewed: React.FC = () => {
  const { fireEvent } = useAnalyticsEvents();

  useEffect(() => {
    fireEvent('ui.error.viewed.aiSummary', {});
  }, [fireEvent]);

  return null;
};

export default AIEventErrorViewed;
