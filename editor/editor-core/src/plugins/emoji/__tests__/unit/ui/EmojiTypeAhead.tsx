import { EditorState } from 'prosemirror-state';
import { doc, p } from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

// Editor plugins
import { analyticsService, AnalyticsHandler } from '../../../../../analytics';
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
      trackEvent: any,
      customGetItems?: any,
      mockSelectItem?: any,
      dispatchAnalyticsEvent?: any,
    ) => {
      analyticsService.handler = trackEvent;

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

    let trackEvent: jest.SpyInstance<AnalyticsHandler>;
    let dispatchAnalyticsSpy: jest.Mock;

    beforeEach(() => {
      trackEvent = jest.spyOn(analyticsService, 'trackEvent');
      dispatchAnalyticsSpy = jest.fn(() => ({ fire: () => {} }));
    });

    afterEach(() => {
      trackEvent.mockRestore();
    });

    it('should fire analytics when type ahead is opened', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he`, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.open',
        {},
      );
    });

    it('should fire analytics when type ahead is closed', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he`, sel);
      sendKeyToPm(editorView, 'Escape');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.close',
        {},
      );
    });

    it('should fire analytics after space is typed', () => {
      const { editorView, sel } = editor(trackEvent);
      insertText(editorView, `:he `, sel);
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.space',
        {},
      );
    });

    it('should fire analytics when enter is pressed', () => {
      const { editorView, sel } = editor(
        trackEvent,
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
      );

      insertText(editorView, `:foo`, sel);
      sendKeyToPm(editorView, 'Enter');

      expect(trackEvent).toHaveBeenCalled();

      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.emoji.typeahead.select',
        expect.objectContaining({
          mode: 'enter',
          emojiId: 'emojiId',
          type: 'emojiType',
          queryLength: 3,
        }),
      );
    });

    it('should fire analytics when selected from typeahead', () => {
      const { editorView, sel } = editor(
        trackEvent,
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

      expect(trackEvent).toHaveBeenNthCalledWith(
        3,
        'atlassian.fabric.emoji.typeahead.select',
        expect.objectContaining({
          mode: 'selected',
          emojiId: 'emojiId',
          type: 'emojiType',
          queryLength: 3,
        }),
      );

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
