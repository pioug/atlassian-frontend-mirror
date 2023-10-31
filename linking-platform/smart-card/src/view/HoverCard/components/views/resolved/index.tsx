import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { JsonLd } from 'json-ld-types';
import {
  ActionItem,
  NamedDataActionItem,
} from '../../../../FlexibleCard/components/blocks/types';
import {
  ActionName,
  CardDisplay,
  SmartLinkPosition,
  SmartLinkSize,
} from '../../../../../constants';
import {
  FooterBlock,
  MetadataBlock,
  RelatedUrlsBlock,
  SnippetBlock,
  TitleBlock,
} from '../../../../FlexibleCard/components/blocks';
import {
  footerBlockCss,
  hiddenSnippetStyles,
  metadataBlockCss,
} from './styled';
import FlexibleCard from '../../../../FlexibleCard';
import {
  getSimulatedMetadata,
  getSimulatedBetterMetadata,
} from '../../../utils';
import { LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { CustomActionItem } from '../../../../FlexibleCard/components/blocks/types';
import ImagePreview from '../../ImagePreview';
import {
  extractMetadata,
  elementNamesToItems,
} from '../../../../../extractors/hover/extractMetadata';
import { HoverCardResolvedProps } from './types';
import { messages } from '../../../../../messages';
import { FormattedMessage } from 'react-intl-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { getCanBeDatasource } from '../../../../../state/helpers';

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

const HoverCardResolvedView: React.FC<HoverCardResolvedProps> = ({
  flexibleCardProps,
  titleBlockProps,
  analytics,
  cardState,
  cardActions = [],
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
  const { topPrimary, topSecondary, bottomPrimary } = useMemo(() => {
    if (
      getBooleanFF(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      )
    ) {
      const betterMetadata = getSimulatedBetterMetadata(extensionKey, data);
      return {
        topPrimary: elementNamesToItems(
          betterMetadata.topMetadataBlock.primary,
        ),
        topSecondary: elementNamesToItems(
          betterMetadata.topMetadataBlock.secondary,
        ),
        bottomPrimary: elementNamesToItems(
          betterMetadata.bottomMetadataBlock.primary,
        ),
      };
    }

    const metadata = extractMetadata(getSimulatedMetadata(extensionKey, data));
    return {
      topPrimary: metadata.primary,
      topSecondary: metadata.secondary,
      bottomPrimary: [],
    };
  }, [data, extensionKey]);

  const snippetHeight = React.useRef<number>(0);
  const snippetBlockRef = useRef<HTMLDivElement>(null);
  const onSnippetRender = useCallback(() => {
    snippetHeight.current =
      snippetBlockRef.current?.getBoundingClientRect().height ?? 0;
  }, []);

  const imagePreview = ImagePreview({
    data: data,
    fallbackElementHeight: snippetHeight.current,
  });

  return (
    <FlexibleCard {...flexibleCardProps}>
      {getBooleanFF(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      ) && imagePreview}
      <TitleBlock
        {...titleBlockProps}
        metadataPosition={SmartLinkPosition.Top}
      />
      <MetadataBlock
        primary={topPrimary}
        secondary={topSecondary}
        overrideCss={metadataBlockCss}
        maxLines={1}
        size={SmartLinkSize.Large}
        {...(getBooleanFF(
          'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
        ) && { size: SmartLinkSize.Medium })}
      />
      {!imagePreview && <SnippetBlock />}
      {!getBooleanFF(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      ) && imagePreview}

      <SnippetBlock
        testId={'hidden-snippet'}
        onRender={onSnippetRender}
        blockRef={snippetBlockRef}
        overrideCss={hiddenSnippetStyles}
      />
      {getBooleanFF(
        'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
      ) && (
        <MetadataBlock
          primary={bottomPrimary}
          size={SmartLinkSize.Large}
          overrideCss={metadataBlockCss}
          maxLines={1}
        />
      )}
      {getBooleanFF(
        'platform.linking-platform.smart-card.enable-hover-card-related-urls',
      ) && <RelatedUrlsBlock url={url} size={SmartLinkSize.Small} />}
      <FooterBlock
        actions={footerActions}
        size={SmartLinkSize.Large}
        overrideCss={footerBlockCss}
      />
    </FlexibleCard>
  );
};

export default HoverCardResolvedView;
