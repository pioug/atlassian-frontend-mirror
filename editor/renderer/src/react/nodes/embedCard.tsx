import React, { useMemo, useContext, useState, useRef } from 'react';
import {
  Card,
  Context as CardContext,
  EmbedResizeMessageListener,
} from '@atlaskit/smart-card';
import {
  EventHandlers,
  WidthConsumer,
  mapBreakpointToLayoutMaxWidth,
  UnsupportedBlock,
  MediaSingle as UIMediaSingle,
} from '@atlaskit/editor-common';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  DEFAULT_EMBED_CARD_HEIGHT,
  DEFAULT_EMBED_CARD_WIDTH,
  getAkEditorFullPageMaxWidth,
} from '@atlaskit/editor-shared-styles';
import { RichMediaLayout } from '@atlaskit/adf-schema';

import { getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';

import styled from 'styled-components';
import { RendererAppearance } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';
import { getCardClickHandler } from '../utils/getCardClickHandler';

const EmbedCardWrapper = styled.div`
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
EmbedCardWrapper.displayName = 'EmbedCardWrapper';

const ExtendedEmbedCard = styled(UIMediaSingle)`
  ${({ layout }) =>
    layout === 'full-width' || layout === 'wide'
      ? `
  margin-left: 50%;
  transform: translateX(-50%);
  `
      : ``}
`;
ExtendedEmbedCard.displayName = 'ExtendedEmbedCard';

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
  allowDynamicTextSizing?: boolean;
}) {
  const {
    url,
    data,
    eventHandlers,
    portal,
    layout,
    width,
    isInsideOfBlockNode,
    allowDynamicTextSizing,
    rendererAppearance,
  } = props;
  const embedIframeRef = useRef(null);
  const onClick = getCardClickHandler(eventHandlers, url);

  const platform = useMemo(() => getPlatform(rendererAppearance), [
    rendererAppearance,
  ]);
  const cardProps = {
    url,
    data,
    onClick,
    container: portal,
    platform,
    showActions: platform === 'web',
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

  const cardContext = useContext(CardContext);

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

  return (
    <WidthConsumer>
      {({ width: containerWidth, breakpoint }) => {
        let nonFullWidthSize = containerWidth;
        const isFullWidth = rendererAppearance === 'full-width';
        if (!isInsideOfBlockNode && rendererAppearance !== 'comment') {
          const isContainerSizeGreaterThanMaxFullPageWidth =
            containerWidth - padding >= akEditorDefaultLayoutWidth;

          if (
            isContainerSizeGreaterThanMaxFullPageWidth &&
            allowDynamicTextSizing
          ) {
            nonFullWidthSize = mapBreakpointToLayoutMaxWidth(breakpoint);
          } else if (isContainerSizeGreaterThanMaxFullPageWidth) {
            nonFullWidthSize = getAkEditorFullPageMaxWidth(
              allowDynamicTextSizing,
            );
          } else {
            nonFullWidthSize = containerWidth - padding;
          }
        }

        const lineLength = isFullWidth
          ? Math.min(akEditorFullWidthLayoutWidth, containerWidth - padding)
          : nonFullWidthSize;

        return (
          <CardErrorBoundary
            unsupportedComponent={UnsupportedBlock}
            {...cardProps}
          >
            <EmbedResizeMessageListener
              embedIframeRef={embedIframeRef}
              onHeightUpdate={setLiveHeight}
            >
              <ExtendedEmbedCard
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
                <EmbedCardWrapper>
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
                    />
                  </div>
                </EmbedCardWrapper>
              </ExtendedEmbedCard>
            </EmbedResizeMessageListener>
          </CardErrorBoundary>
        );
      }}
    </WidthConsumer>
  );
}
