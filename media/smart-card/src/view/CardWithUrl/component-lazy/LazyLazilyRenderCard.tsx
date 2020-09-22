import React from 'react';
import LazilyRender from 'react-lazily-render';

import { CardWithUrlContentProps } from '../types';
import { CardWithUrlContent } from '../component';
import { LoadingCardLink } from './LazyFallback';

export function LazyLazilyRenderCard(props: CardWithUrlContentProps) {
  const { appearance, container, showActions } = props;
  const offset = Math.ceil(window.innerHeight / 4);
  return (
    <LazilyRender
      offset={offset}
      component={appearance === 'inline' ? 'span' : 'div'}
      className="loader-wrapper"
      placeholder={<LoadingCardLink {...props} />}
      scrollContainer={container}
      content={<CardWithUrlContent {...props} showActions={showActions} />}
    />
  );
}
