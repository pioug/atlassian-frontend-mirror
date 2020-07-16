import { css } from 'styled-components';
import {
  panelSharedStyles,
  PanelSharedCssClassName,
  akEditorDeleteBackground,
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
} from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';

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
      background-color: ${akEditorDeleteBackgroundWithOpacity};

      .${PanelSharedCssClassName.icon} {
        color: ${akEditorDeleteIconColor};
      }
    }

    ${panelSharedStyles};
  }

  .${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
