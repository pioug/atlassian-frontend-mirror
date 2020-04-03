import { css } from 'styled-components';
import { colors } from '@atlaskit/theme';
import { akEditorGridLineZIndex } from '@atlaskit/editor-common';

export const GRID_GUTTER = 12;

export const gridStyles = css`
  .gridParent {
    width: calc(100% + ${GRID_GUTTER * 2}px);
    margin-left: -${GRID_GUTTER}px;
    margin-right: -${GRID_GUTTER}px;
    transform: scale(1);
    z-index: ${akEditorGridLineZIndex};
  }

  .gridContainer {
    position: fixed;
    height: 100vh;
    width: 100%;
    pointer-events: none;
  }

  .gridLine {
    border-left: 1px solid ${colors.N30A};
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    margin-left: -1px;

    transition: border-color 0.15s linear;
    z-index: 0;
  }

  .gridContainer.hidden .gridLine {
    border-left: 1px solid transparent;
  }

  .highlight {
    border-left: 1px solid ${colors.B200};
  }
`;
