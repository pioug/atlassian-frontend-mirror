import {
  doc,
  code_block,
  breakout,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { getBreakoutMode } from '../../../utils/get-breakout-mode';

// Editor Plugins
import breakoutPlugin from '../../../';
import widthPlugin from '../../../../width';
import codeBlockPlugin from '../../../../code-block';

describe('Breakout Commands: getBreakoutMode', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should return a breakout mode of current node', () => {
    const { editorView } = createEditor({
      doc: doc(breakout({ mode: 'wide' })(code_block()('Hel{<>}lo'))),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    expect(getBreakoutMode(editorView.state)).toEqual('wide');
  });

  it('should return undefined for not breakout node', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    expect(getBreakoutMode(editorView.state)).toBeUndefined();
  });
});
