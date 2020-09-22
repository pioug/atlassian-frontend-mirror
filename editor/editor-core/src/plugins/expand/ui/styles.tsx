import { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import {
  R50,
  R300,
  N40A,
  N50A,
  N80A,
  DN50,
  R200,
} from '@atlaskit/theme/colors';
import { sharedExpandStyles } from '@atlaskit/editor-common';
import {
  SelectionStyle,
  getSelectionStyles,
  akLayoutGutterOffset,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

import { BreakoutCssClassName } from '../../breakout/constants';

import { expandClassNames } from './class-names';

const EXPAND_SELECTED_BACKGROUND = themed({
  light: 'rgba(255, 255, 255, 0.6)',
  dark: 'rgba(9, 10, 11, 0.29)',
});

const EXPAND_ICON_COLOR = css`
  color: ${themed({ light: N80A, dark: '#d9dde3' })};
`;

const ACTIVE_STATE_BACKGROUND_COLOR = themed({ dark: `#0C294F` });
const ACTIVE_STATE_BORDER = themed({ dark: `1px solid #4794ff` });
const ACTIVE_STATE_BORDER_RADIUS = themed({ dark: '3px' });

const DANGER_STATE_BACKGROUND_COLOR = themed({
  light: R50,
  dark: '#441C13',
});
const DANGER_STATE_BORDER = themed({
  dark: `1px solid ${R200}`,
});
const DANGER_STATE_BORDER_COLOR = themed({
  light: R300,
});
const DANGER_STATE_BORDER_RADIUS = themed({
  dark: '3px',
});

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
      ${EXPAND_ICON_COLOR};
      transform: rotate(90deg);
    }

    &.${akEditorSelectedNodeClassName}:not(.danger) {
      ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}

      ::after {
        // Custom background color and borders (for dark theme).
        background-color: ${ACTIVE_STATE_BACKGROUND_COLOR};
        border: ${ACTIVE_STATE_BORDER};
        border-radius: ${ACTIVE_STATE_BORDER_RADIUS};
      }
    }

    &.danger {
      background: ${DANGER_STATE_BACKGROUND_COLOR};
      border: ${DANGER_STATE_BORDER};
      border-color: ${DANGER_STATE_BORDER_COLOR};
      border-radius: ${DANGER_STATE_BORDER_RADIUS};
    }
  }

  .ProseMirror
    > .${expandClassNames.type('expand')},
    .${BreakoutCssClassName.BREAKOUT_MARK_DOM}
    > .${expandClassNames.type('expand')} {
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
    border-color: ${themed({ light: N40A, dark: DN50 })};

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
      ${EXPAND_ICON_COLOR};
      transform: rotate(0deg);
    }

    &:not(.${akEditorSelectedNodeClassName}):not(.danger) {
      background: transparent;
      border-color: transparent;

      &:hover {
        border-color: ${themed({ light: N50A, dark: DN50 })};
        background: ${EXPAND_SELECTED_BACKGROUND};
      }
    }
  }
`;
