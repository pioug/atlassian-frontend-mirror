import React, { FC } from 'react';
import { HoverCardProps } from './types';
import Tooltip from '@atlaskit/tooltip';
import {
  TitleBlock,
  SnippetBlock,
  FooterBlock,
} from '../FlexibleCard/components/blocks';
import { Card } from '../Card';
import { HoverCardContainer } from './styled';

export const HoverCard: FC<HoverCardProps> = ({ children, url }) => {
  const cardComponent = (
    <Card appearance="block" url={url}>
      <TitleBlock />
      <SnippetBlock />
      <FooterBlock />
    </Card>
  );
  return (
    <Tooltip
      content={cardComponent}
      component={HoverCardContainer}
      testId="hover-card"
      tag="span"
    >
      {children}
    </Tooltip>
  );
};
