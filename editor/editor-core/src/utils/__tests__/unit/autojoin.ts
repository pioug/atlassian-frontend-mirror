import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { p, ul, li, doc } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { autoJoinTr } from '@atlaskit/editor-common/utils';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { wrapInList } from '@atlaskit/editor-plugin-list/src/actions/wrap-and-join-lists';

describe('autoJoinTr', () => {
  // Adapted from https://github.com/ProseMirror/prosemirror-commands/blob/master/test/test-commands.js

  const { bulletList } = defaultSchema.nodes;
  let original: DocBuilder;
  let expected: DocBuilder;
  let tr: Transaction;

  afterEach(() => {
    expect(tr.doc).toEqualDocument(expected);
  });

  it('joins lists when deleting a paragraph between them', () => {
    original = doc(ul(li(p('a{<}'))), p('b{>}'), ul(li(p('c'))));
    expected = doc(ul(li(p('a')), li(p('c'))));

    const state = createEditorState(original);
    tr = state.tr;

    tr.deleteSelection();
    autoJoinTr(
      tr,
      (before, after) =>
        before.type === after.type && before.type === bulletList,
    );
  });

  it("doesn't join lists when deleting an item inside of them", () => {
    original = doc(ul(li(p('a{<}')), li(p('b{>}'))), ul(li(p('c'))));
    expected = doc(ul(li(p('a'))), ul(li(p('c'))));

    const state = createEditorState(original);
    tr = state.tr;

    tr.deleteSelection();
    autoJoinTr(
      tr,
      (before, after) =>
        before.type === after.type && before.type === bulletList,
    );
  });

  it('joins lists when wrapping a paragraph after them in a list', () => {
    original = doc(ul(li(p('a'))), p('b{<>}'));
    expected = doc(ul(li(p('a')), li(p('b'))));

    const state = createEditorState(original);
    tr = state.tr;

    wrapInList(bulletList)(tr);
    autoJoinTr(
      tr,
      (before, after) =>
        before.type === after.type && before.type === bulletList,
    );
  });

  it('joins lists when wrapping a paragraph between them in a list', () => {
    original = doc(ul(li(p('a'))), p('b{<>}'), ul(li(p('c'))));
    expected = doc(ul(li(p('a')), li(p('b')), li(p('c'))));

    const state = createEditorState(original);
    tr = state.tr;

    wrapInList(bulletList)(tr);
    autoJoinTr(
      tr,
      (before, after) =>
        before.type === after.type && before.type === bulletList,
    );
  });
});
