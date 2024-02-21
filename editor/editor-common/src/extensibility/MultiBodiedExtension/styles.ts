import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../Extension/styles';

// Wrapper the extension title and extensionContainer
export const mbeExtensionWrapperCSS = css`
  ${wrapperDefault};
  cursor: pointer;
  margin-top: ${token('space.250', '24px')};
  margin-bottom: ${token('space.200', '16px')};
  .extension-title {
    display: flex;
    align-items: center;
    line-height: 16px !important;
    margin-bottom: ${token('space.100', '8px')};
    margin-left: ${token('space.050', '4px')} !important;
    margin-right: ${token('space.100', '8px')};
    padding-top: ${token('space.100', '8px')} !important;
  }
`;
