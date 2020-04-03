import {
  doc,
  code_block,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { isBreakoutMarkAllowed } from '../../../utils/is-breakout-mark-allowed';

// Editor plugins
import breakoutPlugin from '../../../';
import widthPlugin from '../../../../width';
import codeBlockPlugin from '../../../../code-block';

describe('Breakout Commands: getBreakoutMode', () => {
  const createEditor = createProsemirrorEditorFactory();

  it('should return true for allowed nodes', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(codeBlockPlugin)
        .add(widthPlugin),
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(true);
  });

  it('should return false for not allowed nodes', () => {
    const { editorView } = createEditor({
      doc: doc(p('Hel{<>}lo')),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin),
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(false);
  });
});
