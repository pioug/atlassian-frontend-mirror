import * as defaultSchema from '@atlaskit/adf-schema';
import type {
  EditorPlugin,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

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
  });
});
