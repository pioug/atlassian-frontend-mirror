import {
  doc,
  code_block,
  breakout,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { setBreakoutMode } from '../../../commands/set-breakout-mode';

// Editor plugins
import breakoutPlugin from '../../../';
import widthPlugin from '../../../../width';
import codeBlockPlugin from '../../../../code-block';

describe('Breakout Commands: set-breakout-mode', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should wrap supported node in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add(codeBlockPlugin)
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin),
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
    );
  });
  it('should preserve node selection in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc('{<node>}', code_block()('Hello')),
      preset: new Preset<LightEditorPlugin>()
        .add(codeBlockPlugin)
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin),
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc('{<node>}', breakout({ mode: 'wide' })(code_block()('Hello'))),
    );
  });

  it('should not wrap unsupported node in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc(p('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin),
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(doc(p('Hel{<>}lo')));
  });

  it('should be able to change nodes breakout mode', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    setBreakoutMode('full-width')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(breakout({ mode: 'full-width' })(code_block()('Hel{<>}lo'))),
    );
  });
});
