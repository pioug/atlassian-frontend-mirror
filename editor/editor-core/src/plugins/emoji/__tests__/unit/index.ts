import { Node as PMNode } from 'prosemirror-model';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  evilburnsEmoji,
  grinEmoji,
} from '@atlaskit/util-data-test/emoji-samples';
import { emoji as emojiNode } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  blockquote,
  br,
  doc,
  emoji,
  li,
  p,
  ul,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import emojiPlugin, { emojiPluginKey } from '../../';
import { insertEmoji } from '../../commands/insert-emoji';
import analyticsPlugin, { INPUT_METHOD } from '../../../analytics';
import typeAheadPlugin from '../../../type-ahead';
import quickInsertPlugin from '../../../quick-insert';
import blockTypePlugin from '../../../block-type';
import listPlugin from '../../../list';

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

  const providerFactory = ProviderFactory.create({ emojiProvider });
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
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
      const { editorView } = editor(doc(p('{<>}')));

      insertEmoji({
        fallback: 'Oscar Wallhult',
        shortName: 'oscar',
        id: '1234',
      })(editorView.state, editorView.dispatch);

      expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
        emojiNode,
      );
    });

    it('should insert a space after the emoji-node', () => {
      const { editorView } = editor(doc(p('{<>}')));

      insertEmoji(grinEmojiId)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ')),
      );
    });

    it('should allow inserting multiple emojis next to each other', () => {
      const { editorView } = editor(doc(p(emoji(grinEmojiId)(), ' ', '{<>}')));

      insertEmoji(evilburnsEmojiId)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(grinEmojiId)(), ' ', emoji(evilburnsEmojiId)(), ' ')),
      );
    });

    it('should allow inserting emoji on new line after hard break', () => {
      const { editorView } = editor(doc(p(br(), '{<>}')));

      insertEmoji(grinEmojiId)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(br(), emoji(grinEmojiId)(), ' ')),
      );
    });

    it('should not break list into two when inserting emoji inside list item', () => {
      const { editorView } = editor(
        doc(ul(li(p('One')), li(p('Two ', '{<>}')), li(p('Three')))),
      );

      insertEmoji(grinEmojiId)(editorView.state, editorView.dispatch);

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
      const { editorView } = editor(doc(blockquote(p('Hello ', '{<>}'))));

      insertEmoji(grinEmojiId)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('Hello ', emoji(grinEmojiId)(), ' '))),
      );

      expect((editorView.state.doc.nodeAt(8) as PMNode).type.spec).toEqual(
        emojiNode,
      );
      expect(editorView.state.doc.nodeAt(10)).toBe(null);
    });

    it('should fire analytics event when insert emoji', () => {
      const { editorView } = editor(doc(p('{<>}')));
      insertEmoji(grinEmojiId, INPUT_METHOD.PICKER)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toBeCalledWith({
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
