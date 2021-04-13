import React from 'react';

import classnames from 'classnames';

import {
  RichMediaLayout as MediaSingleLayout,
  RichMediaLayout,
} from '@atlaskit/adf-schema';
import {
  akEditorMediaResizeHandlerPaddingWide,
  DEFAULT_EMBED_CARD_WIDTH,
} from '@atlaskit/editor-shared-styles';

import { calcPxFromPct } from './grid';
import { MediaSingleWrapper, MediaWrapper } from './styled';

export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;

export const wrappedLayouts: RichMediaLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

export interface Props {
  children: React.ReactNode;
  layout: MediaSingleLayout;
  width?: number;
  height: number;
  lineLength: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  pctWidth?: number;
  nodeType?: string;
  fullWidthMode?: boolean;
  hasFallbackContainer?: boolean;
}

export const shouldAddDefaultWrappedWidth = (
  layout: RichMediaLayout,
  width?: number,
  lineLength?: number,
) => {
  return (
    wrappedLayouts.indexOf(layout) > -1 &&
    lineLength &&
    width &&
    width > 0.5 * lineLength
  );
};

export default function MediaSingle({
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  pctWidth,
  className,
  children: propsChildren,
  nodeType = 'mediaSingle',
  fullWidthMode,
  lineLength,
  hasFallbackContainer = true,
}: Props) {
  const children = React.Children.toArray<React.ReactNode>(propsChildren);
  if (!pctWidth && shouldAddDefaultWrappedWidth(layout, width, lineLength)) {
    pctWidth = 50;
  }
  // When width is not set we have an absolute height for a given embed.
  // When both width and height are set we use them to determine ratio and use that to define
  // embed height in relation to whatever width of an dom element is in runtime
  const isHeightOnly = width === undefined;
  if (pctWidth) {
    const pxWidth = Math.ceil(
      calcPxFromPct(pctWidth / 100, lineLength || containerWidth || 0),
    );
    if (isHeightOnly) {
      width = pxWidth - akEditorMediaResizeHandlerPaddingWide;
    } else if (width !== undefined) {
      height = (height / width) * pxWidth;
      width = pxWidth;
    }
  } else if (isHeightOnly) {
    // No pctWidth can be found on already existing pages with existing embeds

    // It's ok to use Embed specific width, because width can be not set only in embed card.
    // This value will be used only in the case of non `wide` and non `full-width` cases inside MediaSingleDimensionHelper.
    width = DEFAULT_EMBED_CARD_WIDTH - akEditorMediaResizeHandlerPaddingWide;
  }

  // Media wrapper controls the height of the box.
  // We can define this height
  // - via height directly
  // - via paddingBottom (if we have both height and width) which is a css trick to represent a ratio
  let mediaWrapperHeight: number | undefined;
  let paddingBottom: string | undefined;
  if (isHeightOnly) {
    mediaWrapperHeight = height;
  } else if (width !== undefined) {
    const mediaWrapperRatio = (height / width) * 100;
    paddingBottom = `${mediaWrapperRatio.toFixed(3)}%`;
    if (nodeType === 'embedCard') {
      // we want to set ratio of whole box (including header) buy knowing ratio of iframe itself

      // For some reason importing `embedHeaderHeight` from '@atlaskit/smart-card' breaks
      // packages/editor/editor-core/src/plugins/table/__tests__/unit/toolbar.ts 🤷‍️, but we have a test
      // that uses imported value, so it's should be good.
      paddingBottom = `calc(${paddingBottom} + 32px)`;
    }
  }

  const [media, caption] = children;

  return (
    <MediaSingleWrapper
      width={width}
      layout={layout}
      containerWidth={containerWidth}
      pctWidth={pctWidth}
      fullWidthMode={fullWidthMode}
      data-layout={layout}
      data-width={pctWidth}
      data-node-type={nodeType}
      className={classnames(
        'rich-media-item mediaSingleView-content-wrap',
        `image-${layout}`,
        className,
        {
          'is-loading': isLoading,
          'rich-media-wrapped':
            layout === 'wrap-left' || layout === 'wrap-right',
        },
      )}
    >
      <MediaWrapper
        hasFallbackContainer={hasFallbackContainer}
        height={mediaWrapperHeight}
        paddingBottom={paddingBottom}
      >
        {media}
      </MediaWrapper>
      {caption}
    </MediaSingleWrapper>
  );
}
