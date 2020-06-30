import {
  NodeSelection,
  Transaction,
  TextSelection,
  EditorState,
} from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import {
  akEditorSelectedBgColor,
  akEditorSelectedBlanketColor,
  akEditorSelectedBlanketOpacity,
  akEditorSelectedBorder,
  akEditorSelectedBorderSize,
} from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';

import { SelectionStyle, SelectionPluginState } from './types';

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

export function shouldRecalcDecorations(
  pluginState: SelectionPluginState,
  state: EditorState,
): boolean {
  const { selection: oldSelection, decorationSet } = pluginState;
  const { selection: newSelection } = state;

  // If selection is unchanged, no need to recalculate
  if (oldSelection.eq(newSelection)) {
    // We need this special case for NodeSelection, as Prosemirror still thinks the
    // selections are equal when the node has changed
    if (
      oldSelection instanceof NodeSelection &&
      newSelection instanceof NodeSelection
    ) {
      const oldDecorations = decorationSet.find();
      const newDecorations = getDecorations(state.tr).find();
      // There might not be old or new decorations if the node selection is for a text node
      // This wouldn't have happened intentionally, but we need to handle this case regardless
      if (oldDecorations.length > 0 && newDecorations.length > 0) {
        return !(oldDecorations[0] as Decoration & {
          eq: (other: Decoration) => boolean;
        }).eq(newDecorations[0]);
      }
      return !(oldDecorations.length === 0 && newDecorations.length === 0);
    }
    return false;
  }

  // There's no point updating decorations if going from one standard TextSelection to another
  if (
    oldSelection instanceof TextSelection &&
    newSelection instanceof TextSelection &&
    oldSelection.from === oldSelection.to &&
    newSelection.from === newSelection.to
  ) {
    return false;
  }

  return true;
}
