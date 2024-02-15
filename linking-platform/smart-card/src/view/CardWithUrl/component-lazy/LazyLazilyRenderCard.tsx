import React, { useState } from 'react';
import LazilyRender from 'react-lazily-render';

import { CardWithUrlContentProps } from '../types';
import { CardWithUrlContent } from '../component';
import { LoadingCardLink } from './LoadingCardLink';
import { startUfoExperience } from '../../../state/analytics/ufoExperiences';

export function LazyLazilyRenderCard(props: CardWithUrlContentProps) {
  const { appearance, container, id } = props;
  const offset = Math.ceil(window.innerHeight / 4);

  useState(() => {
    // Start of experience when intersectionObserver is not supported.
    startUfoExperience('smart-link-rendered', id);
  });

  return (
    <LazilyRender
      offset={offset}
      component={appearance === 'inline' ? 'span' : 'div'}
      className="loader-wrapper"
      placeholder={<LoadingCardLink {...props} />}
      scrollContainer={container}
      content={<CardWithUrlContent {...props} />}
    />
  );
}
