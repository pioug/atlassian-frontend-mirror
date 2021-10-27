import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { DocBuilder, doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { getPluginState } from '../../../../type-ahead/utils';
import { StatsModifier } from '../../../../type-ahead/stats-modifier';
import typeAheadPlugin from '../../../../type-ahead';
import mentionsPlugin from '../../../../mentions';

describe('mentions: type-ahead', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const mentionProvider = Promise.resolve(mentionResourceProvider);

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));

    const providerFactory: ProviderFactory = ProviderFactory.create({
      mentionProvider,
    });

    const preset = new Preset<LightEditorPlugin>()
      .add(mentionsPlugin)
      .add([typeAheadPlugin, { createAnalyticsEvent }]);

    return createEditor({
      doc,
      preset,
      providerFactory,
    });
  };

  describe('when getItems is called multiple times before the results are resolved', () => {
    it('should not mix the results with other queries', async () => {
      const { editorView } = editor(doc(p('{<>}')));

      await mentionProvider;

      const { state: editorState } = editorView;
      const { typeAheadHandlers } = getPluginState(editorState);

      const mentionGetItems = typeAheadHandlers[0].getItems;

      const firstCall = mentionGetItems({
        query: 'l',
        editorState,
      });

      const secondCall = mentionGetItems({
        query: 'lo',
        editorState,
      });

      const thirdCall = mentionGetItems({
        query: 'lol',
        editorState,
      });

      const firstResult = await firstCall;
      const secondResult = await secondCall;
      const thirdResult = await thirdCall;

      expect(firstResult.length).toBe(4);
      expect(secondResult.length).toBe(2);
      expect(thirdResult.length).toBe(0);
    });
  });

  describe('when dismiss is called', () => {
    it('should unsubscribe any previous subscription', async () => {
      const { editorView } = editor(doc(p('{<>}')));

      const mentionProviderResolved = await mentionProvider;

      const unsubscribeSpy = jest.spyOn(mentionProviderResolved, 'unsubscribe');

      const { state: editorState } = editorView;
      const { typeAheadHandlers } = getPluginState(editorState);

      const {
        getItems: mentionGetItems,
        dismiss: mentionDismiss,
      } = typeAheadHandlers[0];

      mentionGetItems({
        query: 'l',
        editorState,
      });

      mentionGetItems({
        query: 'lo',
        editorState,
      });

      mentionGetItems({
        query: 'lol',
        editorState,
      });

      const stats = new StatsModifier();
      mentionDismiss!({ editorState, query: '', stats });

      expect(unsubscribeSpy).toHaveBeenCalledTimes(3);
    });
  });
});
