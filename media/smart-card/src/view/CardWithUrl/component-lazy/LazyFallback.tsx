import React, { FC } from 'react';
import { CardWithUrlContentProps } from '../types';
import { CardLinkView } from '../../../view/LinkView';

export const loadingPlaceholderClassName = 'smart-link-loading-placeholder';

export const LoadingCardLink: FC<CardWithUrlContentProps> = ({
  isSelected,
  url,
}) => (
  <CardLinkView
    key={'lazy-render-key'}
    testId={'lazy-render-placeholder'}
    data-trello-do-not-use-override="lazy-render-placeholder-trello"
    isSelected={isSelected}
    link={url}
    className={loadingPlaceholderClassName}
  />
);
