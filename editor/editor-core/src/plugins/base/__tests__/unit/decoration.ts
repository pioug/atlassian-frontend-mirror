import {
  doc,
  panel,
  layoutSection,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  hoverDecoration,
  decorationStateKey,
  DecorationState,
} from '../../pm-plugins/decoration';
import { deleteActiveLayoutNode } from '../../../layout/actions';
import panelPlugin from '../../../panel';
import layoutPlugin from '../../../layout';

describe('decoration', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(panelPlugin)
        .add(layoutPlugin),
    });
  };

  it('adds a decoration', () => {
    const { editorView } = editor(doc(panel()(p('he{<>}llo'))));
    const { dispatch } = editorView;

    hoverDecoration(editorView.state.schema.nodes.panel, true)(
      editorView.state,
      dispatch,
    );
    const pluginState: DecorationState = decorationStateKey.getState(
      editorView.state,
    );

    expect(pluginState.decoration).toBeDefined();
    expect(pluginState.decoration!.from).toBe(0);
  });

  it('removes decoration when node is deleted from document', () => {
    const { editorView } = editor(
      doc(
        panel()(p('hello')),
        layoutSection(
          layoutColumn({ width: 50 })(p('{<>}')),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    );

    const {
      dispatch,
      state: {
        schema: { nodes },
      },
    } = editorView;

    hoverDecoration(nodes.layoutSection, true)(editorView.state, dispatch);
    deleteActiveLayoutNode(editorView.state, dispatch);

    const pluginState = decorationStateKey.getState(editorView.state);
    expect(pluginState.decoration).toBeUndefined();
  });
});
