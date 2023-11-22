import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  doc,
  p,
  panel,
  table,
  td,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('panel plugin -> keymap', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowTables: { advanced: true },
        allowPanel: true,
        allowRule: true,
        allowLayouts: true,
        allowNewInsertionBehaviour: true,
        quickInsert: true,
        media: {
          allowMediaSingle: true,
        },
      },
    });
  };
  describe('when delete panel', () => {
    it('should allow delete panel in first line', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p('{<>}'))),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(doc(p('{<>}')));
    });

    it('should allow delete deep nested panel', () => {
      const { editorView } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(thEmpty, thEmpty),
            tr(td()(panel({ panelType: 'info' })(p('{<>}'))), tdEmpty),
          ),
        ),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(thEmpty, thEmpty),
            tr(tdCursor, tdEmpty),
          ),
        ),
      );
    });

    it('should not merge two panels, when entering backspace in an empty panel', () => {
      const { editorView } = editor(
        doc(
          panel({ panelType: 'info' })(p()),
          panel({ panelType: 'info' })(p()),
        ),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ panelType: 'info' })(p())),
      );
    });
  });

  describe('when delete blockquote', () => {
    it('should not merge blockquote and panel, when entering backspace in an empty panel', () => {
      const { editorView } = editor(
        doc(blockquote(p()), panel({ panelType: 'info' })(p())),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
    });

    it('should not merge panel and blockquote, when entering backspace in an empty blockquote', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p()), blockquote(p())),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ panelType: 'info' })(p())),
      );
    });

    it('should not merge panel and blockquote, when entering backspace in a non-empty blockquote', () => {
      const { editorView } = editor(
        doc(panel({ panelType: 'info' })(p()), blockquote(p('{<>}text'))),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ panelType: 'info' })(p()), p('text')),
      );
    });

    it('should not merge panel and blockquote, when entering backspace in a blockquote with empty first paragraph', () => {
      const { editorView } = editor(
        doc(
          panel({ panelType: 'info' })(p()),
          blockquote(p('{<>}'), p('text')),
        ),
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(
        doc(panel({ panelType: 'info' })(p()), blockquote(p('text'))),
      );
    });

    it('should not merge two blockquotes, when entering backspace in an empty blockquote', () => {
      const { editorView } = editor(doc(blockquote(p()), blockquote(p())));

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
    });
  });
});
