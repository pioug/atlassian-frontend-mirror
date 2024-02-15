import { css } from '@emotion/react';

import { akEditorGridLineZIndex } from '@atlaskit/editor-shared-styles';
import { B200, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const GRID_GUTTER = 12;

export const gridStyles = css`
  .gridParent {
    width: calc(100% + ${GRID_GUTTER * 2}px);
    margin-left: ${token(
      'space.negative.150',
      '-12px',
    )}; // Negative GRID_GUTTER
    margin-right: ${token(
      'space.negative.150',
      '-12px',
    )}; // Negative GRID_GUTTER
    transform: scale(1);
    z-index: ${akEditorGridLineZIndex};
  }

  .gridContainer {
    position: fixed;
    height: 100vh;
    width: 100%;
    pointer-events: none;
  }

  // TODO: https://product-fabric.atlassian.net/browse/DSP-4352
  .gridLine {
    border-left: 1px solid ${token('color.border', N30A)};
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin-left: -1px;

    transition: border-color 0.15s linear;
    z-index: 0;
  }

  .highlight {
    border-left: 1px solid ${token('color.border.focused', B200)};
  }
`;
