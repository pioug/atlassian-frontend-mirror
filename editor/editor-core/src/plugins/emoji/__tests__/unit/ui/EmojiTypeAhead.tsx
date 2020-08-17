import { EditorState } from 'prosemirror-state';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

// Editor plugins
import { selectCurrentItem } from '../../../../type-ahead/commands/select-item';
import { TypeAheadItem } from '../../../../type-ahead/types';
import emojiPlugin from '../../../';
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

    it('should fire analytics when selected from typeahead', () => {
      const { editorView, sel } = editor(
        () => [
          {
            title: 'foo',
            emoji: {
              id: 'emojiId',
              type: 'emojiType',
            },
          },
        ],
        true,
        dispatchAnalyticsSpy,
      );

      insertText(editorView, `:foo`, sel);
      selectCurrentItem('selected')(editorView.state, editorView.dispatch);

      expect(dispatchAnalyticsSpy).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'emoji',
        attributes: expect.objectContaining({ inputMethod: 'typeAhead' }),
        eventType: 'track',
      });
    });
  });
});
