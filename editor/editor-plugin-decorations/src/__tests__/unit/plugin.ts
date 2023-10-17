import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
// TODO: These should be updated once we extract these plugins to separate packages
// eslint-disable-next-line import/no-extraneous-dependencies
import layoutPlugin from '@atlaskit/editor-core/src/plugins/layout';
// eslint-disable-next-line import/no-extraneous-dependencies
import { deleteActiveLayoutNode } from '@atlaskit/editor-core/src/plugins/layout/actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import panelPlugin from '@atlaskit/editor-core/src/plugins/panel';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  layoutColumn,
  layoutSection,
  mention,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { decorationsPlugin } from '../../plugin';
import type { DecorationState } from '../../pm-plugin';

const ref: { current: any | null } = { current: null };

const mockPlugin: NextEditorPlugin<
  'test',
  { dependencies: [typeof decorationsPlugin] }
> = ({ api }) => {
  ref.current = api;
  return {
    name: 'test',
  };
};

describe('decoration', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(decorationsPlugin)
        .add(mockPlugin)
        .add(panelPlugin)
        .add(layoutPlugin)
        .add(typeAheadPlugin)
        .add(mentionsPlugin),
    });
  };

  const getState = () => {
    return ref.current?.decorations.sharedState.currentState();
  };

  const getHoverDecoration = () => ref.current?.decorations.actions ?? {};

  it('adds a decoration', () => {
    const { editorView } = editor(doc(panel()(p('he{<>}llo'))));
    const { dispatch } = editorView;

    getHoverDecoration().hoverDecoration?.(
      editorView.state.schema.nodes.panel,
      true,
    )(editorView.state, dispatch);
    const pluginState: DecorationState = getState();

    expect(pluginState.decoration).toBeDefined();
    expect(pluginState.decoration!.from).toBe(0);
  });

  it('adds decoration when node selection is set on the same node', () => {
    const { editorView } = editor(doc('{<node>}', panel()(p('hello'))));
    const { dispatch } = editorView;

    getHoverDecoration().hoverDecoration?.(
      editorView.state.schema.nodes.panel,
      true,
    )(editorView.state, dispatch);
    const pluginState: DecorationState = getState();

    expect(pluginState.decoration).toBeDefined();
    expect(pluginState.decoration!.from).toBe(0);
  });

  it('adds decoration to parent when node selection is set on a child node', () => {
    const helgaMention = mention({ id: '1234', text: '@helga' });
    const { editorView } = editor(doc(panel()(p('{<node>}', helgaMention()))));
    const { dispatch } = editorView;

    getHoverDecoration().hoverDecoration?.(
      editorView.state.schema.nodes.panel,
      true,
    )(editorView.state, dispatch);
    const pluginState: DecorationState = getState();

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

    getHoverDecoration().hoverDecoration?.(nodes.layoutSection, true)(
      editorView.state,
      dispatch,
    );
    deleteActiveLayoutNode(editorView.state, dispatch);

    const pluginState = getState();
    expect(pluginState.decoration).toBeUndefined();
  });
});
