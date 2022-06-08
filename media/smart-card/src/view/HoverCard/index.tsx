/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { FC, useCallback, useRef, useMemo } from 'react';
import { HoverCardProps } from './types';
import {
  TitleBlock,
  SnippetBlock,
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
} from '../FlexibleCard/components/blocks';
import { Card } from '../Card';
import Popup from '@atlaskit/popup';
import { SmartLinkSize, ActionName, SmartLinkTheme } from '../../constants';
import { CustomActionItem } from '../FlexibleCard/components/blocks/types';
import {
  useSmartLinkActions,
  LinkAction,
} from '../../state/hooks-external/useSmartLinkActions';
import { HoverCardContainer } from './styled';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import { fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsPayload } from '../../../src/utils/types';
import { useSmartCardState as useLinkState } from '../../state/store';
import { useSmartLinkAnalytics } from '../../state/analytics';
import { getExtensionKey, getDefinitionId } from '../../state/helpers';
import { extractMetadata } from '../../extractors/hover/extractMetadata';
import { getSimulatedMetadata } from './utils';
import extractPreview from '../../extractors/flexible/extract-preview';
import { JsonLd } from 'json-ld-types';

export const HoverCardComponent: FC<HoverCardProps> = ({
  children,
  id,
  url,
  createAnalyticsEvent,
}) => {
  const analyticsHandler = useCallback(
    (analyticsPayload: AnalyticsPayload) => {
      fireSmartLinkEvent(analyticsPayload, createAnalyticsEvent);
    },
    [createAnalyticsEvent],
  );

  const delay = 300;
  const [isOpen, setIsOpen] = React.useState(false);
  const fadeOutTimeoutId = useRef<NodeJS.Timeout>();
  const fadeInTimeoutId = useRef<NodeJS.Timeout>();
  const cardOpenTime = useRef<number>();

  const linkState = useLinkState(url);
  const analytics = useSmartLinkAnalytics(url, analyticsHandler, id);
  const extensionKey = useMemo(() => getExtensionKey(linkState.details), [
    linkState,
  ]);
  const definitionId = useMemo(() => getDefinitionId(linkState.details), [
    linkState,
  ]);

  const initHideCard = useCallback(() => {
    if (fadeInTimeoutId.current) {
      clearTimeout(fadeInTimeoutId.current);
    }
    fadeOutTimeoutId.current = setTimeout(() => {
      //Check its previously open to avoid firing events when moving between the child and hover card components
      if (isOpen === true && cardOpenTime.current) {
        const hoverTime = Date.now() - cardOpenTime.current;
        analytics.ui.hoverCardDismissedEvent(
          'card',
          hoverTime,
          definitionId,
          extensionKey,
          'mouse_hover',
        );
      }
      setIsOpen(false);
    }, delay);
  }, [delay, isOpen, definitionId, extensionKey, analytics]);

  const initShowCard = useCallback(() => {
    if (fadeOutTimeoutId.current) {
      clearTimeout(fadeOutTimeoutId.current);
    }
    fadeInTimeoutId.current = setTimeout(() => {
      //Check if its previously closed to avoid firing events when moving between the child and hover card components
      if (isOpen === false) {
        cardOpenTime.current = Date.now();
        analytics.ui.hoverCardViewedEvent(
          'card',
          definitionId,
          extensionKey,
          'mouse_hover',
        );
      }
      setIsOpen(true);
    }, delay);
  }, [delay, isOpen, definitionId, extensionKey, analytics]);

  const linkActions = useSmartLinkActions({
    url,
    appearance: 'block',
    analyticsHandler,
  });

  const smartlinkActions = useMemo(
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

  const openAction = useMemo(() => {
    return {
      name: ActionName.CustomAction,
      icon: <ShortcutIcon label="open in new tab" size="medium" />,
      iconPosition: 'before',
      onClick: () => {
        window.open(url, '_blank');
        analytics.ui.hoverCardOpenLinkClickedEvent(
          'card',
          definitionId,
          extensionKey,
        );
      },
      testId: 'hover-card-open-button',
    } as CustomActionItem;
  }, [url, definitionId, extensionKey, analytics]);

  const CardComponent = ({ update }: { update: () => void }) => {
    //TODO: EDM-3224 deleted simulated and use real JsonLd
    const metadataElements = extractMetadata(
      getSimulatedMetadata(extensionKey),
    );

    const linkData = linkState.details?.data as JsonLd.Data.BaseData;
    const content = extractPreview(linkData) ? (
      <PreviewBlock />
    ) : (
      <SnippetBlock />
    );

    return (
      <div
        onMouseEnter={initShowCard}
        onMouseLeave={initHideCard}
        css={HoverCardContainer}
      >
        <Card
          id={id}
          appearance="block"
          url={url}
          ui={{
            hideElevation: true,
            size: SmartLinkSize.Large,
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            theme: SmartLinkTheme.Black,
          }}
          onResolve={update}
        >
          <TitleBlock actions={[openAction]} />
          <MetadataBlock
            primary={metadataElements.primary}
            secondary={metadataElements.secondary}
          />
          {content}
          <FooterBlock actions={smartlinkActions} />
        </Card>
      </div>
    );
  };

  const onClose = useCallback(() => setIsOpen(false), []);

  return (
    <Popup
      testId="hover-card"
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      content={({ update }) => {
        return <CardComponent update={update} />;
      }}
      trigger={(triggerProps) => (
        <span
          {...triggerProps}
          onMouseEnter={initShowCard}
          onMouseLeave={initHideCard}
        >
          {children}
        </span>
      )}
      zIndex={501} // Temporary fix for Confluence inline comment on editor mod has z-index of 500
    />
  );
};

export const HoverCard = withAnalyticsContext({
  source: 'smartLinkPreviewHoverCard',
})(withAnalyticsEvents()(HoverCardComponent));
