import React from 'react';
import { FC, useState } from 'react';
import uuid from 'uuid';
import { ErrorBoundary } from 'react-error-boundary';

import { AnalyticsContext } from '@atlaskit/analytics-next';

import type { CardProps } from './types';
import { CardWithUrlContent } from './view/CardWithUrl/component';
import { LoadingCardLink } from './view/CardWithUrl/component-lazy/LoadingCardLink';
import { context } from './utils/analytics/analytics';

export type CardSSRProps = CardProps & { url: string };

// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
export const CardSSR: FC<CardSSRProps> = (props) => {
  const [id] = useState(() => props.id ?? uuid());
  const cardProps = {
    ...props,
    id,
  };

  return (
    <AnalyticsContext data={context}>
      <ErrorBoundary
        FallbackComponent={() => <LoadingCardLink {...cardProps} />}
      >
        <CardWithUrlContent {...cardProps} />
      </ErrorBoundary>
    </AnalyticsContext>
  );
};
