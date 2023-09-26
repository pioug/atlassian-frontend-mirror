import { useEffect } from 'react';

export { EVENT_CHANNEL } from './constants';

import { withAnalyticsContext } from '@atlaskit/analytics-next';

import { packageMetaData } from './constants';
import { useAnalyticsEvents } from './generated/use-analytics-events';

export const useDatasourceAnalyticsEvents = () => useAnalyticsEvents();

export const DatasourceRenderFailedAnalyticsWrapper = withAnalyticsContext(
  packageMetaData,
)((props: any) => {
  const { fireEvent } = useDatasourceAnalyticsEvents();

  useEffect(() => {
    fireEvent('ui.datasource.renderFailure', {
      reason: 'internal',
    });
  }, [fireEvent]);

  return props.children;
});
