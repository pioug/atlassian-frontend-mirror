/** @jsx jsx */
import { FC } from 'react';
import { BlockCardProps } from './types';
import { JsonLd } from 'json-ld-types';
import { token } from '@atlaskit/tokens';
import { getExtensionKey } from '../../state/helpers';
import { extractBlockProps } from '../../extractors/block';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';
import { ExtractBlockOpts } from '../../extractors/block/types';
import { extractRequestAccessContext } from '../../extractors/common/context';
import { CardLinkView } from '../LinkView';
import { AuthorizeAction } from './actions/AuthorizeAction';
import { ForbiddenAction } from './actions/ForbiddenAction';

import { ResolvedView as BlockCardResolvedView } from './views/ResolvedView';
import { NotFoundView as BlockCardNotFoundView } from './views/NotFoundView';
import { ResolvingView as BlockCardResolvingView } from './views/ResolvingView';
import { UnauthorizedView as BlockCardUnauthorisedView } from './views/UnauthorizedView';
import { ForbiddenView as BlockCardForbiddenView } from './views/ForbiddenView';
import { ErroredView as BlockCardErroredView } from './views/ErroredView';
import FlexibleResolvedView from './views/flexible/FlexibleResolvedView';
import FlexibleUnauthorisedView from './views/flexible/FlexibleUnauthorisedView';
import FlexibleNotFoundView from './views/flexible/FlexibleNotFoundView';
import FlexibleErroredView from './views/flexible/FlexibleErroredView';
import FlexibleForbiddenView from './views/flexible/FlexibleForbiddenView';
import { tokens } from '../../utils/token';
import { css, jsx } from '@emotion/react';
import { handleClickCommon } from './utils/handlers';
import { useFeatureFlag } from '@atlaskit/link-provider';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { AnchorTarget } from '../FlexibleCard/components/types';

export { default as PreviewAction } from './actions/PreviewAction';
export type { ResolvedViewProps as BlockCardResolvedViewProps } from './views/ResolvedView';

export {
  ForbiddenAction,
  AuthorizeAction,
  BlockCardResolvedView,
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  BlockCardForbiddenView,
  BlockCardErroredView,
  BlockCardNotFoundView,
};

const flexibleBlockCardElevationStyle = css`
  border-radius: 1.5px;
  box-shadow: ${tokens.elevation};
  margin: ${token('space.025', '2px')};
`;

export const BlockCard: FC<BlockCardProps> = ({
  id,
  url,
  cardState,
  authFlow,
  handleAuthorize,
  handleErrorRetry,
  handleFrameClick,
  handleInvoke,
  renderers,
  isSelected,
  onResolve,
  onError,
  testId,
  showActions,
  platform,
  analytics,
  enableFlexibleBlockCard,
  showServerActions,
}) => {
  const { status, details } = cardState;
  const data =
    ((details && details.data) as JsonLd.Data.BaseData) || getEmptyJsonLd();
  const meta = (details && details.meta) as JsonLd.Meta.BaseMeta;
  const extensionKey = getExtensionKey(details);
  const extractorOpts: ExtractBlockOpts = {
    analytics,
    origin: 'smartLinkCard',
    handleInvoke,
    extensionKey,
  };

  const enableImprovedPreviewAction = Boolean(
    useFeatureFlag('enableImprovedPreviewAction'),
  );

  if (enableFlexibleBlockCard) {
    const ui = { hideElevation: true };
    const anchorTarget: AnchorTarget | undefined = getBooleanFF(
      'platform.linking-platform.smart-card.enable-block-card-clicks-opening-in-same-tab',
    )
      ? '_self'
      : undefined;

    const flexibleProps = {
      id,
      cardState,
      url,
      testId,
      onClick: (event: React.MouseEvent) =>
        handleClickCommon(event, handleFrameClick),
      onError,
      onResolve,
      renderers,
      showServerActions,
      ui,
      analytics,
      extensionKey,
      ...(anchorTarget ? { anchorTarget } : {}),
    };
    switch (status) {
      case 'pending':
      case 'resolving':
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleResolvedView
              {...flexibleProps}
              testId={'smart-block-resolving-view'}
            />
          </div>
        );
      case 'resolved':
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleResolvedView {...flexibleProps} />
          </div>
        );
      case 'unauthorized':
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleUnauthorisedView
              {...flexibleProps}
              onAuthorize={handleAuthorize}
            />
          </div>
        );
      case 'forbidden':
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleForbiddenView
              {...flexibleProps}
              onAuthorize={handleAuthorize}
            />
          </div>
        );
      case 'not_found':
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleNotFoundView
              {...flexibleProps}
              onAuthorize={handleAuthorize}
            />
          </div>
        );
      case 'fallback':
      case 'errored':
      default:
        if (onError) {
          onError({ url, status });
        }
        if (authFlow && authFlow === 'disabled') {
          return (
            <CardLinkView
              link={url}
              isSelected={isSelected}
              onClick={handleFrameClick}
              testId={`${testId}-${status}`}
            />
          );
        }
        return (
          <div css={flexibleBlockCardElevationStyle}>
            <FlexibleErroredView
              {...flexibleProps}
              onAuthorize={handleAuthorize}
            />
          </div>
        );
    }
  }

  switch (status) {
    case 'pending':
    case 'resolving':
      return <BlockCardResolvingView testId={testId} isSelected={isSelected} />;
    case 'resolved':
      const resolvedViewProps = extractBlockProps(
        data,
        meta,
        extractorOpts,
        renderers,
        platform,
        enableImprovedPreviewAction,
      );
      if (onResolve) {
        onResolve({
          title: resolvedViewProps.title,
          url,
        });
      }
      return (
        <BlockCardResolvedView
          {...resolvedViewProps}
          isSelected={isSelected}
          testId={testId}
          showActions={showActions}
          onClick={handleFrameClick}
        />
      );
    case 'unauthorized':
      if (onError) {
        onError({ url, status });
      }

      const unauthorizedViewProps = extractBlockProps(
        data,
        meta,
        extractorOpts,
      );
      return (
        <BlockCardUnauthorisedView
          {...unauthorizedViewProps}
          isSelected={isSelected}
          testId={testId}
          showActions={showActions}
          actions={handleAuthorize ? [AuthorizeAction(handleAuthorize)] : []}
          onClick={handleFrameClick}
        />
      );
    case 'forbidden':
      if (onError) {
        onError({ url, status });
      }

      const forbiddenViewProps = extractBlockProps(data, meta, extractorOpts);
      const cardMetadata = details?.meta ?? getForbiddenJsonLd().meta;
      const requestAccessContext = extractRequestAccessContext({
        jsonLd: cardMetadata,
        url,
        context: forbiddenViewProps.context?.text,
      });
      return (
        <BlockCardForbiddenView
          {...forbiddenViewProps}
          isSelected={isSelected}
          showActions={showActions}
          actions={handleAuthorize ? [ForbiddenAction(handleAuthorize)] : []}
          onClick={handleFrameClick}
          requestAccessContext={requestAccessContext}
        />
      );
    case 'not_found':
      if (onError) {
        onError({ url, status });
      }

      const notFoundViewProps = extractBlockProps(data, meta, extractorOpts);
      return (
        <BlockCardNotFoundView
          {...notFoundViewProps}
          isSelected={isSelected}
          testId={testId}
          onClick={handleFrameClick}
        />
      );
    case 'fallback':
    case 'errored':
    default:
      if (onError) {
        onError({ url, status });
      }

      if (authFlow && authFlow === 'disabled') {
        return (
          <CardLinkView
            link={url}
            isSelected={isSelected}
            onClick={handleFrameClick}
            testId={`${testId}-${status}`}
          />
        );
      }
      return (
        <BlockCardErroredView
          link={url}
          isSelected={isSelected}
          onRetry={handleErrorRetry}
          onClick={handleFrameClick}
          testId={testId}
        />
      );
  }
};
