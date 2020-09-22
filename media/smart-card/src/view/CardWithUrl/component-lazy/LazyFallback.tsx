import React, { FC } from 'react';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardWithUrlContentProps } from '../types';

export const LoadingCardLink: FC<CardWithUrlContentProps> = ({
  isSelected,
  url,
}) => (
  <CardLinkView
    key={'lazy-render-key'}
    testId={'lazy-render-placeholder'}
    isSelected={isSelected}
    link={url}
  />
);
