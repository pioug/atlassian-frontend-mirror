import React from 'react';
import { withMediaClient } from '@atlaskit/media-client-react';
import MediaCardAnalyticsErrorBoundary from '../media-card-analytics-error-boundary';
import { CardV2 } from './cardV2';
import { CardWithMediaClientConfigProps } from '../types';

export const CardWithMediaClientV2: React.FC<CardWithMediaClientConfigProps> = (
  props,
) => {
  const { dimensions, onClick, featureFlags } = props;
  const Card = React.useMemo(() => {
    return withMediaClient(CardV2);
  }, []);

  const featureFlagsWithMediaCardV2 = React.useMemo(
    () => ({
      ...featureFlags,
      mediaCardV2: true, //used for analytics - internal use only
    }),
    [featureFlags],
  );
  return (
    <MediaCardAnalyticsErrorBoundary dimensions={dimensions} onClick={onClick}>
      <Card {...props} featureFlags={featureFlagsWithMediaCardV2} />
    </MediaCardAnalyticsErrorBoundary>
  );
};
