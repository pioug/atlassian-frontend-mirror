import { css } from '@emotion/react';

import { N0, N20, N30A, N700 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { contextualMenuTriggerSize } from '../consts';

export const tableFloatingCellButtonStyles = () => css`
  > div {
    // Sits behind button to provide surface-color background
    background: ${token('elevation.surface', N20)};
    border-radius: ${token('border.radius', '3px')};
    display: flex;
    height: ${contextualMenuTriggerSize + 2}px;
    flex-direction: column;
  }
  && button {
    background: ${token('color.background.neutral', 'none')};
    flex-direction: column;
    margin: ${token('space.025', '2px')};
    outline: 2px solid ${token('elevation.surface', N0)};
    border-radius: 1px;
    padding: 0;
    height: calc(100% - 4px);
    display: flex;
  }
  && button:hover {
    background: ${token('color.background.neutral.hovered', N30A)};
  }
  && button:active {
    background: ${token(
      'color.background.neutral.pressed',
      'rgba(179, 212, 255, 0.6)',
    )};
  }
  && button > span {
    margin: 0px ${token('space.negative.050', '-4px')};
  }
  && span {
    pointer-events: none;
  }
`;

export const tableFloatingCellButtonSelectedStyles = () => css`
  && button {
    background: ${token('color.background.selected', N700)};
  }
  && button:hover {
    background: ${token('color.background.selected.hovered', N700)};
  }
  && button:active {
    background: ${token('color.background.selected.pressed', N700)};
  }
`;
