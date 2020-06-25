import React, { useMemo } from 'react';
import { Card } from '@atlaskit/smart-card';
import {
  EventHandlers,
  WidthConsumer,
  akEditorDefaultLayoutWidth,
  mapBreakpointToLayoutMaxWidth,
  akEditorFullWidthLayoutWidth,
  UnsupportedBlock,
  MediaSingle as UIMediaSingle,
  DEFAULT_EMBED_CARD_HEIGHT,
  DEFAULT_EMBED_CARD_WIDTH,
  getAkEditorFullPageMaxWidth,
} from '@atlaskit/editor-common';
import { RichMediaLayout } from '@atlaskit/adf-schema';

import { getEventHandler, getPlatform } from '../../utils';
import { CardErrorBoundary } from './fallback';

import styled from 'styled-components';
import { RendererAppearance } from '../../ui/Renderer/types';
import { FullPagePadding } from '../../ui/Renderer/style';

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

const ExtendedEmbedCard = styled(UIMediaSingle)`
  ${({ layout }) =>
    layout === 'full-width' || layout === 'wide'
      ? `
  margin-left: 50%;
  transform: translateX(-50%);
  `
      : ``}
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
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick =
    url && handler
      ? (e: React.MouseEvent<HTMLElement>) => handler(e, url)
      : undefined;

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

  /** Width can be null, so set it to defaults if  it is undefined*/
  let {
    originalWidth = DEFAULT_EMBED_CARD_HEIGHT,
    originalHeight = DEFAULT_EMBED_CARD_HEIGHT,
  } = props;

  if (!originalWidth || !originalHeight) {
    originalHeight = DEFAULT_EMBED_CARD_HEIGHT;
    originalWidth = DEFAULT_EMBED_CARD_WIDTH;
  }

  const padding = rendererAppearance === 'full-page' ? FullPagePadding * 2 : 0;

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
            <ExtendedEmbedCard
              layout={layout}
              width={originalWidth}
              containerWidth={containerWidth}
              pctWidth={width}
              height={originalHeight}
              fullWidthMode={isFullWidth}
              nodeType="embedCard"
              lineLength={isInsideOfBlockNode ? containerWidth : lineLength}
            >
              <EmbedCardWrapper>
                <div
                  className="embedCardView-content-wrap"
                  data-embed-card
                  data-layout={layout}
                  data-width={width}
                  data-card-original-width={originalWidth}
                  data-card-data={data ? JSON.stringify(data) : undefined}
                  data-card-url={url}
                  data-card-original-height={originalHeight}
                >
                  <Card
                    appearance="embed"
                    {...cardProps}
                    inheritDimensions={true}
                  />
                </div>
              </EmbedCardWrapper>
            </ExtendedEmbedCard>
          </CardErrorBoundary>
        );
      }}
    </WidthConsumer>
  );
}
