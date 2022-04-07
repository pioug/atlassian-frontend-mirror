import { css } from '@emotion/react';
import { gridSize } from '@atlaskit/theme/constants';

export const alignmentWrapper = css`
  padding: 0 ${gridSize()}px;
  display: flex;
  flex-wrap: wrap;
  max-width: ${3 * 32}px;
`;
