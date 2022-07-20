import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { css } from '@emotion/react';

const HEIGHT = 90;

export const genericErrorStyles = css`
  height: ${HEIGHT}px;
  margin: 0 auto ${getGridSize() * 3}px;
  display: block;
`;
