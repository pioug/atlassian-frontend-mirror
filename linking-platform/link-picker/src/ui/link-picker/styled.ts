import { css } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

export const rootContainerStyles = css`
  width: ${getBooleanFF(
    'platform.linking-platform.link-picker.fixed-height-search-results',
  )
    ? undefined
    : 'var(--link-picker-width)'};
  padding-left: var(--link-picker-padding-left);
  padding-right: var(--link-picker-padding-right);
  padding-top: var(--link-picker-padding-top);
  padding-bottom: var(--link-picker-padding-bottom);
  box-sizing: border-box;
  line-height: initial;
  display: block !important;
`;

export const formFooterMargin = css`
  margin-top: ${token('space.200', '16px')};
`;
