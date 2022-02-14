import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import { toggleStrong } from '../../../text-formatting/commands/text-formatting';
import pastePlugin from '../../index';
import blockTypePlugin from '../../../block-type';
import { textFormattingPlugin } from '../../../index';
import hyperlinkPlugin from '../../../hyperlink/index';

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
});
