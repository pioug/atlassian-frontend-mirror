import { css } from '@emotion/react';

import { N0, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../Extension/styles';

// Wrapper the extension title and extensionContainer
export const mbeExtensionWrapperCSSStyles = css(wrapperDefault, {
  '&.with-margin-styles': {
    marginTop: 0,
    marginLeft: token('space.negative.150', '-12px'),
    marginRight: token('space.negative.150', '-12px'),
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
    border: `1px solid ${token('color.border.bold', N100)}`,
    opacity: '86%',
  },
});

export const overlayStyles = css({
  borderRadius: token('border.radius', '3px'),
  position: 'absolute',
  width: '100%',
  height: '100%',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.3s',
  zIndex: 1,
});
