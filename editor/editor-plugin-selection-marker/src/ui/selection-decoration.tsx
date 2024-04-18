import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

const decorationStyle = `
    background-color: ${token(
      'color.background.accent.gray.subtler',
      '#DCDFE4',
    )};
  `;

const decorationHighlightStyle = `
    background-color: ${token(
      'color.background.accent.blue.subtlest',
      '#E9F2FF',
    )};
    border-bottom: 2px solid ${token(
      'color.background.accent.blue.subtler',
      '#cce0ff',
    )};
  `;

export const selectionDecoration = (
  doc: PMNode,
  selection: Selection,
  isHighlight: boolean,
) => {
  const selectionDecorations: Decoration[] = [];

  doc.nodesBetween(selection.from, selection.to, (currentNode, nodePos) => {
    if (!currentNode.isText) {
      return true;
    }

    let decorationFrom = selection.from;
    let decorationTo = selection.to;

    if (nodePos > selection.from) {
      decorationFrom = nodePos;
    }

    if (nodePos + currentNode.nodeSize < selection.to) {
      decorationTo = nodePos + currentNode.nodeSize;
    }

    selectionDecorations.push(
      Decoration.inline(decorationFrom, decorationTo, {
        style: isHighlight ? decorationHighlightStyle : decorationStyle,
        'data-testid': 'selection-marker-selection',
      }),
    );
    return true;
  });

  return selectionDecorations;
};
