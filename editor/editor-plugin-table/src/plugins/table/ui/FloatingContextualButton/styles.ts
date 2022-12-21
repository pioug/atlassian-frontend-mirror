import { css } from '@emotion/react';
import { B75, DN0, DN60, N0, N20, N30A, N700 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { contextualMenuTriggerSize } from '../consts';
import { token } from '@atlaskit/tokens';
import { themed } from '@atlaskit/theme/components';
import { ThemeProps } from '@atlaskit/theme/types';

export const tableFloatingCellButtonStyles = (props: ThemeProps) => css`
  > div {
    // Sits behind button to provide surface-color background
    background: ${token('elevation.surface', N20)};
    border-radius: ${borderRadius()}px;
    display: flex;
    height: ${contextualMenuTriggerSize + 2}px;
    flex-direction: column;
  }
  && button {
    background: ${themed({
      light: token('color.background.neutral', 'none'),
      dark: token('color.background.neutral', 'none'),
    })(props)};
    flex-direction: column;
    margin: 2px;
    outline: 2px solid ${token('color.border', N0)};
    border-radius: 1px;
    padding: 0;
    height: calc(100% - 4px);
    display: flex;
  }
  && button:hover {
    background: ${themed({
      light: token('color.background.neutral.hovered', N30A),
      dark: token('color.background.neutral.hovered', DN60),
    })(props)};
  }
  && button:active {
    background: ${themed({
      light: token(
        'color.background.neutral.pressed',
        'rgba(179, 212, 255, 0.6)',
      ),
      dark: token('color.background.neutral.pressed', B75),
    })(props)};
  }
  && button > span {
    margin: 0px -4px;
  }
  && span {
    pointer-events: none;
  }
`;

export const tableFloatingCellButtonSelectedStyles = (props: ThemeProps) => css`
  && button {
    background: ${themed({
      light: token('color.background.selected', N700),
      dark: token('color.background.selected', DN0),
    })(props)};
  }
  && button:hover {
    background: ${themed({
      light: token('color.background.selected.hovered', N700),
      dark: token('color.background.selected.hovered', DN0),
    })(props)};
  }
  && button:active {
    background: ${themed({
      light: token('color.background.selected.pressed', N700),
      dark: token('color.background.selected.pressed', DN0),
    })(props)};
  }
`;
