import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  code_block,
  typeAheadQuery,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { insertText, insert } from '@atlaskit/editor-test-helpers/transactions';
import { createTypeAheadPlugin } from './_create-type-ahead-plugin';

// import { selectCurrentItem } from '../../../commands/select-item';
import { insertTypeAheadItem } from '../../../commands/insert-type-ahead-item';
import { pluginKey as typeAheadPluginKey } from '../../../pm-plugins/key';
import { TypeAheadItem } from '../../../types';

describe.skip('typeAhead main plugin', () => {
  const createEditor = createEditorFactory();

  it('should close typeahead if a query starts with a space', () => {
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
    insertTypeAheadItem(editorView);
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
    insertTypeAheadItem(editorView);
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

  it('should insert item returned by forceSelect. ', () => {
    const mockItems = [
      { title: 'Item 11' },
      { title: 'Item 12' },
      { title: 'Item 13' },
      { title: 'Item 14' },
      { title: 'Item 15' },
    ];

    const plugin = createTypeAheadPlugin({
      trigger: ':',
      getItems(query: string) {
        return mockItems;
      },
      forceSelect(query: string, items: Array<TypeAheadItem>) {
        return query.indexOf(':') > -1 ? items[1] : undefined;
      },
      selectItem(state, _item, insert) {
        return insert(_item.title);
      },
    });
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, ':1', sel);
    sendKeyToPm(editorView, 'ArrowDown');
    sendKeyToPm(editorView, 'ArrowDown');
    sendKeyToPm(editorView, 'ArrowDown');
    insertText(editorView, ':', sel + 2);
    expect(editorView.state.doc).toEqualDocument(doc(p('Item 12')));
  });

  it('should insert current index if forceSelect is not defined. ', () => {
    const mockItems = [
      { title: 'Item 11' },
      { title: 'Item 12' },
      { title: 'Item 13' },
      { title: 'Item 14' },
      { title: 'Item 15' },
    ];

    const plugin = createTypeAheadPlugin({
      trigger: ':',
      getItems(query: string) {
        return mockItems;
      },
      selectItem(state, _item, insert) {
        return insert(_item.title);
      },
    });
    const { editorView, sel } = createEditor({
      doc: doc(p('{<>}')),
      editorPlugins: [plugin],
    });
    insertText(editorView, ':1', sel);
    sendKeyToPm(editorView, 'ArrowDown');
    sendKeyToPm(editorView, 'ArrowDown');
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(doc(p('Item 13')));
  });
});
