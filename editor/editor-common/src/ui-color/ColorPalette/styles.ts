import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const colorPaletteWrapper = css({
  padding: `0 ${token('space.100', '8px')}`,
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: 'flex',
});
