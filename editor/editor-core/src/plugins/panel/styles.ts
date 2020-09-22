import { css } from 'styled-components';

import {
  panelSharedStyles,
  PanelSharedCssClassName,
} from '@atlaskit/editor-common';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBackground,
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const panelStyles = css`
  .ProseMirror {
    .${PanelSharedCssClassName.prefix} {
      cursor: pointer;

      /* Danger when top level node */
      &.danger {
        box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
          ${akEditorDeleteBorder};
        background-color: ${akEditorDeleteBackground} !important;

        .${PanelSharedCssClassName.icon} {
          color: ${akEditorDeleteIconColor} !important;
        }
      }
    }

    .${PanelSharedCssClassName.content} {
      cursor: text;
    }

    /* Danger when nested node */
    .danger .${PanelSharedCssClassName.prefix} {
      &[data-panel-type] {
        background-color: ${akEditorDeleteBackgroundWithOpacity};

        .${PanelSharedCssClassName.icon} {
          color: ${akEditorDeleteIconColor};
        }
      }
    }

    ${panelSharedStyles};
  }

  .${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
