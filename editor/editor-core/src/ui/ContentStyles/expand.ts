import { css } from '@emotion/react';
import {
  DN50,
  N40A,
  N50A,
  N80A,
  R200,
  R300,
  R50,
} from '@atlaskit/theme/colors';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { themed } from '@atlaskit/theme/components';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import { sharedExpandStyles } from '@atlaskit/editor-common/ui';
import {
  akEditorSelectedNodeClassName,
  akLayoutGutterOffset,
  getSelectionStyles,
  SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { expandClassNames } from '@atlaskit/editor-common/styles';

const EXPAND_SELECTED_BACKGROUND = themed({
  light: token('color.background.neutral.subtle', 'rgba(255, 255, 255, 0.6)'),
  dark: token('color.background.neutral.subtle', 'rgba(9, 10, 11, 0.29)'),
});

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const EXPAND_ICON_COLOR = (props: ThemeProps) => css`
  color: ${themed({
    light: token('color.icon.subtle', N80A),
    dark: token('color.icon.subtle', '#d9dde3'),
  })(props)};
`;

const ACTIVE_STATE_BACKGROUND_COLOR = themed({
  dark: token('color.blanket.selected', `#0C294F4B`),
});
const ACTIVE_STATE_BORDER = themed({
  dark: `1px solid ${token('color.border.selected', `#4794ff4B`)}`,
});
const ACTIVE_STATE_BORDER_RADIUS = themed({ dark: '3px' });

const DANGER_STATE_BACKGROUND_COLOR = themed({
  light: token('color.background.danger', R50),
  dark: token('color.background.danger', '#441C13'),
});
const DANGER_STATE_BORDER = themed({
  dark: `1px solid ${token('color.border.danger', R200)}`,
});
const DANGER_STATE_BORDER_COLOR = themed({
  light: token('color.border.danger', R300),
});
const DANGER_STATE_BORDER_RADIUS = themed({
  dark: '3px',
});

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const expandStyles = (props: ThemeProps) => css`
  .${expandClassNames.icon} > div {
    display: flex;
  }

  .${expandClassNames.prefix} {
    ${sharedExpandStyles.containerStyles({ expanded: false, focused: false })(
      props,
    )}
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;

    td > & {
      margin-top: 0;
    }

    .${expandClassNames.iconContainer} svg {
      ${EXPAND_ICON_COLOR(props)};
      transform: rotate(90deg);
    }

    &.${akEditorSelectedNodeClassName}:not(.danger) {
      ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}

      ::after {
        // Custom background color and borders (for dark theme).
        background-color: ${ACTIVE_STATE_BACKGROUND_COLOR(props)};
        border: ${ACTIVE_STATE_BORDER(props)};
        border-radius: ${ACTIVE_STATE_BORDER_RADIUS(props)};
      }
    }

    &.danger {
      background: ${DANGER_STATE_BACKGROUND_COLOR(props)};
      border: ${DANGER_STATE_BORDER(props)};
      border-color: ${DANGER_STATE_BORDER_COLOR(props)};
      border-radius: ${DANGER_STATE_BORDER_RADIUS(props)};
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
    ${sharedExpandStyles.contentStyles({ expanded: false, focused: false })(
      props,
    )}
    cursor: text;
    padding-top: 0px;
  }

  .${expandClassNames.titleInput} {
    ${sharedExpandStyles.titleInputStyles(props)}
  }

  .${expandClassNames.titleContainer} {
    ${sharedExpandStyles.titleContainerStyles(props)};
    align-items: center;
    overflow: visible;
  }

  .${expandClassNames.expanded} {
    background: ${EXPAND_SELECTED_BACKGROUND(props)};
    border-color: ${themed({
      light: token('color.border', N40A),
      dark: token('color.border', DN50),
    })(props)};

    .${expandClassNames.content} {
      padding-top: ${token('space.100', '8px')};
    }
  }

  .${expandClassNames.inputContainer} {
    width: 100%;
  }

  /* stylelint-disable property-no-unknown, value-keyword-case */
  .${expandClassNames.prefix}:(.${expandClassNames.expanded}) {
    .expand-content-wrapper {
      height: auto;
    }
  }
  /* stylelint-enable property-no-unknown, value-keyword-case */

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
      ${EXPAND_ICON_COLOR(props)};
      transform: rotate(0deg);
    }

    &:not(.${akEditorSelectedNodeClassName}):not(.danger) {
      background: transparent;
      border-color: transparent;

      &:hover {
        border-color: ${themed({
          light: token('color.border', N50A),
          dark: token('color.border', DN50),
        })(props)};
        background: ${EXPAND_SELECTED_BACKGROUND(props)};
      }
    }
  }
`;
