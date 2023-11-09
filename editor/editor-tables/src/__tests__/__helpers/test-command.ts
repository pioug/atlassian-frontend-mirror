// eslint-disable-next-line import/no-extraneous-dependencies
import type { RefsNode } from '@atlaskit/editor-common/types';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../../types';

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
