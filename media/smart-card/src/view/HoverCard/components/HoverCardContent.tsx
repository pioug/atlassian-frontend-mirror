import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { extractType } from '@atlaskit/linking-common/extractors';
import { JsonLd } from 'json-ld-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActionName,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../constants';
import extractPreview from '../../../extractors/flexible/extract-preview';
import { extractMetadata } from '../../../extractors/hover/extractMetadata';
import { useSmartCardActions } from '../../../state/actions';
import { AnalyticsFacade } from '../../../state/analytics';
import { getExtensionKey } from '../../../state/helpers';
import { LinkAction } from '../../../state/hooks-external/useSmartLinkActions';
import { isSpecialEvent } from '../../../utils';
import FlexibleCard from '../../FlexibleCard';
import {
  FooterBlock,
  MetadataBlock,
  PreviewBlock,
  SnippetBlock,
  TitleBlock,
} from '../../FlexibleCard/components/blocks';
import {
  ActionItem,
  CustomActionItem,
} from '../../FlexibleCard/components/blocks/types';
import {
  flexibleUiOptions,
  footerBlockCss,
  metadataBlockCss,
  titleBlockCss,
} from '../styled';
import { HoverCardContentProps } from '../types';
import { getSimulatedMetadata, SMART_CARD_ANALYTICS_DISPLAY } from '../utils';

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
      analytics.ui.hoverCardOpenLinkClickedEvent('card');
    },
    testId: 'hover-card-open-button',
  } as CustomActionItem);

export const toFooterActions = (
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
  id = '',
  analytics,
  cardActions = [],
  cardState,
  onActionClick,
  onResolve,
  renderers,
  url,
}) => {
  const actions = useSmartCardActions(id, url, analytics);
  useEffect(() => {
    actions.loadMetadata();
  }, [actions]);

  useEffect(() => {
    // Since hover preview only render on resolved status,
    // there is no need to check for statuses.
    analytics.ui.renderSuccessEvent(
      SMART_CARD_ANALYTICS_DISPLAY,
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
        SMART_CARD_ANALYTICS_DISPLAY,
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
