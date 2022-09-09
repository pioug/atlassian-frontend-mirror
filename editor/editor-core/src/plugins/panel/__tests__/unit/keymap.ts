import {
  doc,
  p,
  panel,
  DocBuilder,
  blockquote,
  table,
  tr,
  td,
  tdEmpty,
  tdCursor,
  thEmpty,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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

  it('should not merge two panels, when entering backspace in an empty panel', () => {
    const { editorView } = editor(
      doc(panel({ panelType: 'info' })(p()), panel({ panelType: 'info' })(p())),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });

  it('should not merge two quotes, when entering backspace in an empty panel', () => {
    const { editorView } = editor(doc(blockquote(p()), blockquote(p())));

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(doc(blockquote(p())));
  });

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
  });

  describe('when delete blockquote', () => {
    it('should allow delete blockquote in first line', () => {
      const { editorView } = editor(doc(blockquote(p('{<>}'))));

      sendKeyToPm(editorView, 'Backspace');

      expect(editorView.state.doc).toEqualDocument(doc(p('{<>}')));
    });

    it('should allow delete deep nested blockquote', () => {
      const { editorView } = editor(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(thEmpty, thEmpty),
            tr(td()(blockquote(p('{<>}'))), tdEmpty),
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
  });
});
