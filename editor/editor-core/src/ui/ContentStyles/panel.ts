import { css } from '@emotion/react';

import {
  PanelSharedCssClassName,
  panelSharedStyles,
} from '@atlaskit/editor-common/panel';
import {
  akEditorDeleteBackground,
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorDeleteIconColor,
  akEditorSelectedBorderSize,
  akEditorSelectedNodeClassName,
  getSelectionStyles,
  SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const panelStyles = () => css`
  .ProseMirror {
    .${PanelSharedCssClassName.prefix} {
      cursor: pointer;

      /* Danger when top level node */
      &.danger {
        box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
          ${akEditorDeleteBorder};
        background-color: ${token(
          'color.background.danger',
          akEditorDeleteBackground,
        )} !important;

        .${PanelSharedCssClassName.icon} {
          color: ${token(
            'color.icon.danger',
            akEditorDeleteIconColor,
          )} !important;
        }
      }
    }

    .${PanelSharedCssClassName.content} {
      cursor: text;
    }

    /* Danger when nested node */
    .danger .${PanelSharedCssClassName.prefix} {
      &[data-panel-type] {
        background-color: ${token(
          'color.blanket.danger',
          akEditorDeleteBackgroundWithOpacity,
        )};

        .${PanelSharedCssClassName.icon} {
          color: ${token('color.icon.danger', akEditorDeleteIconColor)};
        }
      }
    }

    ${panelSharedStyles()};
  }

  .${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
