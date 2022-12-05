import { useFeatureFlag } from '@atlaskit/link-provider';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import { extractType } from '@atlaskit/linking-common/extractors';
import { JsonLd } from 'json-ld-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActionName,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../constants';
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
  SnippetBlock,
  TitleBlock,
} from '../../FlexibleCard/components/blocks';
import { TitleBlockProps } from '../../FlexibleCard/components/blocks/title-block/types';
import {
  ActionItem,
  CustomActionItem,
} from '../../FlexibleCard/components/blocks/types';
import { FlexibleCardProps } from '../../FlexibleCard/types';
import {
  flexibleUiOptions,
  footerBlockCss,
  metadataBlockCss,
  titleBlockCss,
  hiddenSnippetStyles,
} from '../styled';
import { HoverCardContentProps } from '../types';
import {
  toActionableMetadata,
  getSimulatedMetadata,
  SMART_CARD_ANALYTICS_DISPLAY,
} from '../utils';
import HoverCardLoadingView from './HoverCardLoadingView';
import SnippetOrPreview from './SnippetOrPreview';

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
  const showActionableElement = useFeatureFlag('enableActionableElement');

  const actions = useSmartCardActions(id, url, analytics);
  useEffect(() => {
    actions.loadMetadata();
  }, [actions]);

  useEffect(() => {
    // Since hover preview only render on resolved status,
    // there is no need to check for statuses.
    analytics.ui.renderSuccessEvent({
      display: SMART_CARD_ANALYTICS_DISPLAY,
      status: cardState.status,
    });
  }, [analytics.ui, cardState.status]);

  const extensionKey = useMemo(
    () => getExtensionKey(cardState.details),
    [cardState.details],
  );

  const onClick = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      const isModifierKeyPressed = isSpecialEvent(event);
      analytics.ui.cardClickedEvent({
        id,
        display: SMART_CARD_ANALYTICS_DISPLAY,
        status: cardState.status,
        isModifierKeyPressed,
        actionSubjectId: 'titleGoToLink',
      });
    },
    [cardState.status, analytics.ui, id],
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
  const { primary, secondary, subtitle } = useMemo(() => {
    const types = data ? extractType(data) : undefined;
    //TODO: EDM-3224 deleted simulated and use real JsonLd
    const metadata = extractMetadata(getSimulatedMetadata(extensionKey, types));

    const primary = showActionableElement
      ? toActionableMetadata(
          onActionClick,
          extensionKey,
          types,
          cardActions,
          metadata.primary,
        )
      : metadata.primary;

    return {
      primary,
      secondary: metadata.secondary,
      subtitle: metadata.subtitle,
    };
  }, [cardActions, data, extensionKey, onActionClick, showActionableElement]);

  const titleMaxLines = subtitle && subtitle.length > 0 ? 1 : 2;

  const snippetHeight = React.useRef<number>(0);
  const snippetBlockRef = useRef<HTMLDivElement>(null);
  const onSnippetRender = useCallback(() => {
    snippetHeight.current =
      snippetBlockRef.current?.getBoundingClientRect().height ?? 0;
  }, []);
  const body = SnippetOrPreview({
    data: data,
    snippetHeight: snippetHeight.current,
  });

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

  if (cardState.metadataStatus === 'pending') {
    return (
      <HoverCardLoadingView
        flexibleCardProps={flexibleCardProps}
        titleBlockProps={titleBlockProps}
      />
    );
  }

  // if metadataStatus is 'errored' simply render using data available (normal path)
  return (
    <FlexibleCard {...flexibleCardProps}>
      <TitleBlock {...titleBlockProps} />
      <MetadataBlock
        primary={primary}
        secondary={secondary}
        size={SmartLinkSize.Large}
        overrideCss={metadataBlockCss}
        maxLines={1}
      />
      {body}
      <SnippetBlock
        testId={'hidden-snippet'}
        onRender={onSnippetRender}
        blockRef={snippetBlockRef}
        overrideCss={hiddenSnippetStyles}
      />
      <FooterBlock
        actions={footerActions}
        size={SmartLinkSize.Large}
        overrideCss={footerBlockCss}
      />
    </FlexibleCard>
  );
};
export default HoverCardContent;
