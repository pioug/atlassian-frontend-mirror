import {
  doc,
  code_block,
  breakout,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { removeBreakout } from '../../../commands/remove-breakout';

// Editor plugins
import breakoutPlugin from '../../../';
import widthPlugin from '../../../../width';
import codeBlockPlugin from '../../../../code-block';

describe('Breakout Commands: remove-breakout', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should remove breakout mark from a given node', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    removeBreakout()(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(code_block()('Hel{<>}lo')),
    );
  });
  it('should preserve node selection after removing breakout', () => {
    const { editorView } = createEditor({
      doc: doc('{<node>}', breakout({ mode: 'wide' })(code_block()('Hello'))),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    removeBreakout()(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc('{<node>}', code_block()('Hello')),
    );
  });
});
