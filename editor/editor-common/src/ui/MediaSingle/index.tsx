import React from 'react';
import { MediaSingleLayout } from '@atlaskit/adf-schema';
import Wrapper from './styled';
import classnames from 'classnames';
import { calcPxFromPct, layoutSupportsWidth } from './grid';

export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;

export interface Props {
  children: React.ReactChild;
  layout: MediaSingleLayout;
  width: number;
  height: number;
  lineLength: number;
  containerWidth?: number;
  isLoading?: boolean;
  className?: string;
  pctWidth?: number;
  fullWidthMode?: boolean;
  blockLink?: string;
}

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
}: Props) {
  const usePctWidth = pctWidth && layoutSupportsWidth(layout);
  if (pctWidth && usePctWidth) {
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
      data-node-type="mediaSingle"
      data-layout={layout}
      data-width={pctWidth}
      data-block-link={blockLink}
      className={classnames('media-single', `image-${layout}`, className, {
        'is-loading': isLoading,
        'media-wrapped': layout === 'wrap-left' || layout === 'wrap-right',
      })}
    >
      {React.Children.only(children)}
    </Wrapper>
  );
}
