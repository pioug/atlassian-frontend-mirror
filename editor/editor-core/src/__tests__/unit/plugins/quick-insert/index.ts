import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import sleep from '@atlaskit/editor-test-helpers/sleep';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { pluginKey as quickInsertPluginKey } from '../../../../plugins/quick-insert/plugin-key';
import { TypeAheadInsert } from '../../../../plugins/type-ahead/types';
import { EditorProps } from '../../../../types/editor-props';

describe('Quick Insert', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (
    doc: DocBuilder,
    providerFactory?: any,
    extraProps: Partial<EditorProps> = {},
  ) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      pluginKey: quickInsertPluginKey,
      providerFactory,
      editorProps: {
        quickInsert: true,
        allowPanel: true,
        allowAnalyticsGASV3: true,
        ...extraProps,
      },
      createAnalyticsEvent,
    });
  };

  it('should be able to select a quick insert items using type ahead', async () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });

  it('should support custom items through the QuickInsert provider', async () => {
    const provider = Promise.resolve({
      getItems() {
        return Promise.resolve([
          {
            title: 'Custom item',
            action(insert: TypeAheadInsert) {
              return insert('custom item');
            },
          },
        ]);
      },
    });
    const providerFactory = new ProviderFactory();
    const { editorView, sel } = editor(doc(p('{<>}')), providerFactory);
    providerFactory.setProvider('quickInsertProvider', provider);
    insertText(editorView, '/Custom', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(doc(p('custom item')));
  });

  it('should fallback to default items if QuickInsert provider rejects', async () => {
    const provider = Promise.resolve({
      getItems: () => Promise.reject('Error'),
    });
    const providerFactory = new ProviderFactory();
    const { editorView, sel } = editor(doc(p('{<>}')), providerFactory);
    providerFactory.setProvider('quickInsertProvider', provider);
    insertText(editorView, '/Panel', sel);
    await sleep(50);
    sendKeyToPm(editorView, 'Enter');
    expect(editorView.state.doc).toEqualDocument(
      doc(panel({ panelType: 'info' })(p())),
    );
  });

  it('should trigger quick insert invoked analytics event when menu opened', async () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, '/', sel);

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'invoked',
      actionSubject: 'typeAhead',
      actionSubjectId: 'quickInsertTypeAhead',
      attributes: { inputMethod: 'keyboard' },
      eventType: 'ui',
    });
  });

  /**
   * @see ED-12480
   * If you have more than one editor on a page with different feature sets (e.g. one has headings enabled, other one doesn't).
   * The editor use to combine both feature sets into the quick insert menu. Now we want to ensure they dont overlap
   */
  it('ensures multiple editors with differing feature sets have unique quick insert items', () => {
    const editorWithoutBlockQuote = editor(doc(p('{<>}')), undefined, {
      allowBlockType: { exclude: ['blockquote', 'codeBlock', 'hardBreak'] },
    });

    const editorWithBlockQuote = editor(doc(p('{<>}')), undefined, {
      allowBlockType: { exclude: ['codeBlock', 'hardBreak'] },
    });

    expect(
      editorWithoutBlockQuote.pluginState.lazyDefaultItems(),
    ).toContainEqual(expect.not.objectContaining({ id: 'blockquote' }));
    expect(editorWithBlockQuote.pluginState.lazyDefaultItems()).toContainEqual(
      expect.objectContaining({ id: 'blockquote' }),
    );
  });
});
