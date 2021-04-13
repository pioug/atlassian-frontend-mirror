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

describe('Paste plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add(blockTypePlugin)
        .add(textFormattingPlugin),
    });

  beforeEach(() => {
    ({ editorView } = editor(doc(p('{<>}'))));
  });

  describe('cmd+shift+v', () => {
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

    it('pastes plain text', () => {
      paste();
      expect(editorView.state.doc).toMatchSnapshot();
    });

    it('preserves current formatting when pasting', () => {
      toggleStrong()(editorView.state, editorView.dispatch);
      paste();
      expect(editorView.state.doc).toMatchSnapshot();
    });
  });
});
