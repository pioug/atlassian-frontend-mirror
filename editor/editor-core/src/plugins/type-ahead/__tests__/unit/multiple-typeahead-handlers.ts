import { EditorView } from 'prosemirror-view';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { EmojiProvider } from '@atlaskit/emoji';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
import type { TypeAheadHandler } from '../../types';
import { getPluginState } from '../../utils';
import typeAheadPlugin from '../..';
import analyticsPlugin from '../../../analytics';
import quickInsert from '../../../quick-insert';
import mentionsPlugin from '../../../mentions';
import emojiPlugin from '../../../emoji';

let _queueMicrotask: any;
beforeAll(() => {
  _queueMicrotask = window.queueMicrotask;
  window.queueMicrotask = () => {};
});
afterAll(() => {
  window.queueMicrotask = _queueMicrotask;
});

describe('type-ahead: multiple plugins', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const emojiProvider = getEmojiResourceWithStandardAndAtlassianEmojis() as Promise<
      EmojiProvider
    >;
    const providerFactory: ProviderFactory = ProviderFactory.create({
      emojiProvider,
      mentionProvider: Promise.resolve(mentionResourceProvider),
    });

    const preset = new Preset<LightEditorPlugin>()
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(mentionsPlugin)
      .add(emojiPlugin)
      .add(quickInsert)
      .add([typeAheadPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
      providerFactory,
    });
  };

  it('should load quick insert, emoji and mention handlers into the plugin state', () => {
    const { editorView } = editor(doc(p('{<>}')));

    const { typeAheadHandlers } = getPluginState(editorView.state);

    expect(typeAheadHandlers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: TypeAheadAvailableNodes.QUICK_INSERT }),
        expect.objectContaining({ id: TypeAheadAvailableNodes.EMOJI }),
        expect.objectContaining({ id: TypeAheadAvailableNodes.MENTION }),
      ]),
    );
  });

  describe('when an item inserted action requires the type ahead to open again', () => {
    let editorView: EditorView;
    let handlers: {
      quickInsertHandler: TypeAheadHandler;
      mentionsHandler: TypeAheadHandler;
      emojiHandler: TypeAheadHandler;
    };
    beforeEach(() => {
      ({ editorView } = editor(doc(p('{<>}'))));
      const { typeAheadHandlers } = getPluginState(editorView.state);

      handlers = {
        quickInsertHandler: typeAheadHandlers.find(
          (handler) => handler.id === TypeAheadAvailableNodes.QUICK_INSERT,
        )!,

        emojiHandler: typeAheadHandlers.find(
          (handler) => handler.id === TypeAheadAvailableNodes.EMOJI,
        )!,
        mentionsHandler: typeAheadHandlers.find(
          (handler) => handler.id === TypeAheadAvailableNodes.MENTION,
        )!,
      };
    });

    it('should open the quick insert typeahead', () => {
      insertText(editorView, handlers.quickInsertHandler.trigger);

      const pluginState = getPluginState(editorView.state);

      expect(pluginState.triggerHandler).toEqual(handlers.quickInsertHandler);
    });

    describe('quickInsert getItems', () => {
      it('should find the mentions item', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getPluginState(editorView.state);

        const query = 'mention';
        const items = await triggerHandler!.getItems({
          query,
          editorState: editorView.state,
        });

        expect(items).toEqual([expect.objectContaining({ id: 'mention' })]);
      });

      it('should find the emoji item', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getPluginState(editorView.state);

        const query = 'emoji';
        const items = await triggerHandler!.getItems({
          query,
          editorState: editorView.state,
        });

        expect(items).toEqual([expect.objectContaining({ id: 'emoji' })]);
      });
    });

    describe('when the mention item is inserted from the quick insert', () => {
      it('should open the typeahead menu for mentions', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getPluginState(editorView.state);

        const query = 'mention';
        const items = await triggerHandler!.getItems({
          query,
          editorState: editorView.state,
        });

        insertTypeAheadItem(editorView)({
          item: items[0],
          handler: triggerHandler!,
          mode: SelectItemMode.SELECTED,
          sourceListItem: items,
          query,
        });

        const nextPluginState = getPluginState(editorView.state);
        expect(nextPluginState.triggerHandler).toEqual(
          handlers.mentionsHandler,
        );
      });
    });

    describe('when the emoji item is inserted from the quick insert', () => {
      it('should open the typeahead menu for mentions', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getPluginState(editorView.state);

        const query = 'emoji';
        const items = await triggerHandler!.getItems({
          query,
          editorState: editorView.state,
        });

        insertTypeAheadItem(editorView)({
          item: items[0],
          handler: triggerHandler!,
          mode: SelectItemMode.SELECTED,
          sourceListItem: items,
          query,
        });

        const nextPluginState = getPluginState(editorView.state);
        expect(nextPluginState.triggerHandler).toEqual(handlers.emojiHandler);
      });
    });
  });
});
