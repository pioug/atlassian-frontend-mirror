import React, { useCallback, useEffect, useMemo } from 'react';
import { JsonLd } from 'json-ld-types';

import { extractMetadata } from '../../../extractors/hover/extractMetadata';
import { getSimulatedMetadata, HOVER_CARD_ANALYTICS_DISPLAY } from '../utils';
import extractPreview from '../../../extractors/flexible/extract-preview';
import {
  ActionName,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkTheme,
} from '../../../constants';
import FlexibleCard from '../../FlexibleCard';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../FlexibleCard/components/blocks';
import { HoverCardContentProps } from '../types';
import { isSpecialEvent } from '../../../utils';
import { LinkAction } from '../../../state/hooks-external/useSmartLinkActions';
import {
  ActionItem,
  CustomActionItem,
} from '../../FlexibleCard/components/blocks/types';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { AnalyticsFacade } from '../../../state/analytics';
import { getExtensionKey } from '../../../state/helpers';
import { titleBlockCss, metadataBlockCss, footerBlockCss } from '../styled';
import { extractType } from '@atlaskit/linking-common/extractors';

const flexibleUiOptions = {
  hideElevation: true,
  size: SmartLinkSize.Medium,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  theme: SmartLinkTheme.Black,
  hidePadding: true,
};

const getOpenAction = (
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
      analytics.ui.hoverCardOpenLinkClickedEvent('card');
    },
    testId: 'hover-card-open-button',
  } as CustomActionItem);

const toFooterActions = (
  cardActions: LinkAction[],
  onActionClick?: (actionId: string) => void,
): ActionItem[] =>
  cardActions.map(
    (action: LinkAction) =>
      ({
        content: action.text,
        name: ActionName.CustomAction,
        onClick: () => {
          if (onActionClick) {
            onActionClick(action.id);
          }

          return action.invoke();
        },
        testId: action.id,
      } as CustomActionItem),
  );

const HoverCardContent: React.FC<HoverCardContentProps> = ({
  analytics,
  cardActions = [],
  cardState,
  onActionClick,
  onResolve,
  renderers,
  url,
}) => {
  useEffect(() => {
    // Since hover preview only render on resolved status,
    // there is no need to check for statuses.
    analytics.ui.renderSuccessEvent(
      HOVER_CARD_ANALYTICS_DISPLAY,
      cardState.status,
    );
  }, [analytics.ui, cardState.status]);

  const extensionKey = useMemo(() => getExtensionKey(cardState.details), [
    cardState.details,
  ]);

  const onClick = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      const isModifierKeyPressed = isSpecialEvent(event);
      analytics.ui.cardClickedEvent(
        undefined,
        HOVER_CARD_ANALYTICS_DISPLAY,
        cardState.status,
        undefined,
        undefined,
        isModifierKeyPressed,
        undefined,
        undefined,
        undefined,
        'titleGoToLink',
      );
    },
    [cardState.status, analytics.ui],
  );

  const titleActions = useMemo(
    () => [getOpenAction(url, analytics, onActionClick)],
    [url, analytics, onActionClick],
  );

  const footerActions = useMemo(
    () => toFooterActions(cardActions, onActionClick),
    [cardActions, onActionClick],
  );

  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const types = data ? extractType(data) : undefined;
  //TODO: EDM-3224 deleted simulated and use real JsonLd
  const { primary, secondary, subtitle } = extractMetadata(
    getSimulatedMetadata(extensionKey, types),
  );

  const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

  const body =
    data && extractPreview(data) ? <PreviewBlock /> : <SnippetBlock />;

  return (
    <FlexibleCard
      cardState={cardState}
      onClick={onClick}
      onResolve={onResolve}
      renderers={renderers}
      ui={flexibleUiOptions}
      url={url}
    >
      <TitleBlock
        actions={titleActions}
        maxLines={titleMaxLines}
        overrideCss={titleBlockCss}
        size={SmartLinkSize.Large}
        position={SmartLinkPosition.Center}
        subtitle={subtitle}
      />
      <MetadataBlock
        primary={primary}
        secondary={secondary}
        size={SmartLinkSize.Large}
        overrideCss={metadataBlockCss}
        maxLines={1}
      />
      {body}
      <FooterBlock
        actions={footerActions}
        size={SmartLinkSize.Large}
        overrideCss={footerBlockCss}
      />
    </FlexibleCard>
  );
};
export default HoverCardContent;
