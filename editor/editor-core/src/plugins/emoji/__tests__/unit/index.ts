import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  evilburnsEmoji,
  grinEmoji,
} from '@atlaskit/util-data-test/emoji-samples';
import { emoji as emojiNode } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  blockquote,
  br,
  doc,
  emoji,
  li,
  p,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { emojiPlugin, emojiPluginKey } from '../../';
import { insertEmoji } from '../../commands/insert-emoji';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';
import blockTypePlugin from '../../../block-type';
import listPlugin from '../../../list';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

const emojiProvider = getTestEmojiResource();

const grin = grinEmoji();
const grinEmojiId = {
  shortName: grin.shortName,
  id: grin.id,
  fallback: grin.fallback,
};

const evilburns = evilburnsEmoji();
const evilburnsEmojiId = {
  shortName: evilburns.shortName,
  id: evilburns.id,
  fallback: evilburns.fallback,
};

describe('emojis', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const mockDispatchAnalyticsEvent = jest.fn();
  const mockAnalyticsPlugin = () => {
    return {
      name: 'analytics',
      actions: {
        attachAnalyticsEvent: (payload: any) => {
          mockDispatchAnalyticsEvent(payload);
          return () => {};
        },
      },
    };
  };
  createAnalyticsEvent = createAnalyticsEventMock();

  const providerFactory = ProviderFactory.create({ emojiProvider });

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(emojiPlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(blockTypePlugin)
        .add(listPlugin)
        .add(typeAheadPlugin)
        .add(quickInsertPlugin),
      providerFactory,
      pluginKey: emojiPluginKey,
    });
  };

  describe('insertEmoji', () => {
    it('should insert emoji-node', () => {
      const { editorView, pluginInjectionAPI } = editor(doc(p('{<>}')));

      pluginInjectionAPI.api().executeCommand(
        insertEmoji(mockAnalyticsPlugin().actions as any)({
          fallback: 'Oscar Wallhult',
          shortName: 'oscar',
          id: '1234',
        }),
      );

      expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
        emojiNode,
      );
    });

    it('should insert a space after the emoji-node', () => {
      const { editorView, pluginInjectionAPI } = editor(doc(p('{<>}')));

      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(grinEmojiId),
        );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ')),
      );
    });

    it('should allow inserting multiple emojis next to each other', () => {
      const { editorView, pluginInjectionAPI } = editor(
        doc(p(emoji(grinEmojiId)(), ' ', '{<>}')),
      );

      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(evilburnsEmojiId),
        );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ', emoji(evilburnsEmojiId)(), ' ')),
      );
    });

    it('should allow inserting emoji on new line after hard break', () => {
      const { editorView, pluginInjectionAPI } = editor(doc(p(br(), '{<>}')));

      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(grinEmojiId),
        );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(br(), emoji(grinEmojiId)(), ' ')),
      );
    });

    it('should not break list into two when inserting emoji inside list item', () => {
      const { editorView, pluginInjectionAPI } = editor(
        doc(ul(li(p('One')), li(p('Two ', '{<>}')), li(p('Three')))),
      );

      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(grinEmojiId),
        );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('One')),
            li(p('Two ', emoji(grinEmojiId)(), ' ')),
            li(p('Three')),
          ),
        ),
      );
    });

    it('should insert only 1 emoji at a time inside blockqoute', () => {
      const { editorView, pluginInjectionAPI } = editor(
        doc(blockquote(p('Hello ', '{<>}'))),
      );

      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(grinEmojiId),
        );

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello ', emoji(grinEmojiId)(), ' '))),
      );

      expect((editorView.state.doc.nodeAt(8) as PMNode).type.spec).toEqual(
        emojiNode,
      );
      expect(editorView.state.doc.nodeAt(10)).toBe(null);
    });

    it('should fire analytics event when insert emoji', () => {
      const { pluginInjectionAPI } = editor(doc(p('{<>}')));
      pluginInjectionAPI
        .api()
        .executeCommand(
          insertEmoji(mockAnalyticsPlugin().actions as any)(
            grinEmojiId,
            INPUT_METHOD.PICKER,
          ),
        );
      expect(mockDispatchAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'emoji',
        eventType: 'track',
        attributes: expect.objectContaining({ inputMethod: 'picker' }),
      });
    });
  });

  describe('quick insert', () => {
    it('should trigger emoji typeahead invoked analytics event', async () => {
      const { typeAheadTool } = editor(doc(p('{<>}')));

      await typeAheadTool.searchQuickInsert('Emoji')?.insert({ index: 0 });

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'typeAhead',
        actionSubjectId: 'emojiTypeAhead',
        attributes: expect.objectContaining({ inputMethod: 'quickInsert' }),
        eventType: 'ui',
      });
    });
  });
});
