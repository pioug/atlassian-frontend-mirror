import { EditorState } from 'prosemirror-state';

import { RefsNode } from '@atlaskit/editor-test-helpers/doc-builder';

import { Command } from '../../types';

import { selectionFor } from './selection-for';

export function testCommand(
  doc: RefsNode,
  command: Command,
  result: RefsNode | null,
) {
  let state = EditorState.create({ doc, selection: selectionFor(doc) });
  let ran = command(state, (tr) => (state = state.apply(tr)));
  if (result == null) {
    expect(ran).toEqual(false);
  } else {
    expect(state.doc.eq(result)).toBeTruthy();
  }
}
