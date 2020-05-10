import { css } from 'styled-components';
import {
  panelSharedStyles,
  PanelSharedCssClassName,
} from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';

export const panelStyles = css`
  .ProseMirror {
    .${PanelSharedCssClassName.prefix} {
      cursor: pointer;
    }

    .${PanelSharedCssClassName.content} {
      cursor: text;
    }
    ${panelSharedStyles};
  }

  .${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName} {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
