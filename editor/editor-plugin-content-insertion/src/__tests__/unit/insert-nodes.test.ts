import * as defaultSchema from '@atlaskit/adf-schema';
import type {
  DocBuilder,
  EditorPlugin,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  tdCursor,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { contentInsertionPlugin } from '../../plugin';
import { handleInsertContent } from '../../plugin/insert-content-handlers';

describe('#handleInsertContent: Insert Nodes', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder, fakeEditorPlugin: () => EditorPlugin) => {
    const preset = new Preset<EditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(fakeEditorPlugin as NextEditorPlugin<string>);
    const editorPlugins = preset.build();

    return {
      ...createEditor({
        doc,
        preset,
      }),
      editorPlugins,
    };
  };

  describe('when there is a create node handler', () => {
    const fakeTableEditorPlugin: () => EditorPlugin = () => ({
      name: 'fakeTableEditorPlugin',

      nodes() {
        return [
          { name: 'table', node: defaultSchema.table },
          { name: 'tableHeader', node: defaultSchema.tableHeader },
          { name: 'tableRow', node: defaultSchema.tableRow },
          { name: 'tableCell', node: defaultSchema.tableCell },
        ];
      },

      pluginsOptions: {
        createNodeHandler: ({ schema }: { schema: Schema }) => {
          return schema.text('LOL');
        },
      },
    });

    it('should insert a default table', () => {
      const { editorView } = editor(doc(p('{<>}')), fakeTableEditorPlugin);

      const { state } = editorView;

      const tr = state.tr;
      handleInsertContent({
        node: state.schema.text('LOL'),
        options: {
          selectNodeInserted: false,
        },
      })(tr);

      expect(tr).toEqualDocumentAndSelection(doc(p('LOL{<>}')));
    });

    describe('should insert a block node correctly', () => {
      ffTest(
        'platform.editor.content-insertion.block-node-prefer-insert-after-selection',
        () => {
          const { editorView } = editor(
            doc(p('Hel{<}lo wo{>}rld')),
            fakeTableEditorPlugin,
          );

          const { state, dispatch } = editorView;

          const t = state.tr;

          handleInsertContent({
            node: state.schema.nodes.table.createAndFill()!,
            options: {
              selectNodeInserted: false,
            },
          })(t);
          dispatch(t);

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(p('Hello world'), table()(tr(tdCursor))),
          );
        },
        () => {
          const { editorView } = editor(
            doc(p('Hel{<}lo wo{>}rld')),
            fakeTableEditorPlugin,
          );

          const { state, dispatch } = editorView;

          const t = state.tr;

          handleInsertContent({
            node: state.schema.nodes.table.createAndFill()!,
            options: {
              selectNodeInserted: false,
            },
          })(t);
          dispatch(t);

          expect(editorView.state).toEqualDocumentAndSelection(
            doc(p('Helrld'), table()(tr(tdCursor))),
          );
        },
      );
    });
  });
});
