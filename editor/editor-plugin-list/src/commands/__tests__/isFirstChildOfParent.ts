// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, li, p, ul } from '@atlaskit/editor-test-helpers/doc-builder';

import { isFirstChildOfParent } from '../isFirstChildOfParent';

describe('isFirstChildOfParent', () => {
  const createEditor = createEditorFactory();

  describe('top level paragraphs', () => {
    it('returns true for first paragraph at top level', () => {
      const { editorView } = createEditor({
        doc: doc(p('{<>}hello'), p('world')),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });

    it('returns true for second paragraph at top level', () => {
      const { editorView } = createEditor({
        doc: doc(p('hello'), p('wo{<>}rld')),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });
  });

  describe('list item with two paragraphs', () => {
    it('returns true with selection in first', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('{<>}hello'), p('world')))),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });

    it('returns false with selection in second', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('hello'), p('wo{<>}rld')))),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(false);
    });
  });

  describe('multiple list items', () => {
    it('returns true with selection in start of second li', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first')), li(p('{<>}hello')))),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });

    it('returns true with selection in first p of first nested li', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first'), ul(li(p('{<>}hello'), p('world')))))),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });

    it('returns false with selection in second p of first nested li', () => {
      const { editorView } = createEditor({
        doc: doc(ul(li(p('first'), ul(li(p('hello'), p('{<>}world')))))),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(false);
    });

    it('returns true with selection at start of first p of second nested li', () => {
      const { editorView } = createEditor({
        doc: doc(
          ul(
            li(p('first'), ul(li(p('hello'), p('world')), li(p('{<>}second')))),
          ),
        ),
      });

      expect(isFirstChildOfParent(editorView.state)).toBe(true);
    });
  });
});
