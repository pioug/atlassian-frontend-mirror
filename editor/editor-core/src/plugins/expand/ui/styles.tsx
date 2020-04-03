import { css } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
import {
  akLayoutGutterOffset,
  sharedExpandStyles,
} from '@atlaskit/editor-common';

import { expandClassNames } from './class-names';
import { BreakoutCssClassName } from '../../breakout/constants';

const EXPAND_SELECTED_BACKGROUND = 'rgba(255, 255, 255, 0.6)';

export const expandStyles = css`
  .${expandClassNames.icon} > div {
    display: flex;
  }

  .${expandClassNames.prefix} {
    ${sharedExpandStyles.ContainerStyles}
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;

    td > & {
      margin-top: 0;
    }

    .${expandClassNames.iconContainer} svg {
      transform: rotate(90deg);
    }
  }

  .ProseMirror > .${expandClassNames.type('expand')}, .${
  BreakoutCssClassName.BREAKOUT_MARK_DOM
} > .${expandClassNames.type('expand')} {
    margin-left: -${akLayoutGutterOffset}px;
    margin-right: -${akLayoutGutterOffset}px;
  }

  .${expandClassNames.content} {
    ${sharedExpandStyles.ContentStyles}
    cursor: text;
    padding-top: 0px;
  }

  .${expandClassNames.titleInput} {
    ${sharedExpandStyles.TitleInputStyles}
  }

  .${expandClassNames.titleContainer} {
    ${sharedExpandStyles.TitleContainerStyles};
    overflow: visible;
  }

  .${expandClassNames.expanded} {
    background: ${EXPAND_SELECTED_BACKGROUND};
    border-color: ${colors.N40A};

    .${expandClassNames.content} {
      padding-top: ${gridSize}px;
    }
  }

  .${expandClassNames.inputContainer} {
    width: 100%;
  }
  
  .${expandClassNames.prefix}:(.${expandClassNames.expanded}) {
    .expand-content-wrapper {
      height: auto;
    }
  }
  
  

  .${expandClassNames.prefix}:not(.${expandClassNames.expanded}) {
    .ak-editor-expand__content {
      position: absolute;
      height: 1px;
      width: 1px;
      overflow: hidden;
      clip: rect(1px, 1px, 1px, 1px);
      white-space: nowrap;
    }

    .${expandClassNames.iconContainer} svg {
      transform: rotate(0deg);
    }

    &:not(.ProseMirror-selectednode):not(.danger) {
      background: transparent;
      border-color: transparent;

      &:hover {
        border-color: ${colors.N50A};
        background: ${EXPAND_SELECTED_BACKGROUND};
      }
    }
  }
`;
