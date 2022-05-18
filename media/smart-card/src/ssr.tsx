import React from 'react';
import { FC, useState } from 'react';
import uuid from 'uuid';
import { ErrorBoundary } from 'react-error-boundary';
import type { CardProps } from './types';
import { CardWithUrlContent } from './view/CardWithUrl/component';
import { LoadingCardLink } from './view/CardWithUrl/component-lazy/LazyFallback';

export type CardSSRProps = CardProps & { url: string };
// SSR friendly version of smart-card
// simplifies the logic around rendering and loading placeholders and
// only contains whats necessary to render the card on SSR mode
export const CardSSR: FC<CardSSRProps> = (props) => {
  const [id] = useState(() => uuid());
  const dispatchAnalytics = () => {}; // we can't dispatch events on SSR, after hydration the we will provide the real callback
  const cardProps = {
    ...props,
    id,
    dispatchAnalytics,
  };

  return (
    <ErrorBoundary FallbackComponent={() => <LoadingCardLink {...cardProps} />}>
      <CardWithUrlContent {...cardProps} />
    </ErrorBoundary>
  );
};
