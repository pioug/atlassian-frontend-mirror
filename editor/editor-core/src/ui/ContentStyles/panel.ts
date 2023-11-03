import { css } from '@emotion/react';

import {
  panelSharedStyles,
  PanelSharedCssClassName,
} from '@atlaskit/editor-common/panel';
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
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const panelStyles = (props: ThemeProps) => css`
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

    ${panelSharedStyles(props)};
  }

  .${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
