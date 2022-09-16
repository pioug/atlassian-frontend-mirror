import { css } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

export const colorPaletteWrapper = css`
  padding: 0 ${gridSize()}px;
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
`;
