import React, { FC, useCallback, useRef } from 'react';
import { HoverCardProps } from './types';
import {
  TitleBlock,
  SnippetBlock,
  FooterBlock,
} from '../FlexibleCard/components/blocks';
import { Card } from '../Card';
import Popup from '@atlaskit/popup';
import { SmartLinkSize } from '../../constants';

export const HoverCard: FC<HoverCardProps> = ({ children, url }) => {
  const delay = 300;
  const [isOpen, setIsOpen] = React.useState(false);
  const fadeOutTimeoutId = useRef<NodeJS.Timeout>();
  const fadeInTimeoutId = useRef<NodeJS.Timeout>();

  const initHideCard = useCallback(() => {
    if (fadeInTimeoutId.current) {
      clearTimeout(fadeInTimeoutId.current);
    }
    fadeOutTimeoutId.current = setTimeout(() => {
      setIsOpen(false);
    }, delay);
  }, [delay]);

  const initShowCard = useCallback(() => {
    if (fadeOutTimeoutId.current) {
      clearTimeout(fadeOutTimeoutId.current);
    }
    fadeInTimeoutId.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);
  }, [delay]);

  const cardComponent = () => (
    <span onMouseEnter={initShowCard} onMouseLeave={initHideCard}>
      <Card
        appearance="block"
        url={url}
        ui={{ hideElevation: true, size: SmartLinkSize.Large }}
      >
        <TitleBlock />
        <SnippetBlock />
        <FooterBlock />
      </Card>
    </span>
  );

  const onClose = useCallback(() => setIsOpen(false), []);

  return (
    <Popup
      testId="hover-card"
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      content={cardComponent}
      trigger={(triggerProps) => (
        <span
          {...triggerProps}
          onMouseEnter={initShowCard}
          onMouseLeave={initHideCard}
        >
          {children}
        </span>
      )}
    />
  );
};
