import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  SelectItemMode,
  TypeAheadAvailableNodes,
} from '@atlaskit/editor-common/type-ahead';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { EmojiProvider } from '@atlaskit/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { insertTypeAheadItem } from '../../commands/insert-type-ahead-item';
import type { TypeAheadHandler } from '../../types';
import { getPluginState } from '../../utils';
import deprecatedAnalyticsPlugin from '../../../analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import quickInsertPlugin from '../../../quick-insert';
import mentionsPlugin from '../../../mentions';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import typeAheadPlugin from '../../../type-ahead';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

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
  const getNotNullPluginState = (state: EditorState) => getPluginState(state)!;

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const emojiProvider =
      getEmojiResourceWithStandardAndAtlassianEmojis() as Promise<EmojiProvider>;
    const providerFactory: ProviderFactory = ProviderFactory.create({
      emojiProvider,
      mentionProvider: Promise.resolve(mentionResourceProvider),
    });

    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }])
      .add([typeAheadPlugin, { createAnalyticsEvent }])
      .add(mentionsPlugin)
      .add(emojiPlugin)
      .add(quickInsertPlugin);

    return createEditor({
      doc,
      preset,
      providerFactory,
    });
  };

  it('should load quick insert, emoji and mention handlers into the plugin state', () => {
    const { editorView } = editor(doc(p('{<>}')));

    const { typeAheadHandlers } = getNotNullPluginState(editorView.state);

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
      const { typeAheadHandlers } = getNotNullPluginState(editorView.state);

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

      const pluginState = getNotNullPluginState(editorView.state);

      expect(pluginState.triggerHandler).toEqual(handlers.quickInsertHandler);
    });

    describe('quickInsert getItems', () => {
      it('should find the mentions item', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getNotNullPluginState(editorView.state);

        const query = 'mention';
        const items = await triggerHandler!.getItems({
          query,
          editorState: editorView.state,
        });

        expect(items).toEqual([expect.objectContaining({ id: 'mention' })]);
      });

      it('should find the emoji item', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getNotNullPluginState(editorView.state);

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

        const { triggerHandler } = getNotNullPluginState(editorView.state);

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

        const nextPluginState = getNotNullPluginState(editorView.state);
        expect(nextPluginState.triggerHandler).toEqual(
          handlers.mentionsHandler,
        );
      });
    });

    describe('when the emoji item is inserted from the quick insert', () => {
      it('should open the typeahead menu for mentions', async () => {
        insertText(editorView, handlers.quickInsertHandler.trigger);

        const { triggerHandler } = getNotNullPluginState(editorView.state);

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

        const nextPluginState = getNotNullPluginState(editorView.state);
        expect(nextPluginState.triggerHandler).toEqual(handlers.emojiHandler);
      });
    });
  });
});
