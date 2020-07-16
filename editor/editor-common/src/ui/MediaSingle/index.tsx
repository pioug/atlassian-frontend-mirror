import React from 'react';

import classnames from 'classnames';

import {
  RichMediaLayout as MediaSingleLayout,
  RichMediaLayout,
} from '@atlaskit/adf-schema';

import { calcPxFromPct } from './grid';
import Wrapper from './styled';

export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;

export const wrappedLayouts: RichMediaLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  lineLength?: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  pctWidth?: number;
  fullWidthMode?: boolean;
  blockLink?: string;
  nodeType?: string;
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
  children,
  layout,
  width,
  height,
  containerWidth = width,
  isLoading = false,
  pctWidth,
  className,
  fullWidthMode,
  lineLength,
  blockLink,
  nodeType = 'mediaSingle',
  hasFallbackContainer = true,
}: Props) {
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

  return (
    <Wrapper
      layout={layout}
      width={width}
      ratio={((height / width) * 100).toFixed(3)}
      containerWidth={containerWidth}
      pctWidth={pctWidth}
      fullWidthMode={fullWidthMode}
      data-node-type={nodeType}
      data-layout={layout}
      data-width={pctWidth}
      data-block-link={blockLink}
      hasFallbackContainer={hasFallbackContainer}
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
      {React.Children.only(children)}
    </Wrapper>
  );
}
