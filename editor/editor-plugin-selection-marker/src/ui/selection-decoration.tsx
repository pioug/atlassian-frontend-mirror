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
  selection: Selection,
  isHighlight: boolean,
) => {
  return Decoration.inline(selection.from, selection.to, {
    style: isHighlight ? decorationHighlightStyle : decorationStyle,
    'data-testid': 'selection-marker-selection',
  });
};
