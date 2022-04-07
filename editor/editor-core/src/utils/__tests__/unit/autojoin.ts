import {
  p,
  ul,
  li,
  doc,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { Transaction } from 'prosemirror-state';
import { autoJoinTr } from '../../prosemirror/autojoin';
import { wrapInList } from '../../../plugins/list/actions/wrap-and-join-lists';

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
