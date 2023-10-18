import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Preset,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

// Editor Plugins
import deprecatedAnalyticsPlugin from '../../../analytics';
import pastePlugin from '../../';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { textFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';
import { betterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const emojiProvider = getTestEmojiResource();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('#createPasteAnalyticsPayload()', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }])
        .add(hyperlinkPlugin)
        .add(betterTypeHistoryPlugin)
        .add([pastePlugin, {}])
        .add(blockTypePlugin)
        .add(textFormattingPlugin),
      providerFactory,
    });
  };

  describe('plain text link pasting', () => {
    describe('normal paste', () => {
      it('should count no links in pasted content when no links present', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: 'this is just some text without any links',
        });

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 0,
            }),
          }),
        );
      });
      it('should count 4 links in pasted content', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: 'https://news.ycombinator.com/item?id=29219042 news.ycombinator.com some random text https://news.ycombinator.com/item?id=29217810 www.google.com arstnaorset arosent',
        });

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 4,
            }),
            nonPrivacySafeAttributes: expect.objectContaining({
              linkDomain: [
                'news.ycombinator.com',
                'news.ycombinator.com',
                'news.ycombinator.com',
                'google.com',
              ],
            }),
          }),
        );
      });
    });
    describe('plain text paste', () => {
      it('should count no links in plain text pasted contennt when no links present', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain: 'this is just some text without any links',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 0,
            }),
          }),
        );
      });
      it('should count 4 links in plain text pasted content', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain:
              'https://news.ycombinator.com/item?id=29219042 news.ycombinator.com some random text https://news.ycombinator.com/item?id=29217810 www.google.com arstnaorset arosent',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 4,
            }),
          }),
        );
      });
      it('should count no links if links are part of a windows filepath', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain: 'C:\\coolbeans\\www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 0,
            }),
          }),
        );
      });
      it('should count no links if links are part of a windows network filepath', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain: '\\\\coolbeans\\www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 0,
            }),
          }),
        );
      });
      it('should count one link when all others are part of a windows filepath amongst other text', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain:
              'youtube.com PINEAPPLE C:\\coolbeans\\meow\\www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 1,
            }),
          }),
        );
      });
      it('should count one link when all others are part of a windows network filepath amongst other text', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain:
              'youtube.com PINEAPPLE \\\\coolbeans\\meow\\www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 1,
            }),
          }),
        );
      });
      it('should count no links if links are part of a unix filepath or network filepath', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain: '/coolbeans/meow/www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 0,
            }),
          }),
        );
      });
      it('should count one link when all others are part of a unix filepath amongst other text', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(
          editorView,
          {
            plain: 'youtube.com PINEAPPLE /coolbeans/meow/www.atlassian.com',
          },
          { shift: true },
        );

        expect(createAnalyticsEvent).toBeCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              linksInPasteCount: 1,
            }),
          }),
        );
      });
    });
  });

  describe('Plain text paste', () => {
    it('should paste correct number of slashes', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const pasteContent =
        '\\ test \\ \n' +
        '\\\\ test \\\\ \n' +
        '\\\\\\ test \\\\\\ \n' +
        'test \\ test \\ test \n' +
        'test \\\\ test \\\\ test \n' +
        'test \\\\\\ test \\\\\\ test \n' +
        '\\\\networkDrive\\folder';

      dispatchPasteEvent(
        editorView,
        {
          plain: pasteContent,
        },
        { shift: true },
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('\\ test \\ '),
          p('\\\\ test \\\\ '),
          p('\\\\\\ test \\\\\\ '),
          p('test \\ test \\ test '),
          p('test \\\\ test \\\\ test '),
          p('test \\\\\\ test \\\\\\ test '),
          p('\\\\networkDrive\\folder'),
        ),
      );
    });
  });
});
