import React, { type FC } from 'react';
import { type CardWithUrlContentProps } from '../types';
import { CardLinkView } from '../../../view/LinkView';

import { loadingPlaceholderClassName } from './LazyFallback';

export const LoadingCardLink: FC<CardWithUrlContentProps> = ({
  isSelected,
  url,
  placeholder,
}) => {
  return (
    <CardLinkView
      key={'lazy-render-key'}
      testId={'lazy-render-placeholder'}
      data-trello-do-not-use-override="lazy-render-placeholder-trello"
      isSelected={isSelected}
      link={url}
      className={loadingPlaceholderClassName}
      placeholder={placeholder}
    />
  );
};
