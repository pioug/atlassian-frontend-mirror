import { css } from '@emotion/react';

import { akEditorDeleteBorder } from '@atlaskit/editor-shared-styles';
import { B200, B50, N60 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/*
  Styles in this file are based on
  packages/editor/editor-core/src/plugins/media/styles.ts
*/

export const resizerItemClassName = 'resizer-item';
export const resizerHandleClassName = 'resizer-handle';
export const resizerHandleTrackClassName = `${resizerHandleClassName}-track`;
export const resizerHandleThumbClassName = `${resizerHandleClassName}-thumb`;

// akEditorSelectedNodeClassName from '@atlaskit/editor-shared-styles';
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const resizerHandleZIndex = 99;

export const resizerStyles = css`
  .${resizerItemClassName} {
    will-change: width;

    &:hover,
    &.display-handle {
      & .${resizerHandleClassName} {
        visibility: visible;
        opacity: 1;
      }
    }

    &.is-resizing {
      & .${resizerHandleThumbClassName} {
        background: ${token('color.border.focused', B200)};
      }
    }

    &.danger {
      & .${resizerHandleThumbClassName} {
        transition: none;
        background: ${token('color.border.danger', akEditorDeleteBorder)};
      }
    }
  }

  .${resizerHandleClassName} {
    display: flex;
    visibility: hidden;
    opacity: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 7px;
    transition: visibility 0.2s, opacity 0.2s;

    /*
      NOTE: The below style is targetted at the div element added by the tooltip. We don't have any means of injecting styles
      into the tooltip
    */
    & div[role='presentation'] {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    /*
      Handle Positions
    */
    &.left {
      align-items: flex-start;
    }
    &.right {
      align-items: flex-end;
    }

    /*
      Handle Sizing
    */
    &.small {
      & .${resizerHandleThumbClassName} {
        height: 43px;
      }
    }
    &.medium {
      & .${resizerHandleThumbClassName} {
        height: 64px;
      }
    }
    &.large {
      & .${resizerHandleThumbClassName} {
        height: 96px;
      }
    }

    /*
      Handle Alignment
    */
    &.sticky {
      & .${resizerHandleThumbClassName} {
        position: sticky;
        top: ${token('space.150', '12px')};
        bottom: ${token('space.150', '12px')};
      }
    }

    &:hover {
      & .${resizerHandleThumbClassName} {
        background: ${token('color.border.focused', B200)};
      }

      & .${resizerHandleTrackClassName} {
        visibility: visible;
        opacity: 0.5;
      }
    }
  }

  .${resizerHandleThumbClassName} {
    content: ' ';
    display: flex;
    width: 3px;
    height: 64px;
    transition: background-color 0.2s;
    border-radius: 6px;

    background: ${token('color.border', N60)};
  }

  .${resizerHandleTrackClassName} {
    visibility: hidden;
    position: absolute;
    width: 7px;
    height: calc(100% - 24px);
    border-radius: 4px;
    opacity: 0;
    transition: background-color 0.2s, visibility 0.2s, opacity 0.2s;

    &.none {
      background: none;
    }

    &.shadow {
      background: ${token('color.background.selected', B50)};
    }
  }

  .${akEditorSelectedNodeClassName} {
    & .${resizerHandleThumbClassName} {
      background: ${token('color.border.focused', B200)};
    }
  }
`;
