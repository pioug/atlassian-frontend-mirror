import React from 'react';
import { isIntersectionObserverSupported } from '@atlaskit/media-ui';
import { CardWithUrlContentProps } from '../types';
import { LazyLazilyRenderCard } from './LazyLazilyRenderCard';
import { LazyIntersectionObserverCard } from './LazyIntersectionObserverCard';

export function LazyCardWithUrlContent(props: CardWithUrlContentProps) {
  if (isIntersectionObserverSupported()) {
    return <LazyIntersectionObserverCard {...props} />;
  } else {
    return <LazyLazilyRenderCard {...props} />;
  }
}
