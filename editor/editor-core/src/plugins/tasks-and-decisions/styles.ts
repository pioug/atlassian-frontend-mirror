import { css } from 'styled-components';
import { akEditorSelectedNodeClassName } from '../../styles';
import { SelectionStyle } from '../selection/types';
import { getSelectionStyles } from '../selection/utils';

export const taskDecisionStyles = css`
  .${akEditorSelectedNodeClassName} > [data-decision-wrapper] {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }
`;
