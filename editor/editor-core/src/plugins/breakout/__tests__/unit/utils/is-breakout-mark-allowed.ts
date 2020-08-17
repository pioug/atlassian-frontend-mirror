import {
  doc,
  code_block,
  p,
  expand,
  layoutSection,
  layoutColumn,
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
import expandPlugin from '../../../../expand';
import layoutPlugin from '../../../../layout';

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
  it('should return true for allowed selected nodes', () => {
    const { editorView } = createEditor({
      doc: doc('{<node>}', expand({ title: 'hello' })(p('hello'))),
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin)
        .add(expandPlugin),
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(true);
  });
  it(`shouldn't allow breakout on breakout-supported node nested inside breakout-supported node`, () => {
    const doc = layoutSection(
      layoutColumn({ width: 50 })(expand()(p('{<>}'))),
      layoutColumn({ width: 50 })(p('')),
    );
    const { editorView } = createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([breakoutPlugin, { allowBreakoutButton: true }])
        .add(widthPlugin)
        .add(expandPlugin)
        .add(layoutPlugin),
    });

    expect(isBreakoutMarkAllowed(editorView.state)).toBe(false);
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
