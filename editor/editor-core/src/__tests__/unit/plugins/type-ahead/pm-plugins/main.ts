import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  code_block,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/schema-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText, insert } from '@atlaskit/editor-test-helpers/transactions';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';
import { selectCurrentItem } from '../../../../../plugins/type-ahead/commands/select-item';
import { pluginKey as typeAheadPluginKey } from '../../../../../plugins/type-ahead/pm-plugins/main';

describe('typeAhead main plugin', () => {
  const createEditor = createEditorFactory();

  it('should close typeahed if a query starts with a space', () => {
    const plugin = createTypeAheadPlugin();
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/ ', sel);
    expect(editorView.state.doc).toEqualDocument(doc(p('/ ')));
  });

  it('should handle inserting typeAheadQuery from type ahead', () => {
    const plugin = createTypeAheadPlugin({
      selectItem(state, _item, insert) {
        const mark = state.schema.mark('typeAheadQuery', {
          trigger: '@',
        });
        const mentionText = state.schema.text('@', [mark]);
        return insert(mentionText);
      },
    });
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, '/1 ', sel);
    selectCurrentItem()(editorView.state, editorView.dispatch);
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.trigger).toBe('@');
    expect(pluginState.active).toBe(true);
  });

  it('should handle chaining multiple typeAhead queries', () => {
    const plugin = createTypeAheadPlugin({
      selectItem(state, _item, insert) {
        const mark = state.schema.mark('typeAheadQuery', {
          trigger: '@',
        });
        const mentionText = state.schema.text('@', [mark]);
        return insert(mentionText);
      },
    });

    const mockGetItems = jest.fn(() => [
      { title: '4' },
      { title: '5' },
      { title: '6' },
    ]);

    const pluginMention = {
      pluginsOptions: {
        typeAhead: {
          trigger: '@',
          getItems: mockGetItems,
          selectItem: () => {},
        },
      },
    };

    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin, pluginMention],
    });
    insertText(editorView, '/', sel);
    sendKeyToPm(editorView, 'ArrowDown');
    selectCurrentItem()(editorView.state, editorView.dispatch);
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.trigger).toBe('@');
    expect(mockGetItems).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      {
        prevActive: false,
        queryChanged: true,
      },
      expect.anything(),
      expect.anything(),
    );
    expect(pluginState.items).toEqual([
      { title: '4' },
      { title: '5' },
      { title: '6' },
    ]);
    expect(pluginState.active).toBe(true);
  });

  it('should disable type ahead inside code blocks', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('{<>}')),
    });
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState.isAllowed).toBe(false);
  });

  it('should not return new pluginState when selection remains inside the same node', () => {
    const { editorView } = createEditor({
      doc: doc(code_block()('{<>}')),
    });
    const pluginState = typeAheadPluginKey.getState(editorView.state);
    sendKeyToPm(editorView, 'Enter');
    const newPluginState = typeAheadPluginKey.getState(editorView.state);
    expect(pluginState).toBe(newPluginState);
  });

  it('should dismiss type ahead when trigger has been removed', async () => {
    const { editorView } = createEditor({
      doc: doc(
        p(typeAheadQuery({ trigger: '/', query: 'test' })('{<}/test{>}')),
      ),
    });

    insert(editorView, ['']);

    expect(editorView.state.doc).toEqualDocument(doc(p('')));
  });
});
