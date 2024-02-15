import React from 'react';
import { withMediaClient } from '@atlaskit/media-client-react';
import type { CardWithMediaClientConfigProps } from './types';
import { Card as MediaCard } from './card';
import MediaCardAnalyticsErrorBoundary from './media-card-analytics-error-boundary';

export const CardWithMediaClient: React.FC<CardWithMediaClientConfigProps> = (
  props,
) => {
  const { dimensions, onClick } = props;
  const Card = React.useMemo(() => {
    return withMediaClient(MediaCard);
  }, []);

  return (
    // onClick is passed into MediaCardErrorBoundary so MediaGroup items can get the toolbar menu in Editor
    <MediaCardAnalyticsErrorBoundary dimensions={dimensions} onClick={onClick}>
      <Card {...props} />
    </MediaCardAnalyticsErrorBoundary>
  );
};
