import React from 'react';

import classnames from 'classnames';

import {
  RichMediaLayout as MediaSingleLayout,
  RichMediaLayout,
} from '@atlaskit/adf-schema';

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
  width: number;
  height: number;
  lineLength: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  pctWidth?: number;
  nodeType?: string;
  fullWidthMode?: boolean;
  blockLink?: string;
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
  blockLink,
  hasFallbackContainer = true,
}: Props) {
  const children = React.Children.toArray<React.ReactNode>(propsChildren);
  if (!pctWidth && shouldAddDefaultWrappedWidth(layout, width, lineLength)) {
    pctWidth = 50;
  }
  if (pctWidth) {
    const pxWidth = Math.ceil(
      calcPxFromPct(pctWidth / 100, lineLength || containerWidth),
    );

    // scale, keeping aspect ratio
    height = (height / width) * pxWidth;
    width = pxWidth;
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
      data-block-link={blockLink}
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
        ratio={((height / width) * 100).toFixed(3)}
      >
        {media}
      </MediaWrapper>
      {caption}
    </MediaSingleWrapper>
  );
}
