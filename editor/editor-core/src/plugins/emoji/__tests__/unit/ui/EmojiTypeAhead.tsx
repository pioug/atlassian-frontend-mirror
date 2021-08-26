import { EmojiDescription } from '@atlaskit/emoji';
import { EditorState } from 'prosemirror-state';
import { doc, emoji, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

// Editor plugins
import { TypeAheadItem } from '../../../../type-ahead/types';
import emojiPlugin, { emojiToTypeaheadItem, memoize } from '../../../';
import typeAheadPlugin from '../../../../type-ahead';
import analyticsPlugin from '../../../../analytics';
import { EmojiPluginOptions } from '../../../types';

describe('EmojiTypeAhead', () => {
  describe('Analytics', () => {
    const createEditor = createProsemirrorEditorFactory();
    const editor = (
      customGetItems?: any,
      mockSelectItem?: any,
      dispatchAnalyticsEvent?: any,
    ) => {
      const emojiPluginMonkeyPatched = (options?: EmojiPluginOptions) => {
        const emojiEditorPlugin = emojiPlugin(options);
        return {
          ...emojiEditorPlugin,
          pluginsOptions: {
            typeAhead: {
              ...emojiPlugin(options).pluginsOptions!.typeAhead,
              getItems:
                customGetItems ||
                emojiEditorPlugin.pluginsOptions!.typeAhead!.getItems,
              selectItem: mockSelectItem
                ? (
                    state: EditorState,
                    item: TypeAheadItem,
                    _insert: any,
                    meta: any,
                  ) => {
                    return emojiEditorPlugin.pluginsOptions!.typeAhead!.selectItem(
                      state,
                      item,
                      () => state.tr,
                      meta,
                    );
                  }
                : emojiEditorPlugin.pluginsOptions!.typeAhead!.selectItem,
            },
          },
        };
      };
      return createEditor({
        doc: doc(p('{<>}')),
        preset: new Preset<LightEditorPlugin>()
          .add([
            emojiPluginMonkeyPatched,
            { createAnalyticsEvent: dispatchAnalyticsEvent },
          ])
          .add([
            analyticsPlugin,
            { createAnalyticsEvent: dispatchAnalyticsEvent },
          ])
          .add(typeAheadPlugin),
      });
    };

    let dispatchAnalyticsSpy: jest.Mock;

    beforeEach(() => {
      dispatchAnalyticsSpy = jest.fn(() => ({ fire: () => {} }));
    });

    it('should fire analytics when selected from typeahead', async () => {
      const { typeAheadTool } = editor(
        () =>
          Promise.resolve([
            {
              title: 'foo',
              emoji: {
                id: 'emojiId',
                type: 'emojiType',
              },
            },
          ]),
        true,
        dispatchAnalyticsSpy,
      );

      await typeAheadTool.searchEmoji('foo')?.insert({ index: 0 });

      expect(dispatchAnalyticsSpy).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'emoji',
        attributes: expect.objectContaining({ inputMethod: 'typeAhead' }),
        eventType: 'track',
      });
    });

    it('should select valid emoji on typing second colon', async () => {
      const catEmojis = [
        {
          title: ':cat:',
          emoji: {
            id: 'catId',
            type: 'catType',
            shortName: ':cat:',
            fallback: '🐱',
          },
        },
        {
          title: ':cat2:',
          emoji: {
            id: 'cat2Id',
            type: 'cat2Type',
            shortName: ':cat2:',
            fallback: '🐈',
          },
        },
        {
          title: ':cat3:',
          emoji: {
            id: 'cat3Id',
            type: 'cat3Type',
            shortName: ':cat3:',
            fallback: '🐈',
          },
        },
        {
          title: ':cat4:',
          emoji: {
            id: 'cat4Id',
            type: 'cat4Type',
            shortName: ':cat4:',
            fallback: '🐈',
          },
        },
      ];
      const { editorView, typeAheadTool } = editor(
        () => Promise.resolve(catEmojis),
        false,
        dispatchAnalyticsSpy,
      );

      await typeAheadTool.searchEmoji('cat:')?.result();
      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji(catEmojis[0].emoji)(), ' ')),
      );
    });
  });

  describe('memoization', () => {
    // Spy without having to mock the whole import
    const emojiToTypeaheadMock = jest
      .fn()
      .mockImplementation(emojiToTypeaheadItem);
    const memoConversion = memoize(emojiToTypeaheadMock);
    const emoji: EmojiDescription = {
      type: 'emoji',
      shortName: 'smile',
      category: 'atlassian',
      searchable: true,
      representation: undefined,
    };

    beforeEach(() => {
      memoConversion.clear();
      emojiToTypeaheadMock.mockClear();
    });

    it('should provide correct result', () => {
      const actual = memoConversion.call(emoji);
      expect(actual).toMatchObject({
        title: emoji.shortName,
      });
    });

    it('should memoize result', () => {
      const initial = memoConversion.call(emoji);
      const memoized = memoConversion.call(emoji);
      expect(initial).toEqual(memoized);
    });

    it('should not call backend more than once', () => {
      memoConversion.call(emoji);
      memoConversion.call(emoji);
      memoConversion.call(emoji);
      expect(emojiToTypeaheadMock).toBeCalledTimes(1);
    });

    it('should reset after clear', () => {
      const initial = memoConversion.call(emoji);
      memoConversion.clear();
      const memoized = memoConversion.call(emoji);

      expect(initial).not.toStrictEqual(memoized);
      expect(initial).toMatchObject({
        title: memoized.title,
      });
      expect(emojiToTypeaheadMock).toBeCalledTimes(2);
    });

    it('should memoize expected value', () => {
      const emojiTwo: EmojiDescription = {
        type: 'emoji',
        shortName: 'dog',
        category: 'atlassian',
        searchable: true,
        representation: undefined,
      };

      const emojiResult = memoConversion.call(emoji);
      const emojiTwoResult = memoConversion.call(emojiTwo);

      expect(emojiResult).toMatchObject({
        title: emoji.shortName,
      });

      expect(emojiTwoResult).toMatchObject({
        title: emojiTwo.shortName,
      });
    });
  });
});
