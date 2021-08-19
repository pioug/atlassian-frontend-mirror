/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';

const CSS_VAR_WIDTH = '--width';
const CSS_VAR_MAX_WIDTH = '--max-width';
const CSS_VAR_HEIGHT = '--height';
const CSS_VAR_MAX_HEIGHT = '--max-height';

type ImageProps = {
  height?: number;
  maxHeight: number;
  maxWidth: number;
  alt: string;
  width?: number;
  role: string;
  src: string;
};

const imageStyles = css({
  display: 'block',
  width: `var(${CSS_VAR_WIDTH})`,
  maxWidth: `var(${CSS_VAR_MAX_WIDTH})`,
  height: `var(${CSS_VAR_HEIGHT})`,
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
const Image: FC<ImageProps> = ({ alt, maxHeight, maxWidth, ...props }) => (
  <img
    style={
      {
        [CSS_VAR_WIDTH]: props.width || 'auto',
        [CSS_VAR_MAX_WIDTH]: `${maxWidth}px`,
        [CSS_VAR_HEIGHT]: props.height || 'auto',
        [CSS_VAR_MAX_HEIGHT]: `${maxHeight}px`,
      } as React.CSSProperties
    }
    css={imageStyles}
    alt={alt}
    {...props}
  />
);

export default Image;
