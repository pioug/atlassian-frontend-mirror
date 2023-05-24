import { css } from '@emotion/react';

import { B200, N60 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/*
  Styles in this file are based on
  packages/editor/editor-core/src/plugins/media/styles.ts
*/

export const resizerItemClassName = 'resizer-item';
export const resizerHandleRightClassName = 'resizer-handle-right';
export const resizerHandleLeftClassName = 'resizer-handle-left';

// akEditorSelectedNodeClassName from '@atlaskit/editor-shared-styles';
const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const resizerHandlePadding = 13;
export const resizerHandleZIndex = 99;

export const resizerHandlerSmallClassName = 'resizer-handler-small';
export const resizerHandlerMediumClassName = 'resizer-handler-medium';
export const resizerHandlerLargeClassName = 'resizer-handler-large';

export const resizerHandlerClassName = {
  small: resizerHandlerSmallClassName,
  medium: resizerHandlerMediumClassName,
  large: resizerHandlerLargeClassName,
};

export const resizerStyles = css`
  .${resizerItemClassName} {
    background: ${token('color.border.focused', B200)};
  }

  .${resizerHandleRightClassName}, .${resizerHandleLeftClassName} {
    display: flex;
    flex-direction: column;

    /* vertical align */
    justify-content: center;
  }

  .${resizerHandleRightClassName} {
    align-items: flex-end;
    /* padding-right: 12px; */
    /* margin-right: -${resizerHandlePadding}px; */
  }

  .${resizerHandleLeftClassName} {
    align-items: flex-start;
    /* padding-left: 12px; */
    /* margin-left: -${resizerHandlePadding}px; */
  }

  .${resizerHandleRightClassName}::after,
    .${resizerHandleLeftClassName}::after {
    content: ' ';
    display: flex;
    width: 3px;
    height: 64px;

    border-radius: 6px;
  }

  .${resizerItemClassName}:hover
    .${resizerHandleLeftClassName}::after,
    .${resizerItemClassName}:hover
    .${resizerHandleRightClassName}::after {
    background: ${token('color.border', N60)};
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

  .${resizerHandleRightClassName}.${resizerHandlerClassName.medium}::after,
    .${resizerHandleLeftClassName}.${resizerHandlerClassName.medium}::after {
    height: 64px;
  }

  .${resizerHandleRightClassName}.${resizerHandlerClassName.small}::after,
    .${resizerHandleLeftClassName}.${resizerHandlerClassName.small}::after {
    height: 43px;
  }

  .${resizerHandleRightClassName}.${resizerHandlerClassName.large}::after,
    .${resizerHandleLeftClassName}.${resizerHandlerClassName.large}::after {
    height: 96px;
  }
`;
