import { useEffect } from 'react';

import { withAnalyticsContext } from '@atlaskit/analytics-next';

import { componentMetadata } from '../../constants';
import { useDatasourceAnalyticsEvents } from '../../index';

const DatasourceRenderFailedAnalyticsWrapper = withAnalyticsContext(
  componentMetadata.generic,
)((props: any) => {
  const { fireEvent } = useDatasourceAnalyticsEvents();

  useEffect(() => {
    fireEvent('operational.datasource.renderFailure', {
      reason: 'internal',
    });
  }, [fireEvent]);

  return props.children;
});

export default DatasourceRenderFailedAnalyticsWrapper;
