import { PluginConfig } from '../../../../plugins/table/types';
import { setTextSelection } from '../../../../utils/selection';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  FloatingToolbarPluginState,
  pluginKey as floatingToolbarPluginKey,
} from '../../../../plugins/floating-toolbar';
import { setEditorFocus } from '../../../../plugins/table/commands';
import { EditorState } from 'prosemirror-state';

describe('table floating toolbar', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
    } as PluginConfig;

    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
      },
    });
  };

  describe('when selecting a cell', () => {
    it('should contain the floating toolbar info within the first dispatch', () => {
      const { editorView, onEditorViewStateUpdatedCallbacks } = editor(
        doc(
          p('te{<>}xt'),
          table()(
            tr(
              th({ colwidth: [100, 100] })(p('1')),
              th({ colwidth: [100, 100] })(p('2')),
              th({ colwidth: [480] })(p('3')),
            ),
            tr(
              td({ colwidth: [100, 100] })(p('4')),
              td({ colwidth: [100, 100] })(p('5')),
              td({ colwidth: [480] })(p('6')),
            ),
          ),
        ),
      );

      setEditorFocus(true)(editorView.state, editorView.dispatch);
      setTextSelection(editorView, 5);

      const pluginStates: Array<{ config: any } | null | undefined> = [];

      const mock = jest.fn(
        ({ newEditorState }: { newEditorState: EditorState }) => {
          const { getConfigWithNodeInfo } = floatingToolbarPluginKey.getState(
            newEditorState,
          ) as FloatingToolbarPluginState;
          pluginStates.push(getConfigWithNodeInfo(editorView.state));
        },
      );

      onEditorViewStateUpdatedCallbacks.push({
        pluginName: 'listener',
        callback: mock,
      });
      setTextSelection(editorView, 9);

      expect(pluginStates).toHaveLength(2);
      // Inner dispatch for #findTable
      const firstCall = pluginStates[0];
      expect(firstCall).toBeTruthy();
      expect(firstCall!.config).toBeTruthy();

      // Outer dispatch for selection change
      const secondCall = pluginStates[1];
      expect(secondCall).toBeTruthy();
      expect(secondCall!.config).toBeTruthy();
    });
  });
});
