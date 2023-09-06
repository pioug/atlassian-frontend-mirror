import { css } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

/**
 * Half padding on the top as the form field has a `gridSize()` margin top that cannot be overridden
 */
export const rootContainerStyles = css`
  width: ${getBooleanFF(
    'platform.linking-platform.link-picker.fixed-height-search-results',
  )
    ? undefined
    : 'var(--link-picker-width)'};
  padding: ${token('space.100', '8px')} ${token('space.200', '16px')}
    ${token('space.200', '16px')};
  box-sizing: border-box;
  line-height: initial;
`;

export const formFooterMargin = css`
  margin-top: ${token('space.200', '16px')};
`;
