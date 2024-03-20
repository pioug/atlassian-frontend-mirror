import { css } from '@emotion/react';

import { N0, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../Extension/styles';

// Wrapper the extension title and extensionContainer
export const mbeExtensionWrapperCSS = css(wrapperDefault, {
  '&.remove-margin-top': {
    marginTop: 0,
  },
  cursor: 'pointer',
  marginTop: token('space.250', '24px'),
  marginBottom: token('space.200', '16px'),
  '.extension-title': {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '16px !important',
    marginBottom: token('space.100', '8px'),
    marginLeft: `${token('space.050', '4px')} !important`,
    marginRight: token('space.100', '8px'),
    paddingTop: `${token('space.100', '8px')} !important`,
  },
  '&.with-border': {
    border: `1px solid ${token('color.border.inverse', N0)}`, // adding this so macro doesn't jump when hover border is shown
  },
  '&.with-hover-border': {
    border: `1px solid ${token('color.border', N30)}`,
  },
});
