/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const CSS_VAR_MAX_WIDTH = '--max-width';
const CSS_VAR_MAX_HEIGHT = '--max-height';

type ImageProps = {
  height?: number;
  maxHeight: number;
  maxWidth: number;
  width?: number;
  src: string;
};

const imageStyles = css({
  display: 'block',
  maxWidth: `var(${CSS_VAR_MAX_WIDTH})`,
  maxHeight: `var(${CSS_VAR_MAX_HEIGHT})`,
  margin: `0 auto ${getGridSize() * 3}px`,
});

/**
 * __Image__
 *
 * Image in Empty State.
 *
 * @internal
 */
const Image: FC<ImageProps> = ({
  maxHeight,
  maxWidth,
  height = 'auto',
  width = 'auto',
  src,
}) => (
  <img
    style={
      {
        [CSS_VAR_MAX_WIDTH]: `${maxWidth}px`,
        [CSS_VAR_MAX_HEIGHT]: `${maxHeight}px`,
      } as React.CSSProperties
    }
    width={width}
    height={height}
    alt=""
    role="presentation"
    css={imageStyles}
    src={src}
  />
);

export default Image;
