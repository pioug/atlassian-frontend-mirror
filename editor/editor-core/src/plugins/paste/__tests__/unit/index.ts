import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { EditorView } from 'prosemirror-view';
import { toggleStrong } from '../../../text-formatting/commands/text-formatting';
import pastePlugin from '../../index';
import blockTypePlugin from '../../../block-type';
import { textFormattingPlugin } from '../../../index';
import hyperlinkPlugin from '../../../hyperlink/index';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  panel,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('Paste plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder, plainTextPasteLinkification: boolean) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, { plainTextPasteLinkification }])
        .add(blockTypePlugin)
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin),
    });

  describe('With plainTextPasteLinkification FF enabled', () => {
    beforeEach(() => {
      ({ editorView } = editor(doc(p('{<>}')), true));
    });

    describe('cmd+shift+v', () => {
      describe('content without any links', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span></div></div>`,
              plain: 'export interface PasteContent',
            },
            { shift: true },
          );
        };

        it('pastes plain text (ie. removes formatting from pasted content)', () => {
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it('preserves current formatting when pasting (ie. removes formatting, applies active formatting)', () => {
          toggleStrong()(editorView.state, editorView.dispatch);
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });

      describe('content with link', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span> <a href="https://www.google.com">https://www.google.com</a> <span>some more content</span></div></div>`,
              plain:
                'export interface PasteContent https://www.google.com some more content',
            },
            { shift: true },
          );
        };
        it('pastes plain text but creates hyperlink (ie. removes formatting from pasted content)', () => {
          // This does not test that it doesn't create a *smart* link.
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it('preserves current formatting when pasting, creates hyperlink (ie. removes formatting, applies active formatting)', () => {
          // This does not test that it doesn't create a *smart* link.
          toggleStrong()(editorView.state, editorView.dispatch);
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });
    });
  });

  describe('With plainTextPasteLinkification FF disabled', () => {
    beforeEach(() => {
      ({ editorView } = editor(doc(p('{<>}')), false));
    });
    describe('cmd+shift+v', () => {
      describe('content without any links', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span></div></div>`,
              plain: 'export interface PasteContent',
            },
            { shift: true },
          );
        };

        it('pastes plain text (ie. removes formatting from pasted content)', () => {
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it('preserves current formatting when pasting (ie. removes formatting, applies active formatting)', () => {
          toggleStrong()(editorView.state, editorView.dispatch);
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });

      describe('content with link', () => {
        const paste = () => {
          dispatchPasteEvent(
            editorView,
            {
              html: `<meta charset='utf-8'><div style="color: #333333;background-color: #f5f5f5;font-family: Menlo, Monaco, 'Courier New', monospace;font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #4b69c6;">export</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;">interface</span><span style="color: #333333;"> </span><span style="color: #7a3e9d;font-weight: bold;">PasteContent</span> <a href="https://www.google.com">https://www.google.com</a> <span>some more content</span></div></div>`,
              plain:
                'export interface PasteContent https://www.google.com some more content',
            },
            { shift: true },
          );
        };
        it("pastes plain text and doesn't create hyperlink", () => {
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });

        it(`preserves current formatting when pasting, doesn't create hyperlink (ie. removes formatting, applies active formatting)`, () => {
          // This does not test that it doesn't create a *smart* link.
          toggleStrong()(editorView.state, editorView.dispatch);
          paste();
          expect(editorView.state.doc).toMatchSnapshot();
        });
      });
    });
  });

  describe('when pasting content copied from the top level of the document (openStart is 0)', () => {
    describe('into a panel', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(doc(panel()(p('{<>}')))));
      });

      it('the panel should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(doc(panel({})(p('abc'))));
      });
      it('the panel should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel({})(p('abc'), p('123'))),
        );
      });
    });
    describe('into an actions list', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('{<>}'),
            ),
          ),
        ));
      });

      it('the first action item should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('abc'),
            ),
          ),
        );
      });
      it('the first action item should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'test-id' })(
              taskItem({ localId: 'test-id' })('abc'),
            ),
            p('123'),
          ),
        );
      });
    });
    describe('into a decision list', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory();
        const editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowPanel: {
                allowCustomPanel: true,
                allowCustomPanelEdit: true,
              },
              allowTasksAndDecisions: true,
            },
          });

        ({ editorView } = editor(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('{<>}'),
            ),
          ),
        ));
      });

      it('the first decision item should not disappear when pasting one paragraph', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('abc'),
            ),
          ),
        );
      });
      it('the first decision item should not disappear when pasting multiple paragraphs', () => {
        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="0 0 []">abc</p><p>123</p>`,
          plain: 'export interface PasteContent',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'test-id' })(
              decisionItem({ localId: 'test-id' })('abc'),
            ),
            p('123'),
          ),
        );
      });
    });
  });
});
