import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { JsonLd } from 'json-ld-types';
import { useFeatureFlag } from '@atlaskit/link-provider';
import { extractType } from '@atlaskit/linking-common/extractors';
import { ActionItem } from '../../../../FlexibleCard/components/blocks/types';
import {
  ActionName,
  CardDisplay,
  SmartLinkSize,
} from '../../../../../constants';
import {
  FooterBlock,
  MetadataBlock,
  SnippetBlock,
  TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import {
  footerBlockCss,
  hiddenSnippetStyles,
  metadataBlockCss,
} from './styled';
import FlexibleCard from '../../../../FlexibleCard';
import { useSmartCardActions } from '../../../../../state/actions';
import { getSimulatedMetadata, toActionableMetadata } from '../../../utils';
import { LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { CustomActionItem } from '../../../../FlexibleCard/components/blocks/types';
import SnippetOrPreview from '../../SnippetOrPreview';
import { extractMetadata } from '../../../../../extractors/hover/extractMetadata';
import { HoverCardResolvedProps } from './types';

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

const HoverCardResolvedView: React.FC<HoverCardResolvedProps> = ({
  flexibleCardProps,
  titleBlockProps,
  analytics,
  id = '',
  url,
  cardState,
  cardActions = [],
  onActionClick,
  extensionKey,
}) => {
  const showActionableElement = useFeatureFlag('enableActionableElement');
  const actions = useSmartCardActions(id, url, analytics);

  useEffect(() => {
    actions.loadMetadata();
  }, [actions]);

  useEffect(() => {
    // Since this hover view is only rendered on resolved status,
    // there is no need to check for statuses.
    analytics.ui.renderSuccessEvent({
      display: CardDisplay.HoverCardPreview,
      status: cardState.status,
    });
  }, [analytics.ui, cardState.status]);

  const footerActions = useMemo(
    () => toFooterActions(cardActions, onActionClick),
    [cardActions, onActionClick],
  );

  const data = cardState.details?.data as JsonLd.Data.BaseData;

  const { primary, secondary } = useMemo(() => {
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

export default HoverCardResolvedView;
