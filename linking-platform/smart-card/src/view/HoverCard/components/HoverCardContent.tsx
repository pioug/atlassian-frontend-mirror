/** @jsx jsx */
import { jsx } from '@emotion/react';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { CardState } from '../../../state/types';
import { JsonLd } from 'json-ld-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActionName,
  CardDisplay,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../constants';
import { extractMetadata } from '../../../extractors/hover/extractMetadata';
import { AnalyticsFacade } from '../../../state/analytics';
import { getExtensionKey } from '../../../state/helpers';
import { isSpecialEvent } from '../../../utils';
import { TitleBlockProps } from '../../FlexibleCard/components/blocks/title-block/types';
import {
  ActionItem,
  CustomActionItem,
} from '../../FlexibleCard/components/blocks/types';
import { FlexibleCardProps } from '../../FlexibleCard/types';
import {
  HoverCardContainer,
  flexibleUiOptions,
  titleBlockCss,
} from '../styled';
import { HoverCardContentProps } from '../types';
import { getSimulatedMetadata } from '../utils';
import HoverCardLoadingView from './views/resolving';
import HoverCardUnauthorisedView from './views/unauthorised';
import HoverCardResolvedView from './views/resolved';
import { FormattedMessage } from 'react-intl-next';
import { messages } from '../../../messages';
import { useSmartCardActions } from '../../../state/actions';
import { fireLinkClickedEvent } from '../../../utils/analytics/click';

export const hoverCardClassName = 'smart-links-hover-preview';

export const getOpenAction = (
  url: string,
  analytics: AnalyticsFacade,
  onActionClick?: (actionId: string) => void,
): ActionItem =>
  ({
    name: ActionName.CustomAction,
    icon: <ShortcutIcon label="open in new tab" size="medium" />,
    iconPosition: 'before',
    onClick: () => {
      if (onActionClick) {
        onActionClick('open-content');
      }
      window.open(url, '_blank');
      analytics.ui.hoverCardOpenLinkClickedEvent({ previewDisplay: 'card' });
    },
    tooltipMessage: <FormattedMessage {...messages.open_link_in_a_new_tab} />,
    testId: 'hover-card-open-button',
  } as CustomActionItem);

export const getCopyAction = (url: string): ActionItem =>
  ({
    name: ActionName.CustomAction,
    icon: <CopyIcon label="copy url" size="medium" />,
    iconPosition: 'before',
    onClick: async () => await navigator.clipboard.writeText(url),
    tooltipMessage: <FormattedMessage {...messages.copy_url_to_clipboard} />,
    testId: 'hover-card-copy-button',
  } as CustomActionItem);

const HoverCardContent: React.FC<HoverCardContentProps> = ({
  id = '',
  analytics,
  cardActions = [],
  cardState,
  onActionClick,
  onResolve,
  renderers,
  url,
  onMouseEnter,
  onMouseLeave,
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const extensionKey = useMemo(
    () => getExtensionKey(cardState.details),
    [cardState.details],
  );
  const actions = useSmartCardActions(id, url, analytics);

  useEffect(() => {
    actions.loadMetadata();
  }, [actions]);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      const isModifierKeyPressed = isSpecialEvent(event);
      analytics.ui.cardClickedEvent({
        id,
        display: CardDisplay.HoverCardPreview,
        status: cardState.status,
        isModifierKeyPressed,
        actionSubjectId: 'titleGoToLink',
      });

      fireLinkClickedEvent(createAnalyticsEvent)(event);
    },
    [createAnalyticsEvent, cardState.status, analytics.ui, id],
  );

  const titleActions = useMemo(
    () => [getCopyAction(url), getOpenAction(url, analytics, onActionClick)],
    [url, analytics, onActionClick],
  );

  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const { subtitle } = extractMetadata(
    getSimulatedMetadata(extensionKey, data),
  );

  const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

  const titleBlockProps: TitleBlockProps = {
    actions: titleActions,
    maxLines: titleMaxLines,
    overrideCss: titleBlockCss,
    size: SmartLinkSize.Large,
    position: SmartLinkPosition.Center,
    subtitle: subtitle,
  };

  const flexibleCardProps: FlexibleCardProps = {
    cardState: cardState,
    onClick: onClick,
    onResolve: onResolve,
    renderers: renderers,
    ui: flexibleUiOptions,
    url: url,
    children: {},
  };

  const onClickStopPropagation = useCallback((e) => e.stopPropagation(), []);

  const getCardView = (cardState: CardState) => {
    if (cardState.metadataStatus === 'pending') {
      return (
        <HoverCardLoadingView
          flexibleCardProps={flexibleCardProps}
          titleBlockProps={titleBlockProps}
        />
      );
    }

    if (cardState.status === 'unauthorized') {
      return (
        <HoverCardUnauthorisedView
          analytics={analytics}
          extensionKey={extensionKey}
          id={id}
          flexibleCardProps={flexibleCardProps}
          url={url}
        />
      );
    }

    if (cardState.status === 'resolved') {
      return (
        <HoverCardResolvedView
          id={id}
          url={url}
          extensionKey={extensionKey}
          analytics={analytics}
          cardActions={cardActions}
          cardState={cardState}
          flexibleCardProps={flexibleCardProps}
          onActionClick={onActionClick}
          titleBlockProps={titleBlockProps}
        />
      );
    }
    return null;
  };

  const cardView = getCardView(cardState);
  return cardView ? (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClickStopPropagation}
      className={hoverCardClassName}
      css={HoverCardContainer}
    >
      {cardView}
    </div>
  ) : null;
};
export default HoverCardContent;
