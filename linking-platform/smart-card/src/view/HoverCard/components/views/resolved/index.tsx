import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { JsonLd } from 'json-ld-types';
import {
  ActionItem,
  NamedDataActionItem,
} from '../../../../FlexibleCard/components/blocks/types';
import {
  ActionName,
  CardDisplay,
  ElementName,
  SmartLinkPosition,
  SmartLinkSize,
  SmartLinkDirection,
} from '../../../../../constants';
import {
  FooterBlock,
  MetadataBlock,
  RelatedUrlsBlock,
  SnippetBlock,
  TitleBlock,
  AISummaryBlock,
  CustomBlock,
} from '../../../../FlexibleCard/components/blocks';
import {
  footerBlockCss,
  hiddenSnippetStyles,
  metadataBlockCss,
} from './styled';
import FlexibleCard from '../../../../FlexibleCard';
import { getSimulatedBetterMetadata } from '../../../utils';
import { LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import {
  CustomActionItem,
  ElementItem,
} from '../../../../FlexibleCard/components/blocks/types';
import ImagePreview from '../../ImagePreview';
import { elementNamesToItems } from '../../../../../extractors/hover/extractMetadata';
import { HoverCardResolvedProps } from './types';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { getCanBeDatasource } from '../../../../../state/helpers';
import { useAISummary } from '../../../../../state/hooks/use-ai-summary';
import { extractLink } from '@atlaskit/link-extractors';

import { SmartLinkStatus } from '../../../../../constants';

export const toFooterActions = (
  cardActions: LinkAction[],
  onActionClick?: (actionId: string) => void,
): ActionItem[] => {
  const followAction: NamedDataActionItem = {
    hideIcon: true,
    name: ActionName.FollowAction,
  };

  const actions = cardActions.map((action: LinkAction) => {
    if (action.id === 'preview-content') {
      return {
        content: <FormattedMessage {...messages.preview_improved} />,
        name: ActionName.CustomAction,
        onClick: () => {
          if (onActionClick) {
            onActionClick(action.id);
          }
          return action.invoke();
        },
        testId: action.id,
        appearance: 'primary',
      } as CustomActionItem;
    }

    return {
      content: action.text,
      name: ActionName.CustomAction,
      onClick: () => {
        if (onActionClick) {
          onActionClick(action.id);
        }
        return action.invoke();
      },
      testId: action.id,
    } as CustomActionItem;
  });

  return [followAction, ...actions];
};

//This component encapsulates useAISummary hook under the AI Summary FF 'platform.linking-platform.smart-card.hover-card-ai-summaries'
const ConnectedAIBlock = ({
  bottomPrimary,
  imagePreview,
  url,
}: {
  bottomPrimary: ElementItem[];
  imagePreview: boolean;
  url: string;
}) => {
  const {
    state: { status, content },
  } = useAISummary({ url });

  const showData =
    status === 'ready' ||
    status === 'error' ||
    // Description & bottom metadata should only disappear when we start getting summary content
    (!content && status === 'loading');

  return showData ? (
    <>
      {!imagePreview && (
        <SnippetBlock
          testId={'connected-AI'}
          status={SmartLinkStatus.Resolved}
        />
      )}
      <MetadataBlock
        primary={bottomPrimary}
        size={SmartLinkSize.Large}
        overrideCss={metadataBlockCss}
        maxLines={1}
        status={SmartLinkStatus.Resolved}
      />
    </>
  ) : null;
};

const HoverCardResolvedView: React.FC<HoverCardResolvedProps> = ({
  flexibleCardProps,
  titleBlockProps,
  analytics,
  cardState,
  cardActions = [],
  isAISummaryEnabled,
  onActionClick,
  extensionKey,
  url,
}) => {
  const canBeDatasource = getCanBeDatasource(cardState.details);
  useEffect(() => {
    // Since this hover view is only rendered on resolved status,
    // there is no need to check for statuses.
    analytics.ui.renderSuccessEvent({
      display: CardDisplay.HoverCardPreview,
      status: cardState.status,
      canBeDatasource,
    });
  }, [analytics.ui, cardState.status, canBeDatasource]);

  const footerActions = useMemo(
    () => toFooterActions(cardActions, onActionClick),
    [cardActions, onActionClick],
  );

  const data = cardState.details?.data as JsonLd.Data.BaseData;
  const dataUrl = extractLink(data) ?? '';

  const { topPrimary, topSecondary, bottomPrimary } = useMemo(() => {
    const betterMetadata = getSimulatedBetterMetadata(extensionKey, data);
    return {
      topPrimary: elementNamesToItems(betterMetadata.topMetadataBlock.primary),
      topSecondary: elementNamesToItems(
        betterMetadata.topMetadataBlock.secondary,
      ),
      bottomPrimary: elementNamesToItems(
        betterMetadata.bottomMetadataBlock.primary,
      ),
    };
  }, [data, extensionKey]);

  const snippetHeight = React.useRef<number>(0);
  const snippetBlockRef = useRef<HTMLDivElement>(null);
  const onSnippetRender = useCallback(() => {
    snippetHeight.current =
      snippetBlockRef.current?.getBoundingClientRect().height ?? 0;
  }, []);

  // We want to maintain the height of the HoverCard while summarizing and pass this height to the AISummaryBlock.
  // This approach will prevent any abrupt changes in the height of the HoverCard.
  const connectedAIBlockHeight = React.useRef<number>(0);
  const connectedAIBlockRef = useRef<HTMLDivElement>(null);
  const onConnectedAIBlockRender = useCallback(() => {
    connectedAIBlockHeight.current =
      connectedAIBlockRef.current?.getBoundingClientRect().height ?? 0;
  }, []);

  const imagePreview = ImagePreview({
    data: data,
    fallbackElementHeight: snippetHeight.current,
  });

  return (
    <FlexibleCard {...flexibleCardProps}>
      {imagePreview}
      <TitleBlock
        {...titleBlockProps}
        metadataPosition={SmartLinkPosition.Top}
      />
      <MetadataBlock
        primary={topPrimary}
        secondary={topSecondary}
        overrideCss={metadataBlockCss}
        maxLines={1}
        size={SmartLinkSize.Medium}
      />
      {/* The isAISummaryEnabled setting depends on the status of the feature flag (FF) 'platform.linking-platform.smart-card.hover-card-ai-summaries'.
      It will always be false if this FF is disabled. */}
      {isAISummaryEnabled && (
        // All custom elements should be contained within a CustomBlock.
        // Flex Container components check whether the direct child is a flex blocks. It removes anything that isn't
        <CustomBlock
          direction={SmartLinkDirection.Vertical}
          onRender={onConnectedAIBlockRender}
          blockRef={connectedAIBlockRef}
        >
          <ConnectedAIBlock
            imagePreview={!!imagePreview}
            url={dataUrl}
            bottomPrimary={bottomPrimary}
          />
        </CustomBlock>
      )}
      {!isAISummaryEnabled && !imagePreview && (
        <SnippetBlock status={SmartLinkStatus.Resolved} />
      )}
      <SnippetBlock
        testId={'hidden-snippet'}
        onRender={onSnippetRender}
        blockRef={snippetBlockRef}
        overrideCss={hiddenSnippetStyles}
      />
      {!isAISummaryEnabled && (
        <MetadataBlock
          primary={bottomPrimary}
          size={SmartLinkSize.Large}
          overrideCss={metadataBlockCss}
          maxLines={1}
          status={SmartLinkStatus.Resolved}
        />
      )}
      {getBooleanFF(
        'platform.linking-platform.smart-card.enable-hover-card-related-urls',
      ) && <RelatedUrlsBlock url={url} size={SmartLinkSize.Small} />}
      {isAISummaryEnabled ? (
        <AISummaryBlock
          metadata={[{ name: ElementName.Provider }]}
          actions={footerActions}
          aiSummaryMinHeight={connectedAIBlockHeight.current}
        />
      ) : (
        <FooterBlock
          actions={footerActions}
          size={SmartLinkSize.Large}
          overrideCss={footerBlockCss}
        />
      )}
    </FlexibleCard>
  );
};

export default HoverCardResolvedView;
