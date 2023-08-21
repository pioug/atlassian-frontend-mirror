import { css } from '@emotion/react';

import { akEditorDeleteBorder } from '@atlaskit/editor-shared-styles';
import { B200, B50, N60 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/*
  Styles in this file are based on
  packages/editor/editor-core/src/plugins/media/styles.ts
*/

export const resizerItemClassName = 'resizer-item';
export const resizerHandleRightClassName = 'resizer-handle-right';
export const resizerHandleLeftClassName = 'resizer-handle-left';
export const resizerHandleStickyClassName = 'resizer-handle-sticky';
export const resizerHandleShadowClassName = 'resizer-handle-shadow';

// akEditorSelectedNodeClassName from '@atlaskit/editor-shared-styles';
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const resizerHandleZIndex = 99;

export const resizerHandleSmallClassName = 'resizer-handle-small';
export const resizerHandleMediumClassName = 'resizer-handle-medium';
export const resizerHandleLargeClassName = 'resizer-handle-large';

export const resizerHandleClassName = {
  small: resizerHandleSmallClassName,
  medium: resizerHandleMediumClassName,
  large: resizerHandleLargeClassName,
};

export const resizerStyles = css`
  .${resizerHandleRightClassName}, .${resizerHandleLeftClassName} {
    display: flex;
    visibility: hidden;
    flex-direction: column;
    justify-content: center;
    width: 7px;
    transition: visibility 0.2s;
  }

  .${resizerHandleRightClassName} {
    align-items: flex-end;
  }

  .${resizerHandleLeftClassName} {
    align-items: flex-start;
  }

  .${resizerHandleRightClassName}::after,
    .${resizerHandleLeftClassName}::after {
    content: ' ';
    display: flex;
    width: 3px;
    height: 64px;
    transition: background-color 0.2s;

    border-radius: 6px;
  }

  .${resizerItemClassName}:hover
    .${resizerHandleLeftClassName},
    .${resizerItemClassName}:hover
    .${resizerHandleRightClassName},
    .${resizerItemClassName}.display-handle
    .${resizerHandleRightClassName},
    .${resizerItemClassName}.display-handle
    .${resizerHandleLeftClassName} {
    visibility: visible;
  }

  .${resizerItemClassName}:hover
    .${resizerHandleLeftClassName}::after,
    .${resizerItemClassName}:hover
    .${resizerHandleRightClassName}::after,
    .${resizerItemClassName}.display-handle
    .${resizerHandleRightClassName}::after,
    .${resizerItemClassName}.display-handle
    .${resizerHandleLeftClassName}::after {
    background: ${token('color.border', N60)};
  }

  .${resizerItemClassName}.danger {
    &
      .${resizerHandleRightClassName}::after,
      .${resizerHandleLeftClassName}::after {
      transition: none;
      background: ${token('color.border.danger', akEditorDeleteBorder)};
    }
  }

  .${akEditorSelectedNodeClassName}
    .${resizerHandleRightClassName}::after,
    .${akEditorSelectedNodeClassName}
    .${resizerHandleLeftClassName}::after,
    .${resizerItemClassName}
    .${resizerHandleRightClassName}:hover::after,
    .${resizerItemClassName}
    .${resizerHandleLeftClassName}:hover::after,
    .${resizerItemClassName}.is-resizing
    .${resizerHandleRightClassName}::after,
    .${resizerItemClassName}.is-resizing
    .${resizerHandleLeftClassName}::after {
    background: ${token('color.border.focused', B200)};
  }

  .${resizerHandleRightClassName}.${resizerHandleClassName.medium}::after,
    .${resizerHandleLeftClassName}.${resizerHandleClassName.medium}::after {
    height: 64px;
  }

  .${resizerHandleRightClassName}.${resizerHandleClassName.small}::after,
    .${resizerHandleLeftClassName}.${resizerHandleClassName.small}::after {
    height: 43px;
  }

  .${resizerHandleRightClassName}.${resizerHandleClassName.large}::after,
    .${resizerHandleLeftClassName}.${resizerHandleClassName.large}::after {
    height: 96px;
  }

  .${resizerHandleRightClassName}.${resizerHandleStickyClassName}::after,
    .${resizerHandleLeftClassName}.${resizerHandleStickyClassName}::after {
    position: sticky;
    top: 10px;
    bottom: 10px;
  }

  .${resizerHandleShadowClassName} {
    visibility: hidden;
    position: absolute;
    width: 7px;
    border-radius: 4px;
    opacity: 0;
    transition: background-color 0.2s, visibility 0.2s;
  }

  .${resizerHandleRightClassName}:hover
    .${resizerHandleShadowClassName},
    .${resizerHandleLeftClassName}:hover
    .${resizerHandleShadowClassName} {
    visibility: visible;
    background-color: ${token('color.background.selected', B50)};
    opacity: 0.5;
  }
`;
