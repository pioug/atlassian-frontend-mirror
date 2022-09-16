import * as defaultSchema from '@atlaskit/adf-schema';
import type { Schema } from 'prosemirror-model';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  DocBuilder,
  doc,
  p,
  table,
  td,
  tr as tableRow,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { EditorPlugin } from '../../../types/editor-plugin';
import { handleInsertContent } from '../../insert-content-handlers';

describe('#handleInsertContent: Insert Nodes', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder, fakeEditorPlugin: () => EditorPlugin) => {
    const preset = new Preset<EditorPlugin>().add(fakeEditorPlugin);
    const editorPlugins = preset.getEditorPlugins();

    return {
      ...createEditor({
        doc,
        preset,
      }),
      editorPlugins,
    };
  };

  describe('when there is no create node handler', () => {
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

      pluginsOptions: {},
    });

    it('should insert a default table', () => {
      const { editorView, editorPlugins } = editor(
        doc(p('{<>}')),
        fakeTableEditorPlugin,
      );

      const { state } = editorView;

      const tr = state.tr;
      handleInsertContent({
        node: 'table',
        options: {
          selectNodeInserted: false,
        },
        editorPlugins,
      })(tr);

      expect(tr).toEqualDocumentAndSelection(
        doc(
          // prettier-ignore
          table()(
            tableRow(
              td()(
                p('{<>}'),
              ),
            ),
          ),
        ),
      );
    });
  });

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
      const { editorView, editorPlugins } = editor(
        doc(p('{<>}')),
        fakeTableEditorPlugin,
      );

      const { state } = editorView;

      const tr = state.tr;
      handleInsertContent({
        node: 'table',
        options: {
          selectNodeInserted: false,
        },
        editorPlugins,
      })(tr);

      expect(tr).toEqualDocumentAndSelection(doc(p('LOL{<>}')));
    });
  });
});
