import { DecorationSet, Decoration } from 'prosemirror-view';
import { NodeSelection, Transaction } from 'prosemirror-state';
import {
  akEditorSelectedBorderSize,
  akEditorSelectedBorder,
  akEditorSelectedBgColor,
  akEditorSelectedBlanketColor,
  akEditorSelectedBlanketOpacity,
} from '@atlaskit/editor-common';
import { SelectionStyle } from './types';
import { akEditorSelectedNodeClassName } from '../../styles';

export const getDecorations = (tr: Transaction): DecorationSet => {
  if (tr.selection instanceof NodeSelection) {
    return DecorationSet.create(tr.doc, [
      Decoration.node(tr.selection.from, tr.selection.to, {
        class: akEditorSelectedNodeClassName,
      }),
    ]);
  }
  return DecorationSet.empty;
};

/**
 * Adds correct selection styling for a node
 * Pass in which selection style properties you want and it will return css string of necessary styles
 *
 * eg.
 *  .expand.ak-editor-selected-node {
 *    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
 *  }
 *
 */
export const getSelectionStyles = (
  selectionStyles: Array<SelectionStyle>,
): string =>
  selectionStyles
    .map(selectionStyle => getSelectionStyle(selectionStyle))
    .join('\n');

const getSelectionStyle = (style: SelectionStyle): string => {
  switch (style) {
    case SelectionStyle.Border:
      return `border: ${akEditorSelectedBorderSize}px solid ${akEditorSelectedBorder};`;
    case SelectionStyle.BoxShadow:
      return `
        box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorSelectedBorder};
        border-color: transparent;`;
    case SelectionStyle.Background:
      return `background-color: ${akEditorSelectedBgColor};`;
    case SelectionStyle.Blanket:
      return `
        position: relative;

        // Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
        // in Safari. Looks like it's caused by user-select: all in the emoji element
        -webkit-user-select: text;

        ::after {
          position: absolute;
          content: '';
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          opacity: ${akEditorSelectedBlanketOpacity};
          pointer-events: none;
          background-color: ${akEditorSelectedBlanketColor}
        }`;
    default:
      return '';
  }
};
