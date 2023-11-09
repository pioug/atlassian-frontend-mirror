// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  code_block,
  breakout,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { setBreakoutMode } from '../../../commands/set-breakout-mode';

// Editor plugins
import breakoutPlugin from '../../../';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('Breakout Commands: set-breakout-mode', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should wrap supported node in breakout mark', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add(widthPlugin)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add([breakoutPlugin, { allowBreakoutButton: true }]),
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
        .add(widthPlugin)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([codeBlockPlugin, { appearance: 'full-page' }])
        .add([breakoutPlugin, { allowBreakoutButton: true }]),
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
        .add(widthPlugin)
        .add([breakoutPlugin, { allowBreakoutButton: true }]),
    });

    setBreakoutMode('wide')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(doc(p('Hel{<>}lo')));
  });

  it('should be able to change nodes breakout mode', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      preset: new Preset<LightEditorPlugin>()
        .add(widthPlugin)
        .add(decorationsPlugin)
        .add(compositionPlugin)
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add([codeBlockPlugin, { appearance: 'full-page' }]),
    });

    setBreakoutMode('full-width')(editorView.state, editorView.dispatch);

    expect(editorView.state).toEqualDocumentAndSelection(
      doc(breakout({ mode: 'full-width' })(code_block()('Hel{<>}lo'))),
    );
  });
});
