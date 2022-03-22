/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { FC, useCallback, useRef, useMemo } from 'react';
import { HoverCardProps } from './types';
import {
  TitleBlock,
  SnippetBlock,
  FooterBlock,
} from '../FlexibleCard/components/blocks';
import { Card } from '../Card';
import Popup from '@atlaskit/popup';
import { SmartLinkSize, ActionName } from '../../constants';
import { CustomActionItem } from '../FlexibleCard/components/blocks/types';
import {
  useSmartLinkActions,
  LinkAction,
} from '../../state/hooks-external/useSmartLinkActions';
import { HoverCardContainer } from './styled';

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

  //TODO: EDM-2905: Add analytics events
  const analyticsHandler = useCallback(() => {}, []);
  const linkActions = useSmartLinkActions({
    url,
    appearance: 'block',
    analyticsHandler,
  });

  const actions = useMemo(
    () =>
      linkActions.map(
        (action: LinkAction) =>
          ({
            content: action.text,
            name: ActionName.CustomAction,
            onClick: () => action.invoke(),
            testId: action.id,
          } as CustomActionItem),
      ),
    [linkActions],
  );

  const cardComponent = () => (
    <div
      onMouseEnter={initShowCard}
      onMouseLeave={initHideCard}
      css={HoverCardContainer}
    >
      <Card
        appearance="block"
        url={url}
        ui={{ hideElevation: true, size: SmartLinkSize.Large }}
      >
        <TitleBlock />
        <SnippetBlock />
        <FooterBlock actions={actions} />
      </Card>
    </div>
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
