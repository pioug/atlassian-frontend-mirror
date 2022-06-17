import React, { useCallback, useEffect, useMemo } from 'react';
import { JsonLd } from 'json-ld-types';

import { extractMetadata } from '../../../extractors/hover/extractMetadata';
import { getSimulatedMetadata, HOVER_CARD_ANALYTICS_DISPLAY } from '../utils';
import extractPreview from '../../../extractors/flexible/extract-preview';
import { ActionName, SmartLinkSize, SmartLinkTheme } from '../../../constants';
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

const flexibleUiOptions = {
  hideElevation: true,
  size: SmartLinkSize.Large,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  theme: SmartLinkTheme.Black,
};

const getOpenAction = (url: string, analytics: AnalyticsFacade): ActionItem =>
  ({
    name: ActionName.CustomAction,
    icon: <ShortcutIcon label="open in new tab" size="medium" />,
    iconPosition: 'before',
    onClick: () => {
      window.open(url, '_blank');
      analytics.ui.hoverCardOpenLinkClickedEvent('card');
    },
    testId: 'hover-card-open-button',
  } as CustomActionItem);

const toFooterActions = (cardActions: LinkAction[]): ActionItem[] =>
  cardActions.map(
    (action: LinkAction) =>
      ({
        content: action.text,
        name: ActionName.CustomAction,
        onClick: () => action.invoke(),
        testId: action.id,
      } as CustomActionItem),
  );

const HoverCardContent: React.FC<HoverCardContentProps> = ({
  analytics,
  cardActions = [],
  cardState,
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
      );
    },
    [cardState.status, analytics.ui],
  );

  const titleActions = useMemo(() => [getOpenAction(url, analytics)], [
    url,
    analytics,
  ]);

  const footerActions = useMemo(() => toFooterActions(cardActions), [
    cardActions,
  ]);

  //TODO: EDM-3224 deleted simulated and use real JsonLd
  const { primary, secondary } = extractMetadata(
    getSimulatedMetadata(extensionKey),
  );

  const data = cardState.details?.data as JsonLd.Data.BaseData;
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
      <TitleBlock actions={titleActions} />
      <MetadataBlock
        primary={primary}
        secondary={secondary}
        size={SmartLinkSize.Small}
      />
      {body}
      <FooterBlock actions={footerActions} />
    </FlexibleCard>
  );
};
export default HoverCardContent;
