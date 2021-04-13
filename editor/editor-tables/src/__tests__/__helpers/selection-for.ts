import { NodeSelection, Selection, TextSelection } from 'prosemirror-state';

import { RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';

import { CellSelection } from '../../cell-selection';
import { cellAround } from '../../utils/cells';

export const selectionFor = (doc: RefsNode): Selection | undefined => {
  const { cursor, anchor, head, node } = doc.refs;
  if (cursor !== undefined) {
    return new TextSelection(doc.resolve(cursor));
  }
  if (anchor !== undefined) {
    const $anchor = cellAround(doc.resolve(anchor));
    const $head = head !== undefined ? cellAround(doc.resolve(head)) : null;

    if (!$anchor) {
      throw new Error('selectionFor: $anchor should be defined');
    }

    return new CellSelection($anchor, $head || undefined);
  }
  if (node !== undefined) {
    return new NodeSelection(doc.resolve(node));
  }
};
