import { css } from '@emotion/react';

import { N30, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../Extension/styles';

// Wrapper the extension title and extensionContainer
export const mbeExtensionWrapperCSS = css`
  ${wrapperDefault};
  cursor: pointer;
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

// Wraps the navigation bar and extensionFrames
export const mbeExtensionContainerCSS = css`
  background: transpaent !important;
  padding: {
    bottom: ${token('space.100', '8px')} !important;
    left: ${token('space.100', '8px')} !important;
    right: ${token('space.100', '8px')} !important;
  }
  padding-bottom: ${token('space.100', '8px')};
  position: relative;
  vertical-align: middle;
  cursor: pointer;

  .multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true'] {
    display: none;
    background: ${token('elevation.surface', 'white')};
  }
`;

export const mbeNavigationCSS = css`
  // make sure the user can't see a range selection inside the navigation
  // This is really important to keep the navigation working properly
  border-top-left-radius: ${token('border.radius', '3px')};
  border-top-right-radius: ${token('border.radius', '3px')};

  user-select: none;
  -webkit-user-modify: read-only;
  border: 1px solid ${token('color.border', N40)};
  border-bottom: none;
  background: ${token('elevation.surface', 'white')};
  margin-left: ${token('space.100', '8px')};
  margin-right: ${token('space.100', '8px')};
`;

export const extensionFrameContentCSS = css`
  padding: ${token('space.100', '8px')} !important;
  border: 1px solid ${token('color.border', N30)};
  display: block;
  min-height: 100px;
  background: ${token('elevation.surface', 'white')};
  border-bottom-left-radius: ${token('border.radius', '3px')};
  border-bottom-right-radius: ${token('border.radius', '3px')};

  margin-left: ${token('space.100', '8px')};
  margin-right: ${token('space.100', '8px')};
  cursor: initial;

  .pm-table-container {
    margin-left: ${token('space.100', '8px')} !important;
    padding-right: ${token('space.200', '16px')} !important;
  }
  .pm-table-with-controls {
    margin-left: ${token('space.150', '12px')} !important;
    padding-right: ${token('space.150', '12px')} !important;
  }
  .bodiedExtensionView-content-wrap {
    margin-top: ${token('space.150', '12px')} !important;
  }
  // Extension wrap have an additional margin on all four borders, so we need to adjust the spacing
  // compared to the bodiedExtensionView-content-wrap
  .extensionView-content-wrap {
    margin-top: ${token('space.100', '8px')} !important;
  }
`;
