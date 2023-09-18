/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useMemo, useContext, useState, useRef } from 'react';
import { Card, EmbedResizeMessageListener } from '@atlaskit/smart-card';
import { SmartCardContext } from '@atlaskit/link-provider';
import type { SmartLinksOptions } from '../../types/smartLinksOptions';

import {
  WidthConsumer,
  UnsupportedBlock,
  MediaSingle as UIMediaSingle,
} from '@atlaskit/editor-common/ui';

import type { EventHandlers } from '@atlaskit/editor-common/ui';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  DEFAULT_EMBED_CARD_HEIGHT,
  DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';
import type { RichMediaLayout } from '@atlaskit/adf-schema';

import { getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';

import type { RendererAppearance } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { getCardClickHandler } from '../utils/getCardClickHandler';
import { AnalyticsContext } from '@atlaskit/analytics-next';

const embedCardWrapperStyles = css`
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }

  .loader-wrapper {
    height: 100%;
  }

  margin: 0 auto;
`;

const uIMediaSingleLayoutStyles = css`
  margin-left: 50%;
  transform: translateX(-50%);
`;

export default function EmbedCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
  portal?: HTMLElement;
  originalHeight?: number;
  originalWidth?: number;
  width?: number;
  layout: RichMediaLayout;
  rendererAppearance?: RendererAppearance;
  isInsideOfBlockNode?: boolean;
  smartLinks?: SmartLinksOptions;
}) {
  const {
    url,
    data,
    eventHandlers,
    portal,
    layout,
    width,
    isInsideOfBlockNode,
    rendererAppearance,
    smartLinks,
  } = props;
  const embedIframeRef = useRef(null);
  const onClick = getCardClickHandler(eventHandlers, url);

  const platform = useMemo(
    () => getPlatform(rendererAppearance),
    [rendererAppearance],
  );
  const cardProps = {
    url,
    data,
    onClick,
    container: portal,
    platform,
    showActions: platform === 'web',
    frameStyle: smartLinks?.frameStyle,
  };

  const [liveHeight, setLiveHeight] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>();

  const height = liveHeight || props.originalHeight;

  // We start with height and width defined with default values
  let originalHeight = DEFAULT_EMBED_CARD_HEIGHT;
  let originalWidth: number | undefined = DEFAULT_EMBED_CARD_WIDTH;

  // Then can override height and width with values from ADF if available
  if (props.originalHeight && props.originalWidth) {
    originalHeight = props.originalHeight;
    originalWidth = props.originalWidth;
  }

  // Then we can override it with aspectRatio that is comming from iframely via `resolve()`
  if (aspectRatio) {
    originalHeight = 1;
    originalWidth = aspectRatio;
  }

  // And finally if iframe sends live `height` events we use that as most precise measure.
  const isHeightOnlyMode =
    !(props.originalHeight && props.originalWidth) || liveHeight;
  if (height && isHeightOnlyMode) {
    originalHeight = height;
    originalWidth = undefined;
  }

  const padding = rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;

  const [hasPreview, setPreviewAvailableState] = useState(true);

  const cardContext = useContext(SmartCardContext);

  const onResolve = ({
    aspectRatio: resolvedAspectRatio,
  }: {
    aspectRatio?: number;
  }) => {
    const hasPreviewOnResolve = !!(
      cardContext &&
      url &&
      cardContext.extractors.getPreview(url, platform)
    );
    if (!hasPreviewOnResolve) {
      setPreviewAvailableState(false);
    }
    setAspectRatio(resolvedAspectRatio);
  };

  const analyticsData = {
    attributes: {
      location: 'renderer',
    },
    // Below is added for the future implementation of Linking Platform namespaced analytic context
    location: 'renderer',
  };

  return (
    <AnalyticsContext data={analyticsData}>
      <WidthConsumer>
        {({ width: containerWidth, breakpoint }) => {
          let nonFullWidthSize = containerWidth;
          const isFullWidth = rendererAppearance === 'full-width';
          if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
            const isContainerSizeGreaterThanMaxFullPageWidth =
              containerWidth - padding >= akEditorDefaultLayoutWidth;

            if (isContainerSizeGreaterThanMaxFullPageWidth) {
              nonFullWidthSize = akEditorDefaultLayoutWidth;
            } else {
              nonFullWidthSize = containerWidth - padding;
            }
          }

          const lineLength = isFullWidth
            ? Math.min(akEditorFullWidthLayoutWidth, containerWidth - padding)
            : nonFullWidthSize;

          const uiMediaSingleStyles =
            layout === 'full-width' || layout === 'wide'
              ? uIMediaSingleLayoutStyles
              : '';

          const onError = ({ err }: { err?: Error }) => {
            if (err) {
              throw err;
            }
          };

          return (
            <CardErrorBoundary
              unsupportedComponent={UnsupportedBlock}
              {...cardProps}
            >
              <EmbedResizeMessageListener
                embedIframeRef={embedIframeRef}
                onHeightUpdate={setLiveHeight}
              >
                <UIMediaSingle
                  css={uiMediaSingleStyles}
                  layout={layout}
                  width={originalWidth}
                  containerWidth={containerWidth}
                  pctWidth={width}
                  height={originalHeight}
                  fullWidthMode={isFullWidth}
                  nodeType="embedCard"
                  lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
                  hasFallbackContainer={hasPreview}
                >
                  <div css={embedCardWrapperStyles}>
                    <div
                      className="embedCardView-content-wrap"
                      data-embed-card
                      data-layout={layout}
                      data-width={width}
                      data-card-data={data ? JSON.stringify(data) : undefined}
                      data-card-url={url}
                      data-card-original-height={originalHeight}
                    >
                      <Card
                        appearance="embed"
                        {...cardProps}
                        onResolve={onResolve}
                        inheritDimensions={true}
                        embedIframeRef={embedIframeRef}
                        onError={onError}
                      />
                    </div>
                  </div>
                </UIMediaSingle>
              </EmbedResizeMessageListener>
            </CardErrorBoundary>
          );
        }}
      </WidthConsumer>
    </AnalyticsContext>
  );
}
