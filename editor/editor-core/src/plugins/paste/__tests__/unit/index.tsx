import React from 'react';
import { mount } from 'enzyme';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import createAnalyticsEventMock from '@atlaskit/editor-test-helpers/create-analytics-event-mock';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  macroProvider,
  MockMacroProvider,
} from '@atlaskit/editor-test-helpers/mock-macro-provider';

import {
  code_block,
  strong,
  em,
  doc,
  blockquote,
  p,
  h1,
  code,
  emoji,
  mention,
  media,
  mediaSingle,
  panel,
  extension,
  bodiedExtension,
  inlineExtension,
  a as link,
  ol,
  ul,
  li,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  table,
  tr,
  th,
  td,
  tdCursor,
  hardBreak,
  a,
  inlineCard,
  annotation,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createFakeExtensionManifest,
  createFakeAutoConvertModule,
} from '@atlaskit/editor-test-helpers/extensions';

import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import {
  MediaSingle,
  DefaultExtensionProvider,
  combineExtensionProviders,
  ExtensionProvider,
} from '@atlaskit/editor-common';
import { EmojiProvider } from '@atlaskit/emoji';
import { getEmojiResourceWithStandardAndAtlassianEmojis } from '@atlaskit/util-data-test/get-emoji-resource-standard-atlassian';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';

import { TextSelection, Transaction } from 'prosemirror-state';
import { uuid, AnnotationTypes } from '@atlaskit/adf-schema';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import macroPlugin, { setMacroProvider } from '../../../macro';
import { EditorView } from 'prosemirror-view';
import analyticsPlugin, { ACTION_SUBJECT_ID } from '../../../analytics';

import {
  GapCursorSelection,
  Side,
} from '../../../selection/gap-cursor-selection';

import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';
import {
  CardProvider,
  MacroAttributes,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
// @ts-ignore
import { __serializeForClipboard } from 'prosemirror-view';
import extensionPlugin from '../../../extension';
import panelPlugin from '../../../panel';
import tasksAndDecisionsPlugin from '../../../tasks-and-decisions';
import tablesPlugin from '../../../table';
import emojiPlugin from '../../../emoji';
import mentionsPlugin from '../../../mentions';
import cardPlugin from '../../../card';
import { CardOptions } from '@atlaskit/editor-common';
import pastePlugin from '../../index';
import mediaPlugin from '../../../media';
import { PluginConfig as TablePluginConfig } from '../../../table/types';
import blockTypePlugin from '../../../block-type';
import hyperlinkPlugin from '../../../hyperlink';
import listPlugin from '../../../list';
import codeBlockPlugin from '../../../code-block';
import textFormattingPlugin from '../../../text-formatting';
import layoutPlugin from '../../../layout';
import { flushPromises } from '../../../../__tests__/__helpers/utils';
import { InlineCommentAnnotationProvider } from '../../../annotation/types';
import annotationPlugin from '../../../annotation';
import {
  InlineCommentPluginState,
  InlineCommentMap,
} from '../../../annotation/pm-plugins/types';
import { inlineCommentPluginKey } from '../../../annotation/utils';
import { handlePasteLinkOnSelectedText } from '../../handlers';
import { Slice } from 'prosemirror-model';
import { measureRender as measureRenderMocked } from '@atlaskit/editor-common';
import { createPasteMeasurePayload as createPasteMeasurePayloadMocked } from '../../pm-plugins/analytics';
import unsupportedContentPlugin from '../../../unsupported-content';

const TABLE_LOCAL_ID = 'test-table-local-id';

jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  measureRender: jest.fn(
    (
      measureName: string,
      onMeasureComplete?: (duration: number, startTime: number) => void,
    ) => {
      onMeasureComplete && onMeasureComplete(5000, 1);
    },
  ),
}));
jest.mock('../../pm-plugins/analytics', () => ({
  ...jest.requireActual<Object>('../../pm-plugins/analytics'),
  createPasteMeasurePayload: jest.fn(),
}));

describe('paste plugins', () => {
  const createEditor = createProsemirrorEditorFactory();
  let providerFactory: ProviderFactory;
  let createAnalyticsEvent: jest.MockInstance<UIAnalyticsEvent, any>;

  interface PluginsOptions {
    paste?: {
      cardOptions?: CardOptions;
      sanitizePrivateContent?: boolean;
    };
    table?: TablePluginConfig;
    extensionProvider?: ExtensionProvider;
  }

  const editor = (
    doc: DocBuilder,
    pluginsOptions?: PluginsOptions,
    attachTo?: HTMLElement,
  ) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const emojiProvider = getEmojiResourceWithStandardAndAtlassianEmojis() as Promise<
      EmojiProvider
    >;
    const mediaProvider = Promise.resolve({
      viewMediaClientConfig: getDefaultMediaClientConfig(),
    });
    const inlineCommentProvider: InlineCommentAnnotationProvider = {
      getState: async (ids: string[]) => {
        return ids.map((id) => ({
          annotationType: AnnotationTypes.INLINE_COMMENT,
          id,
          state: { resolved: false },
        }));
      },
      createComponent: () => null,
      viewComponent: () => null,
    };
    providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      emojiProvider,
      mediaProvider,
      macroProvider: Promise.resolve(macroProvider),
      mentionProvider: Promise.resolve(mentionResourceProvider),
      annotationProviders: Promise.resolve({
        inlineComment: inlineCommentProvider,
      }),
    });

    if (pluginsOptions && pluginsOptions.extensionProvider) {
      providerFactory.setProvider(
        'extensionProvider',
        Promise.resolve(pluginsOptions.extensionProvider),
      );
    }

    createAnalyticsEvent = createAnalyticsEventMock();
    const pasteOptions = (pluginsOptions && pluginsOptions.paste) || {
      cardOptions: {},
    };
    const tableOptions = (pluginsOptions && pluginsOptions.table) || {};
    const wrapper = createEditor({
      doc,
      providerFactory,
      attachTo,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, pasteOptions])
        .add([
          analyticsPlugin,
          {
            createAnalyticsEvent: createAnalyticsEvent as any,
            performanceTracking: {
              pasteTracking: {
                enabled: true,
              },
            },
          },
        ])
        .add(extensionPlugin)
        .add(blockTypePlugin)
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(codeBlockPlugin)
        .add(panelPlugin)
        .add([tasksAndDecisionsPlugin])
        .add([
          tablesPlugin,
          {
            tableOptions: tableOptions ? tableOptions : {},
            breakoutEnabled: false,
            allowContextualMenu: true,
            dynamicSizingEnabled: true,
            fullWidthEnabled: false,
            wasFullWidthEnabled: false,
          },
        ])
        .add(emojiPlugin)
        .add(mentionsPlugin)
        .add([macroPlugin])
        .add([
          cardPlugin,
          pasteOptions.cardOptions
            ? { platform: 'web', ...pasteOptions.cardOptions }
            : { platform: 'web' },
        ])
        .add([
          mediaPlugin,
          {
            allowMediaSingle: true,
            allowMediaGroup: true,
            allowLazyLoading: true,
            allowBreakoutSnapPoints: true,
            allowAdvancedToolBarOptions: true,
            allowDropzoneDropLine: true,
            allowMediaSingleEditable: true,
            allowRemoteDimensionsFetch: true,
            // This is a wild one. I didnt quite understand what the code was doing
            // so a bit of guess for now.
            allowMarkingUploadsAsIncomplete: false,
            fullWidthEnabled: false,
            isCopyPasteEnabled: true,
          },
        ])
        .add(unsupportedContentPlugin)
        .add(layoutPlugin)
        .add([
          annotationPlugin,
          { inlineComment: { ...inlineCommentProvider } },
        ]),
    });

    createAnalyticsEvent.mockClear();

    return wrapper;
  };

  describe('handlePaste', () => {
    const mediaHtml = (fileMimeType: string) => `
      <div
      data-id="af9310df-fee5-459a-a968-99062ecbb756"
      data-node-type="media" data-type="file"
      data-collection="MediaServicesSample"
      title="Attachment"
      data-file-mime-type="${fileMimeType}"></div>`;

    describe('editor', () => {
      describe('paste mention', () => {
        const mentionsHtml =
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mention-id='2' data-access-level='' contenteditable='false'>@Verdie Carrales</span> test</p>";

        it('should remove mention text when property sanitizePrivateContent is enabled', () => {
          const { editorView } = editor(doc(p('this is {<>}')), {
            paste: {
              sanitizePrivateContent: true,
            },
          });
          dispatchPasteEvent(editorView, {
            html: mentionsHtml,
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is ',
                mention({ id: '2', text: '', accessLevel: '' })(),
                ' test',
              ),
            ),
          );
        });

        it('should keep mention text when property sanitizePrivateContent is disabled', () => {
          const { editorView } = editor(doc(p('this is {<>}')), {
            paste: {
              sanitizePrivateContent: false,
            },
          });
          dispatchPasteEvent(editorView, {
            html: mentionsHtml,
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is ',
                mention({
                  id: '2',
                  text: '@Verdie Carrales',
                  accessLevel: '',
                })(),
                ' test',
              ),
            ),
          );
        });
      });

      describe('when message is a media image node', () => {
        it('paste as mediaSingle', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: mediaHtml('image/jpeg'),
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  id: 'af9310df-fee5-459a-a968-99062ecbb756',
                  type: 'file',
                  collection: 'MediaServicesSample',
                  __fileMimeType: 'image/jpeg',
                })(),
              ),
            ),
          );
        });
      });

      describe('when pasted inside table', () => {
        it('should set a GapCursor after it', () => {
          const { editorView } = editor(
            doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
          );

          dispatchPasteEvent(editorView, {
            html: `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()(
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: '9b5c6412-6de0-42cb-837f-bc08c24b4383',
                        type: 'file',
                        collection: 'MediaServicesSample',
                        __fileMimeType: 'image/png',
                        __fileName: 'image-20190325-222039.png',
                        __fileSize: 29502,
                        height: 288,
                        width: 490,
                      })(),
                    ),
                  ),
                ),
              ),
            ),
          );

          const { selection, schema } = editorView.state;
          expect(selection instanceof GapCursorSelection).toBe(true);
          expect((selection as GapCursorSelection).side).toBe(Side.RIGHT);
          expect(selection.$from.nodeBefore!.type).toEqual(
            schema.nodes.mediaSingle,
          );
        });

        it('should transform images into mediaSingles', () => {
          const { editorView } = editor(
            doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
          );

          dispatchPasteEvent(editorView, {
            html: `"<meta charset='utf-8'><meta charset="utf-8"><img src="http://atlassian.com" width="624" height="416" style="margin-left: 0px; margin-top: 0px;" />"`,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table({ localId: TABLE_LOCAL_ID })(
                tr(
                  td()(
                    p('"'),
                    mediaSingle({ layout: 'center' })(
                      media({
                        __external: true,
                        alt: '',
                        url: 'http://atlassian.com',
                        type: 'external',
                      })(),
                    ),
                    p('"'),
                  ),
                ),
              ),
            ),
          );
        });
      });

      describe('when an external image is copied', () => {
        const externalMediaHtml = `
         <meta charset='utf-8'><img src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;w=1000&amp;q=80" alt="Image result for cat"/>
        `;

        it('should insert as external media single', () => {
          const { editorView } = editor(doc(p('{<>}')));
          dispatchPasteEvent(editorView, {
            html: externalMediaHtml,
          });

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  type: 'external',
                  __external: true,
                  alt: 'Image result for cat',
                  url:
                    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                })(),
              ),
            ),
          );
        });
      });
    });

    describe('paste in hyperlink', () => {
      it('should add link mark to selected text if slice is a link and text is matching', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeTruthy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );
      });

      it('should not add link mark to selected text if slice is a link and text is different', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })('copied text')))(
                editorView.state.schema,
              ).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the {<}selected text{>} here')),
        );
      });

      it('should be falsy if not adding a link', () => {
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p('hello world'))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the selected text here')),
        );
      });

      it('should be falsy if theres no text selection', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<>}selected text here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the selected text here')),
        );
      });

      it('should be falsy if you cannot add a link in that range', () => {
        const href = 'https://www.atlassian.com';
        const { editorView } = editor(
          doc(p('This is the {<}sele'), p('cted text{>} here')),
        );
        expect(
          handlePasteLinkOnSelectedText(
            new Slice(
              doc(p(link({ href })(href)))(editorView.state.schema).content,
              1,
              1,
            ),
          )(editorView.state, editorView.dispatch),
        ).toBeFalsy();
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the sele'), p('cted text here')),
        );
      });

      it('should add link mark to selected text on paste', () => {
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        dispatchPasteEvent(editorView, { plain: 'https://www.atlassian.com' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'This is the ',
              a({ href: 'https://www.atlassian.com' })('selected text'),
              ' here',
            ),
          ),
        );
      });
    });

    describe('pasting mixed text and media', () => {
      const nestedMediaHTML = `<meta charset='utf-8'><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">, front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.</p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Interestingly, using npm package</p>`;
      const multipleNestedMediaHTML = `<meta charset='utf-8'><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">, front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.</p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><a href="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" class="article-body-image-wrapper" style="color: var(--theme-anchor-color, #557de8); text-decoration: none; cursor: zoom-in;"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png" alt="npm website screenshot: &quot;build amazing things&quot;" loading="lazy" style="height: auto; position: relative; display: block; margin: auto; left: -6px; max-width: calc(100% + 12px);"></a></p><p style="margin: 0.95em 0px 1.2em; padding: 0.2em; color: rgb(10, 10, 10); font-family: Palatino, &quot;Palatino Linotype&quot;, &quot;Palatino LT STD&quot;, &quot;Book Antiqua&quot;, Georgia, serif; font-size: 21px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;">Interestingly, using npm package</p>`;
      const mediaHTML = `<meta charset='utf-8'><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; padding-top: 20px; padding-bottom: 20px;"><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; font-size: 18px; line-height: 34px;">ulum stress. These signaling pathways regulate a variety of cellular activities including proliferation, differentiation, survival, and death.</p></div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><img src="https://www.biorbyt.com/pub/media/wysiwyg/MAPK_signaling_pathway.jpg" alt="MAPK Signaling Pathway" style="box-sizing: border-box; border: 0px; height: 854px; max-width: 100%; width: 982px; background-size: cover;"></div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; margin-bottom: 3rem;"> </div><div style="box-sizing: border-box; color: rgb(51, 51, 51); font-family: droid_sansregular; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; font-size: 18px; line-height: 34px;">Six subfamilies of MAPKs have been extensively characterized in mammalian cells: ERK1/2, JNKs, ERK 3, p38s, ERK5 and ERK 7/8. Transmission of signals</p></div>`;
      const hiddenMediaHTML = `<meta charset='utf-8'><p class="ia ib at bv ic b id ie if ig ih ii ij ik il im in" data-selectable-paragraph="" style="box-sizing: inherit; margin: 2em 0px -0.46em; font-weight: 400; color: rgba(0, 0, 0, 0.84); font-style: normal; line-height: 1.58; letter-spacing: -0.004em; font-family: medium-content-serif-font, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif; font-size: 21px; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">ening after learning my tech is about 35% useful? bourbon, of course! After a couple of silky smooth glasses with ice (sorry purists), I begin researching a solution.</p><figure class="io ip iq ir is dv jd iu iv paragraph-image" style="box-sizing: inherit; margin: 56px 24px 0px; clear: both; max-width: 544px; color: rgba(0, 0, 0, 0.8); font-family: medium-content-sans-serif-font, -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><div class="iy n di iz" style="box-sizing: inherit; display: block; position: relative; margin: auto; background-color: rgba(0, 0, 0, 0.05);"><div class="je n" style="box-sizing: inherit; display: block; padding-bottom: 360px;"><div class="cv iw fd p q fc ab ay v ix" style="box-sizing: inherit; top: 0px; left: 0px; will-change: transform; width: 544px; overflow: hidden; opacity: 0; height: 360px; position: absolute; transition: opacity 100ms ease 400ms; transform: translateZ(0px);"><img alt="" src="https://miro.medium.com/max/60/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg?q=20" class="fd p q fc ab jb jc" width="544" height="360" style="box-sizing: inherit; vertical-align: middle; top: 0px; left: 0px; width: 544px; height: 360px; position: absolute; filter: blur(20px); transform: scale(1.1);"></div><img alt="" class="ln lo fd p q fc ab" width="544" height="360" src="https://miro.medium.com/max/1088/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg" style="box-sizing: inherit; vertical-align: middle; top: 0px; left: 0px; width: 544px; height: 360px; position: absolute; opacity: 1; transition: opacity 400ms ease 0ms;"></div></div></figure><p class="ia ib at bv ic b id ie if ig ih ii ij ik il im in" data-selectable-paragraph="" style="box-sizing: inherit; margin: 2em 0px -0.46em; font-weight: 400; color: rgba(0, 0, 0, 0.84); font-style: normal; line-height: 1.58; letter-spacing: -0.004em; font-family: medium-content-serif-font, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif; font-size: 21px; font-variant-ligatures: normal; font-variant-caps: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">So to downgrade the iOS devices (phone and tablet), I must connect them to the MacBook and restore via iTunes.</p>`;
      const wrappedMediaHTML = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-36f8577a-7fff-ef0c-fd08-949e2fc1b66b"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Hello this is some text</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 604px; height: 398px"><img src="https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg" width="604" height="398" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">And this is some more text</span></p></b><br class="Apple-interchange-newline">`;
      const wrappedMediaInTableHTML = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-dc605362-7fff-99d0-604f-9d37acd6f416"><div dir="ltr" style="margin-left:0pt;" align="left"><table data-table-local-id=${TABLE_LOCAL_ID} style="border:none;border-collapse:collapse;width:468pt;table-layout:fixed"><colgroup><col /><col /><col /></colgroup><tr style="height:0pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Funny</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 194px; height: 108px"><img src="https://lh4.googleusercontent.com/9lblWb7GLsczlSZQXUmuyJ9MLe-D8i19B1ITI-fdjV7bDMHzKWL5STuYhFTnOGJxfNa5HrWCgbQ35fr_ZMcZGpKX83ZWcSSeNAhOMVur7M1Ww3UOkWR64BDy1r-4atSedbwGCwyK" width="194" height="108" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Cat</span></p></td></tr><tr style="height:23pt"><td style="border-left:solid #000000 1pt;border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 1pt;vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;"></td></tr></table></div></b>`;
      const mediaFromMicrosoftWord = `<meta charset='utf-8' xmlns:w="urn:schemas-microsoft-com:office:word"><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-36f8577a-7fff-ef0c-fd08-949e2fc1b66b"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Hello this is some text</span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"><span style="border: none; display: inline-block; overflow: hidden; width: 604px; height: 398px"><img src="https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg" width="604" height="398" style="margin-left: 0px; margin-top: 0px;" /></span></span></p><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">And this is some more text</span></p></b><br class="Apple-interchange-newline">`;

      // dev.to nested structure
      it('hoists nested media nodes in the clipboard html', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: nestedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              ', front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            p('Interestingly, using npm package'),
          ),
        );
      });

      it('hoists multiple nested media nodes in the clipboard html', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: multipleNestedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              ', front-end web apps, mobile apps, robots, and many other needs of the JavaScript community.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'npm website screenshot: "build amazing things"',
                url: `https://res.cloudinary.com/practicaldev/image/fetch/s--dW53ZT_i--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/9w2isgu5pn9bi5k59eto.png`,
              })(),
            ),
            p('Interestingly, using npm package'),
          ),
        );
      });

      it('should insert external media in a media single', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: mediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'ulum stress. These signaling pathways regulate a variety of cellular activities including proliferation, differentiation, survival, and death.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: 'MAPK Signaling Pathway',
                url: `https://www.biorbyt.com/pub/media/wysiwyg/MAPK_signaling_pathway.jpg`,
              })(),
            ),
            p(
              `Six subfamilies of MAPKs have been extensively characterized in mammalian cells: ERK1/2, JNKs, ERK 3, p38s, ERK5 and ERK 7/8. Transmission of signals`,
            ),
          ),
        );
      });

      // Medium.com use case
      it('should remove any media not visible in the DOM', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: hiddenMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'ening after learning my tech is about 35% useful? bourbon, of course! After a couple of silky smooth glasses with ice (sorry purists), I begin researching a solution.',
            ),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: '',
                url: `https://miro.medium.com/max/1088/1*Ul-CDqf6wi-Ee8FQgmBUhQ@2x.jpeg`,
              })(),
            ),
            p(
              `So to downgrade the iOS devices (phone and tablet), I must connect them to the MacBook and restore via iTunes.`,
            ),
          ),
        );
      });

      // Google Docs use case
      it('should hoist media preserving order of media and text when wrapped in google docs container', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: wrappedMediaHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('Hello this is some text'),
            mediaSingle()(
              media({
                type: 'external',
                __external: true,
                alt: '',
                url: `https://lh5.googleusercontent.com/dnPAozzy3eYppgqEafLiZl3zzWYCrrzfwKCZiQ8nyYGeB9us9npuOVj48tM1VotqVlGriXQG2x2iYnbOVxsE54vkFErZs3n-6yYlZA8nRpu3Bt2DWhEoa8pFOkiMJHHGYrYhfLkg`,
              })(),
            ),
            p('And this is some more text'),
          ),
        );
      });

      it('should ignore images coming from Microsoft Word', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: mediaFromMicrosoftWord,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('Hello this is some text'),
            p(),
            p('And this is some more text'),
            p(hardBreak()),
          ),
        );
      });

      it('should hoist media preserving order of media and text inside a table when wrapped in google docs container', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: wrappedMediaInTableHTML,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td()(
                  p('Funny'),
                  mediaSingle()(
                    media({
                      type: 'external',
                      __external: true,
                      alt: '',
                      url: `https://lh4.googleusercontent.com/9lblWb7GLsczlSZQXUmuyJ9MLe-D8i19B1ITI-fdjV7bDMHzKWL5STuYhFTnOGJxfNa5HrWCgbQ35fr_ZMcZGpKX83ZWcSSeNAhOMVur7M1Ww3UOkWR64BDy1r-4atSedbwGCwyK`,
                    })(),
                  ),
                  p('Cat'),
                ),
              ),
              tr(td()(p(''))),
            ),
          ),
        );
      });
    });

    describe('pasting media from the renderer', () => {
      it('should insert a media single markup as a media single node', () => {
        // Couldnt get media to load properly, we're inlining the media node.
        // We only really care about the media single markup here.
        const wrapper = mount(
          <MediaSingle
            layout="center"
            width={1333}
            height={1019}
            pctWidth={80}
            lineLength={680}
          >
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<div class="sc-eetwQk ddqWZS" data-context-id="414734770" data-type="file" data-node-type="media" data-width="1105" data-height="844" data-id="ade9cc46-35a9-49b1-b4ff-477670463481" data-collection="contentId-414734770"><div class="sc-gkfylT VGelR"><div class="sc-cgThhu bCBaed"><div class="sc-fPCuyW jeMDuK sc-frudsx gquFtT"><div class="wrapper"><div class="img-wrapper"><img class="sc-fIIFii bZNNp" draggable="false" style="transform: translate(-50%, -50%); height: 100%;" src="blob:https://hello.atlassian.net/9faf6f4c-994b-ca4e-b391-c00caa808b6f"></div></div></div></div></div></div>',
              }}
            />
          </MediaSingle>,
        );

        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, {
          html: `<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>${wrapper.html()}</body></html>`,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'center',
              width: 80,
            })(
              media({
                __contextId: '414734770',
                collection: 'contentId-414734770',
                height: 844,
                id: 'ade9cc46-35a9-49b1-b4ff-477670463481',
                type: 'file',
                width: 1105,
              })(),
            ),
          ),
        );
      });
    });

    describe('paste in code-block', () => {
      it('should not create paragraph when plain text is copied in code-block', () => {
        const { editorView } = editor(doc(code_block()('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('plain text')),
        );
      });

      it('should create paragraph when plain text is not copied in code-block', () => {
        const { editorView } = editor(doc(p('{<>}')));
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(doc(p('plain text')));
      });

      it('should scroll cursor into view after pasting in code-block', () => {
        const { editorView } = editor(doc(code_block()('{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');
        dispatchPasteEvent(editorView, { plain: 'plain text' });

        const tr = dispatchSpy.mock.calls[0][0];
        expect(
          (tr as Transaction & { scrolledIntoView: boolean }).scrolledIntoView,
        ).toBe(true);
      });
    });

    describe('paste in panel', () => {
      it('should paste list inside empty panel', () => {
        const listHtml = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;bulletList&quot;,null,&quot;listItem&quot;,null]">hello</p>`;

        const { editorView } = editor(
          doc(panel({ panelType: 'info' })(p('{<>}'))),
        );
        dispatchPasteEvent(editorView, {
          html: listHtml,
        });
        expect(editorView.state).toEqualDocumentAndSelection(
          doc(panel({ panelType: 'info' })(ul(li(p('hello{<>}'))))),
        );
      });
    });

    describe('paste inline text', () => {
      it('should preserve marks when pasting inline text into empty text selection', () => {
        const { editorView } = editor(doc(p(strong(em('this is {<>}')))));
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em text</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong(em('this is strong em text{<>}')))),
        );
      });

      it('should preserve marks when pasting inline text into text selection', () => {
        const { editorView } = editor(
          doc(p(strong(em('this is strong em text')))),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 1, 8),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>this is another</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong(em('this is another strong em text')))),
        );
      });

      it('should preserve marks when pasting inline text into action/decision', () => {
        const { editorView } = editor(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a {<>}text')),
              ),
            ),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a strong em {<>}text')),
              ),
            ),
          ),
        );
      });

      it('should preserve marks when pasting inline text into panel', () => {
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p(strong(em('this is a strong em {<>}text'))))),
        );
      });

      it('should preserve marks when pasting inline text into heading', () => {
        const { editorView } = editor(
          doc(h1(strong(em('this is a {<>}text')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(h1(strong(em('this is a strong em {<>}text')))),
        );
      });

      it('should preserve marks when pasting inline text into list', () => {
        const { editorView } = editor(
          doc(ol(li(p(strong(em('this is a {<>}text')))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p(strong(em('this is a strong em {<>}text')))))),
        );
      });

      it('should preserve marks + link when pasting URL', () => {
        const href = 'http://www.google.com';
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            panel()(
              p(
                strong(em('this is a ')),
                link({ href })(strong(em('www.google.com'))),
                strong(em('text')),
              ),
            ),
          ),
        );
      });

      it('should preserve marks + link when pasting plain text', () => {
        const href = 'http://www.google.com';
        const { editorView } = editor(
          doc(p(link({ href })('www.google{<>}.com'))),
        );
        dispatchPasteEvent(editorView, {
          html: "<meta charset='utf-8'><p data-pm-slice='1 1 []'>doc</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })('www.googledoc.com'))),
        );
      });

      it('should filter link mark when pasting URL into code mark', () => {
        const { editorView } = editor(
          doc(panel()(p(code('code line 1: {<>}')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(panel()(p(code('code line 1: www.google.com')))),
        );
      });

      describe('with annotations', () => {
        let commentsPluginStateMock: jest.SpyInstance;

        // mocks comments plugin state to indicate that we have this annotation on a page
        function mockCommentsStateWithAnnotations(
          annotations: InlineCommentMap,
        ) {
          const testInlineCommentState: InlineCommentPluginState = {
            annotations: annotations,
            selectedAnnotations: [],
            mouseData: { isSelecting: false },
            disallowOnWhitespace: false,
            isVisible: true,
          };
          return jest
            .spyOn(inlineCommentPluginKey, 'getState')
            .mockReturnValue(testInlineCommentState);
        }

        beforeEach(() => {
          commentsPluginStateMock = mockCommentsStateWithAnnotations({
            'annotation-id': false,
            'annotation-id-1': false,
            'annotation-id-2': false,
          });
        });

        afterEach(() => {
          commentsPluginStateMock.mockClear();
        });

        it('preserves annotation mark when pasting plain text into annotation', async () => {
          const { editorView } = editor(
            doc(
              p(
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an {<>}annotation'),
              ),
            ),
          );
          // it is important to flush promises here because we have async code in annotations setup
          // which can affect subsequent tests
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'>modified </p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an modified annotation'),
              ),
            ),
          );
        });

        it('keeps annotation mark when pasting text with annotation', async () => {
          const { editorView } = editor(doc(p('this is a {<>}text')));
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='annotation-id' >annotated </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                'this is a ',
                annotation({
                  id: 'annotation-id',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('annotated '),
                'text',
              ),
            ),
          );
        });

        it('strips off annotation mark when pasting text with annotation that does not exist i nthe document', async () => {
          const { editorView } = editor(doc(p('this is a {<>}text')));
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='nonexisting-annotation-id' >annotated </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(p('this is a annotated text')),
          );
        });

        it('merges annotation marks when pasting text with annotation into another text with annotation', async () => {
          const { editorView } = editor(
            doc(
              p(
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an {<>} outer annotation'),
              ),
            ),
          );
          // it is important to flush promises here because we have async code in annotations setup
          // which can affect subsequent tests
          await flushPromises();
          dispatchPasteEvent(editorView, {
            html:
              "<meta charset='utf-8'><p data-pm-slice='1 1 []'><span data-mark-type='annotation' data-mark-annotation-type='inlineComment' data-id='annotation-id-2' >inner annotation </span></p>",
          });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })('This is an '),
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })(
                  annotation({
                    id: 'annotation-id-2',
                    annotationType: AnnotationTypes.INLINE_COMMENT,
                  })('inner annotation '),
                ),
                annotation({
                  id: 'annotation-id-1',
                  annotationType: AnnotationTypes.INLINE_COMMENT,
                })(' outer annotation'),
              ),
            ),
          );
        });
      });
    });

    describe('paste paragraphs', () => {
      it('should preserve marks when pasting paragraphs into empty text selection', () => {
        const { editorView } = editor(doc(p(strong(em('this is {<>}')))));
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em text</p><p>this is another paragraph</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong(em('this is strong em text{<>}'))),
            p(strong(em('this is another paragraph'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into text selection', () => {
        const { editorView } = editor(
          doc(p(strong(em('this is strong em text')))),
        );
        editorView.dispatch(
          editorView.state.tr.setSelection(
            TextSelection.create(editorView.state.doc, 1, 8),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>this is another</p><p>hello</p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(strong(em('this is another'))),
            p(strong(em('hello strong em text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into action/decision', () => {
        const { editorView } = editor(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a {<>}text')),
              ),
            ),
          ),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                strong(em('this is a strong em {<>}')),
              ),
            ),
            p(strong(em('hello text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into panel', () => {
        const { editorView } = editor(
          doc(panel()(p(strong(em('this is a {<>}text'))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            panel()(
              p(strong(em('this is a strong em {<>}'))),
              p(strong(em('hello text'))),
            ),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into heading', () => {
        const { editorView } = editor(
          doc(h1(strong(em('this is a {<>}text')))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            h1(strong(em('this is a strong em {<>}'))),
            p(strong(em('hello text'))),
          ),
        );
      });

      it('should preserve marks when pasting paragraphs into list', () => {
        const { editorView } = editor(
          doc(ol(li(p(strong(em('this is a {<>}text')))))),
        );
        dispatchPasteEvent(editorView, {
          html:
            "<meta charset='utf-8'><p data-pm-slice='1 1 []'>strong em </p><p>hello </p>",
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(
              li(
                p(strong(em('this is a strong em {<>}'))),
                p(strong(em('hello text'))),
              ),
            ),
          ),
        );
      });

      it('should scroll cursor into view after pasting', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const dispatchSpy = jest.spyOn(editorView, 'dispatch');

        dispatchPasteEvent(editorView, {
          html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">Some rich text to paste</p>`,
        });

        const tr = dispatchSpy.mock.calls[0][0];
        expect(
          (tr as Transaction & {
            scrolledIntoView: boolean;
          }).scrolledIntoView,
        ).toBe(true);
      });
    });

    describe('hyperlink as a plain text', () => {
      it('should linkify hyperlink if it contains "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/...blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "---"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/---blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains "~~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~blabla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should linkify pasted hyperlink if it contains combination of "~~~", "---" and "..."', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~~bla...bla---bla';
        dispatchPasteEvent(editorView, { plain: href });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(link({ href })(href))),
        );
      });

      it('should parse Urls with nested parentheses', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/?jql=(foo())bar';
        const text = `**Hello** ${href} _World_`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p(strong('Hello'), ' ', link({ href })(href), ' ', em('World'))),
        );
      });

      it('should not create code block for whitespace pre-wrap css', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/__text__/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "**text**"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/**text**/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse Urls with "~~text~~"', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const href = 'http://example.com/~~text~~/something';
        const text = `text ${href} text`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('text ', link({ href })(href), ' text')),
        );
      });

      it('should parse network paths correctly', () => {
        const { editorView } = editor(doc(p('{<>}')));
        const text = `Network:\\\\test\\test\\ Network:\/\/test\/test\/ Network:\\\\test\\test\\`;
        dispatchPasteEvent(editorView, { plain: text });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Network:\\\\test\\test\\ Network://test/test/ Network:\\\\test\\test\\',
            ),
          ),
        );
      });

      describe('if pasted markdown followed by hyperlink', () => {
        it('should parse markdown and create a hyperlink', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const href = 'http://example.com/?...jql=(foo())bar';
          const text = `**Hello** ${href} _World_`;
          dispatchPasteEvent(editorView, { plain: text });
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(strong('Hello'), ' ', link({ href })(href), ' ', em('World')),
            ),
          );
        });
      });
    });

    it('should create code-block for multiple lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code line 1\ncode line 2'), p('')),
      );
    });

    it('should create code-mark for single lines of code copied', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1',
        html: '<pre>code line 1</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(doc(p(code('code line 1'))));
    });

    it('should remove single preceding backtick', () => {
      const { editorView } = editor(doc(p('`{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1',
        html: '<pre>code line 1</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(doc(p(code('code line 1'))));
    });

    it('should join adjacent code-blocks', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2\ncode line 3',
        html: '<pre>code line 1\ncode line 2</pre><pre>code line 3</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code line 1\ncode line 2\ncode line 3'), p('')),
      );
    });

    it('should not create paragraph when code is copied inside existing code-block', () => {
      const { editorView } = editor(doc(code_block()('code\n{<>}\ncode')));
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('code\ncode line 1\ncode line 2\ncode')),
      );
    });

    it('should create paragraph when code block is pasted inside table at end in a table cell', () => {
      const { editorView } = editor(
        doc(table({ localId: TABLE_LOCAL_ID })(tr(tdCursor))),
      );
      dispatchPasteEvent(editorView, {
        plain: 'code line 1\ncode line 2',
        html: '<pre>code line 1\ncode line 2</pre>',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td({})(code_block()('code line 1\ncode line 2'), p(''))),
          ),
        ),
      );
    });

    it('should move selection out of code mark if new code mark is created by pasting', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'code single line',
        html: '<pre>code single line</pre>',
      });
      expect(editorView.state.storedMarks!.length).toEqual(0);
    });

    it('should not handle events with Files type', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain: 'my-awesome-mug.png',
        types: ['text/plain', 'Files'],
      });
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should work properly when pasting multiple link markdowns', () => {
      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, {
        plain:
          '[commit #1 title](https://bitbucket.org/SOME/REPO/commits/commit-id-1)\n' +
          '[commit #2 title](https://bitbucket.org/SOME/REPO/commits/commit-id-2)\n' +
          '[commit #3 title](https://bitbucket.org/SOME/REPO/commits/commit-id-3)\n' +
          '[commit #4 title](https://bitbucket.org/SOME/REPO/commits/commit-id-4)',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-1',
            })('commit #1 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-2',
            })('commit #2 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-3',
            })('commit #3 title'),
            hardBreak(),
            link({
              href: 'https://bitbucket.org/SOME/REPO/commits/commit-id-4',
            })('commit #4 title'),
          ),
        ),
      );
    });

    describe('actions and decisions', () => {
      beforeEach(() => {
        uuid.setStatic('local-decision');
      });

      afterEach(() => {
        uuid.setStatic(false);
      });

      it('pastes plain text into an action', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '[] ', sel);
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            taskList({ localId: 'local-decision' })(
              taskItem({ localId: 'local-decision' })('plain text'),
            ),
          ),
        );
      });

      it('pastes plain text into a decision', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '<> ', sel);
        dispatchPasteEvent(editorView, { plain: 'plain text' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })('plain text'),
            ),
          ),
        );
      });

      it('linkifies text pasted into a decision', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        insertText(editorView, '<> ', sel);
        dispatchPasteEvent(editorView, { plain: 'google.com' });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            decisionList({ localId: 'local-decision' })(
              decisionItem({ localId: 'local-decision' })(
                a({ href: 'http://google.com' })('google.com'),
              ),
            ),
          ),
        );
      });
    });
  });

  describe('extensions api v2 - auto convert', () => {
    beforeEach(() => {
      uuid.setStatic('testId');
    });

    afterEach(() => {
      uuid.setStatic(false);
    });
    const providerWithAutoConvertHandler = new DefaultExtensionProvider(
      [
        createFakeExtensionManifest({
          title: 'Jira issue',
          type: 'confluence.macro',
          extensionKey: 'jira-issue',
        }),
      ],
      [
        (text: string) => {
          if (text.startsWith(`http://jira-issue-convert`)) {
            return {
              type: 'inlineExtension',
              attrs: {
                extensionType: 'confluence.macro',
                extensionKey: 'jira-issue',
                parameters: {
                  macroParams: {
                    url: text,
                  },
                },
              },
            };
          }
        },
      ],
    );

    const assanaMacroWithAutoConvert = createFakeAutoConvertModule(
      createFakeExtensionManifest({
        title: 'Assana issue',
        type: 'forge.macro',
        extensionKey: 'assana-issue',
      }),
      'url',
      ['foo'],
    );

    const providerWithManifestAutoConvertHandler = new DefaultExtensionProvider(
      [assanaMacroWithAutoConvert],
    );

    const createEditorWithExtensionProviders = async (document: any) => {
      const { editorView } = editor(document, {
        extensionProvider: combineExtensionProviders([
          providerWithAutoConvertHandler,
          providerWithManifestAutoConvertHandler,
        ]),
      });

      await flushPromises();

      return editorView;
    };

    it('should convert based on handlers passed directly to the provider', async () => {
      const editorView = await createEditorWithExtensionProviders(
        doc(p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        plain: 'http://jira-issue-convert?paramA=CFE',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            inlineExtension({
              extensionType: 'confluence.macro',
              extensionKey: 'jira-issue',
              parameters: {
                macroParams: {
                  url: 'http://jira-issue-convert?paramA=CFE',
                },
              },
              localId: 'testId',
            })(),
          ),
        ),
      );
    });

    it('should convert based on handlers from the manifest', async () => {
      const editorView = await createEditorWithExtensionProviders(
        doc(p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        plain: 'http://assana-issue-foo?paramA=CFE',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          extension({
            extensionType: 'forge.macro',
            extensionKey: 'assana-issue',
            parameters: {
              url: 'http://assana-issue-foo?paramA=CFE',
            },
            text: 'Assana issue',
            layout: 'default',
            localId: 'testId',
          })(),
        ),
      );
    });
  });

  describe('macroPlugin', () => {
    const attrs = {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'dumbMacro',
      parameters: {
        macroParams: { paramA: { value: 'CFE' } },
        macroMetadata: {
          macroId: { value: 12345 },
          placeholder: [
            {
              data: { url: '' },
              type: 'icon',
            },
          ],
        },
      },
      localId: 'testId',
    };

    const cardProvider = Promise.resolve({
      resolve: () =>
        Promise.resolve({
          type: 'inlineCard',
          attrs: { url: 'https://jdog.jira-dev.com/browse/BENTO-3677' },
        }),
      async findPattern(): Promise<boolean> {
        return true;
      },
    } as CardProvider);

    const extensionProps = (cardOptions: CardOptions = {}): PluginsOptions => {
      providerFactory.setProvider(
        'macroProvider',
        Promise.resolve({
          config: {},
          openMacroBrowser: () => Promise.resolve({} as MacroAttributes),
          autoConvert: () => {
            return null;
          },
        }),
      );
      return {
        paste: {
          cardOptions: {
            provider: cardProvider,
            ...cardOptions,
          },
        },
      };
    };

    describe('should convert pasted content to link on selected text', () => {
      it('links text instead of pasting a macro', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
        );
        const href = 'http://www.dumbmacro.com?paramA=CFE';
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: href,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              hyperlinkPasteOnText: true,
            }),
          }),
        );
      });

      it('links text instead of pasting inline card', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(
          doc(p('This is the {<}selected text{>} here')),
          extensionProps({ resolveBeforeMacros: ['jira'] }),
        );
        const href = 'https://jdog.jira-dev.com/browse/BENTO-3677';

        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        await dispatchPasteEvent(editorView, {
          plain: href,
        });

        // let the card resolve
        const resolvedProvider = await cardProvider;
        await resolvedProvider.resolve(
          'https://jdog.jira-dev.com/browse/BENTO-3677',
          'inline',
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(p('This is the ', a({ href })('selected text'), ' here')),
        );

        expect(createAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              hyperlinkPasteOnText: true,
            }),
          }),
        );
      });
    });

    describe('should convert pasted content to inlineExtension (confluence macro)', () => {
      beforeEach(() => {
        uuid.setStatic('testId');
      });

      afterEach(() => {
        uuid.setStatic(false);
      });
      it('from plain text url', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')));
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'http://www.dumbmacro.com?paramA=CFE',
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                ...attrs,
                localId: 'testId',
              })(),
            ),
          ),
        );
      });

      it('inserts inline card when FF for resolving links over extensions is enabled', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(
          doc(p('Hello world{<>}')),
          extensionProps({ resolveBeforeMacros: ['jira'] }),
        );

        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        await dispatchPasteEvent(editorView, {
          plain: 'https://jdog.jira-dev.com/browse/BENTO-3677',
        });

        // let the card resolve
        const resolvedProvider = await cardProvider;
        await resolvedProvider.resolve(
          'https://jdog.jira-dev.com/browse/BENTO-3677',
          'inline',
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Hello world',
              inlineCard({
                url: 'https://jdog.jira-dev.com/browse/BENTO-3677',
              })(),
              ' ',
            ),
          ),
        );
      });

      it('inserts inlineExtension when FF for resolving links over extensions is disabled', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')), extensionProps());

        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        await dispatchPasteEvent(editorView, {
          plain: 'https://jdog.jira-dev.com/browse/BENTO-3677',
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                extensionType: 'com.atlassian.confluence.macro.core',
                extensionKey: 'jira',
                parameters: {
                  macroParams: {
                    paramA: {
                      value: 'https://jdog.jira-dev.com/browse/BENTO-3677',
                    },
                  },
                  macroMetadata: {
                    macroId: { value: 12345 },
                    placeholder: [
                      {
                        data: { url: '' },
                        type: 'icon',
                      },
                    ],
                  },
                },
                localId: 'testId',
              })(),
            ),
          ),
        );
      });

      it('from url in pasted html', async () => {
        const macroProvider = Promise.resolve(new MockMacroProvider({}));
        const { editorView } = editor(doc(p('{<>}')));
        await setMacroProvider(macroProvider)(editorView);
        await flushPromises();

        dispatchPasteEvent(editorView, {
          plain: 'http://www.dumbmacro.com?paramA=CFE',
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
          <html>
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="Content-Style-Type" content="text/css">
          <title></title>
          <meta name="Generator" content="Cocoa HTML Writer">
          <meta name="CocoaVersion" content="1561.6">
          <style type="text/css">
          p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 26.0px 'Helvetica Neue'; color: #000000}
          </style>
          </head>
          <body>
          <p class="p1">http://www.dumbmacro.com?paramA=CFE</p>
          </body>
          </html>
          `,
        });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineExtension({
                ...attrs,
                localId: 'testId',
              })(),
            ),
          ),
        );
      });
    });
  });

  describe('paste bodiedExtension inside another bodiedExtension', () => {
    it('should remove bodiedExtension from the pasted content, paste only content', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
        localId: 'testId',
      };
      const { editorView } = editor(doc(bodiedExtension(attrs)(p('{<>}'))));
      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><p data-pm-context="[]">text</p><div data-node-type="bodied-extension" data-extension-type="com.atlassian.confluence.macro.core" data-extension-key="expand" data-parameters="{&quot;macroMetadata&quot;:{&quot;macroId&quot;:{&quot;value&quot;:1521116439714},&quot;schemaVersion&quot;:{&quot;value&quot;:&quot;2&quot;},&quot;placeholder&quot;:[{&quot;data&quot;:{&quot;url&quot;:&quot;//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&amp;locale=en_GB&amp;version=2&quot;},&quot;type&quot;:&quot;image&quot;}]}}"><p>content</p></div>`,
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(bodiedExtension(attrs)(p('text'), p('content'))),
      );
    });
  });

  describe('paste part of bodied extension as test', () => {
    it('should remove bodiedExtension from the pasted content, paste only text', () => {
      const attrs = {
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'expand',
        localId: 'testId',
      };
      const { editorView } = editor(
        doc(bodiedExtension(attrs)(p('Hello')), p('{<>}')),
      );

      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><p data-pm-slice=1 1 [&quot;bodiedExtension&quot;,null]>llo</p>`,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(bodiedExtension(attrs)(p('Hello')), p('llo')),
      );
    });
  });

  describe('panel copy-paste', () => {
    it('should paste a panel when it is copied from editor / renderer', () => {
      const html = `
        <meta charset='utf-8'>
          <p>hello</p>
          <div class="ak-editor-panel" data-panel-type="info"><span class="ak-editor-panel__icon"><span class="Icon__IconWrapper-dyhwwi-0 bcqBjl" aria-label="Panel info"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><path d="M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-8.5a1 1 0 0 0-1 1V15a1 1 0 0 0 2 0v-2.5a1 1 0 0 0-1-1zm0-1.125a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75z" fill="currentColor" fill-rule="evenodd"></path></svg></span></span><div class="ak-editor-panel__content"><p>Inside panel</p></div></div>
          <p>world</p>
      `;

      const { editorView } = editor(doc(p('{<>}')));
      dispatchPasteEvent(editorView, { html });
      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello'), panel()(p('Inside panel')), p('world')),
      );
    });
  });

  describe('table copy-paste', () => {
    beforeEach(() => {
      uuid.setStatic(TABLE_LOCAL_ID);
    });

    afterEach(() => {
      uuid.setStatic(false);
    });

    it('should handle bad copy-paste from table cell with hard break', () => {
      const { editorView } = editor(
        doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('{<>}'))))),
      );

      dispatchPasteEvent(editorView, {
        html: `<meta charset='utf-8'><table data-number-column="true" style="margin: 24px 0px 0px; border-collapse: collapse; width: 678.889px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 14px; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><tbody style="border-bottom: none; box-sizing: border-box;"><tr style="box-sizing: border-box;"><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">TEST WITH HARDBREAK<br style="box-sizing: border-box;"></p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 8px; text-align: left; box-sizing: border-box; min-width: 48px; font-weight: normal; vertical-align: top; background-clip: padding-box;"></tr></tbody></table><br class="Apple-interchange-newline">`,
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('TEST WITH HARDBREAK', hardBreak()))),
          ),
        ),
      );
    });

    describe('when pasted list where openStart > openEnd', () => {
      beforeEach(() => {
        uuid.setStatic(TABLE_LOCAL_ID);
      });

      afterEach(() => {
        uuid.setStatic(false);
      });

      it('should flatten the list and dont split the table', () => {
        const { editorView } = editor(doc(table({})(tr(td()(p('{<>}'))))));
        const html = `<meta charset='utf-8'><ul class="ak-ul" data-pm-slice="5 3 []"><li><ul class="ak-ul"><li><p>2</p></li></ul></li><li><p>3</p></li></ul>`;

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td()(ul(li(p('2')), li(p('3'))))),
            ),
          ),
        );
      });
    });

    it('should handle numbered table copied inside editor', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="true" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th><p>One</p></th><th><p>Two</p></th></tr><tr><td><p>Three</p></td><td><p>Four</p></td></tr><tr><td><p>Five</p></td><td><p>Six</p></td></tr></tbody></table>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ isNumberColumnEnabled: true, localId: TABLE_LOCAL_ID })(
            tr(th()(p('One')), th()(p('Two'))),
            tr(td()(p('Three')), td()(p('Four'))),
            tr(td()(p('Five')), td()(p('Six'))),
          ),
        ),
      );
    });

    it('should handle numbered table copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><div class="pm-table-container " data-layout="default" style="margin: 0px auto 16px; padding: 0px; position: relative; box-sizing: border-box; transition: all 0.1s linear 0s; clear: both; color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; width: inherit;"><div class="pm-table-wrapper" style="margin: 0px; padding: 0px; overflow-x: auto;"><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="true" style="margin: 24px 0px 0px; border-collapse: collapse; width: 654px; border: 1px solid rgb(193, 199, 208); table-layout: fixed; font-size: 14px;"><colgroup style="box-sizing: border-box;"><col style="box-sizing: border-box; width: 42px;"><col style="box-sizing: border-box;"><col style="box-sizing: border-box;"></colgroup><tbody style="border-bottom: none; box-sizing: border-box;"><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;"></td><th rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; height: 3em; background-clip: padding-box; background-color: rgb(244, 245, 247);"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">One</p></th><th rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; vertical-align: top; box-sizing: border-box; min-width: 48px; height: 3em; background-clip: padding-box; background-color: rgb(244, 245, 247);"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Two</p></th></tr><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;">1</td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Three</p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Four</p></td></tr><tr style="box-sizing: border-box;"><td class="ak-renderer-table-number-column" style="border-width: 1px 1px 0px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: center; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box; background-color: rgb(244, 245, 247); width: 42px; color: rgb(107, 119, 140); font-size: 14px;">2</td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Five</p></td><td rowspan="1" colspan="1" style="border-width: 1px 0px 0px 1px; border-style: solid; border-color: rgb(193, 199, 208); border-image: initial; padding: 10px; text-align: left; box-sizing: border-box; min-width: 48px; height: 3em; vertical-align: top; background-clip: padding-box;"><p style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em; box-sizing: border-box;">Six</p></td></tr></tbody></table></div></div>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ isNumberColumnEnabled: true, localId: TABLE_LOCAL_ID })(
            tr(th()(p('One')), th()(p('Two'))),
            tr(td()(p('Three')), td()(p('Four'))),
            tr(td()(p('Five')), td()(p('Six'))),
          ),
        ),
      );
    });

    it('should paste table with cells that don`t have paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><meta name="generator" content="Sheets"/><style type="text/css"><!--td {border: 1px solid #ccc;}br {mso-data-placement:same-cell;}--></style><table data-table-local-id=${TABLE_LOCAL_ID} xmlns="http://www.w3.org/1999/xhtml" cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed;font-size:10pt;font-family:arial,sans,sans-serif;width:0px;border-collapse:collapse;border:none"><colgroup><col width="100"/><col width="86"/></colgroup><tbody><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;"></td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:2}">2</td></tr><tr style="height:21px;"><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:3}">3</td><td style="overflow:hidden;padding:2px 3px 2px 3px;vertical-align:bottom;text-align:right;" data-sheets-value="{&quot;1&quot;:3,&quot;3&quot;:4}">4</td></tr></tbody></table>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(td()(p('')), td()(p('2'))),
            tr(td()(p('3')), td()(p('4'))),
          ),
        ),
      );
    });
    describe('cell with background color', () => {
      const html = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-number-column="false" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td style="background-color: #ffebe6;" class="pm-table-cell-content-wrap"><p></p></td></tr></tbody></table>`;

      it('should keep cell background on paste when allow background color is enabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            advanced: true,
          },
        });

        dispatchPasteEvent(editorView, { html });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p(''))),
              tr(
                td({
                  background: '#ffebe6',
                })(p('')),
              ),
            ),
          ),
        );
      });

      it('should remove cell background on paste when allow background color is disabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            advanced: true,
            allowBackgroundColor: false,
          },
        });

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(th()(p(''))),
              tr(td()(p(''))),
            ),
          ),
        );
      });
    });

    describe('cell with colWidth', () => {
      const cellWithColWidthHtml = `<meta charset='utf-8'><table data-table-local-id=${TABLE_LOCAL_ID} data-pm-slice="1 1 []"><tbody><tr><td data-colwidth="96" style="" class="pm-table-cell-content-wrap"><div class="pm-table-cell-nodeview-wrapper"><div class="pm-table-cell-nodeview-content-dom"><p></p></div></div></td><td data-colwidth="122" style="" class="pm-table-cell-content-wrap"><div class="pm-table-cell-nodeview-wrapper"><div class="pm-table-cell-nodeview-content-dom"><p></p></div></div></td></tr></tbody></table>`;

      it('should keep colwidth attribute when allow column resizing is enabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            allowColumnResizing: true,
          },
        });

        dispatchPasteEvent(editorView, { html: cellWithColWidthHtml });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({ colwidth: [96] })(p('')), td({ colwidth: [122] })(p(''))),
            ),
          ),
        );
      });

      it('should remove colwidth attribute when allow column resizing is disabled', () => {
        const { editorView } = editor(doc(p('{<>}')), {
          table: {
            allowColumnResizing: false,
          },
        });

        dispatchPasteEvent(editorView, { html: cellWithColWidthHtml });

        expect(editorView.state.doc).toEqualDocument(
          doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(p('')), td()(p(''))))),
        );
      });
    });
  });

  describe('code-block copy-paste', () => {
    it('should persist selected language from clipboard', () => {
      const content = doc(
        '{<}',
        code_block({ language: 'javascript' })(
          'Shiver me timbers quarterdeck.',
        ),
        p('{>}'),
      );
      const { editorView } = editor(content);

      // Copy code block
      const { dom, text } = __serializeForClipboard(
        editorView,
        editorView.state.selection.content(),
      );

      // Paste code block
      dispatchPasteEvent(editorView, { html: dom.innerHTML, plain: text });
      expect(editorView.state.doc).toEqualDocument(content);
    });
  });

  describe('emoji copy-paste', () => {
    it('should handle emoji as sprite copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><span data-emoji-id="1f44d" data-emoji-short-name=":thumbsup:" data-emoji-text="👍" style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span class="f1yhv2qy emoji-common-node" aria-label=":thumbsup:" style="display: inline-block; margin: -1px 0px;"><span><span class="emoji-common-emoji-sprite" style="background: url(&quot;https://pf-emoji-service--cdn.us-east-1.staging.public.atl-paas.net/standard/a51a7674-8d5d-4495-a2d2-a67c090f5c3b/64x64/spritesheets/people.png&quot;) 69.4444% 8.57143% / 3700% 3600% no-repeat transparent; display: inline-block; height: 20px; vertical-align: middle; width: 20px;"> </span></span></span></span><span style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"></span>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji({ id: '1f44d', shortName: ':thumbsup:', text: '👍' })())),
      );
    });
    it('should handle emoji as image copied from renderer', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html = `<meta charset='utf-8'><span data-emoji-id="atlassian-yellow_star" data-emoji-short-name=":yellow_star:" data-emoji-text=":yellow_star:" style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span class="f14svvg8 emoji-common-node" aria-label=":yellow_star:" style="background-color: transparent; border-radius: 5px; display: inline-block; margin: -1px 0px; vertical-align: middle;"><span><img src="https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/yellow_star_64.png" alt=":yellow_star:" data-emoji-short-name=":yellow_star:" class="emoji" width="20" height="20" style="margin: 0px; padding: 0px; border: 0px; display: block; visibility: visible;"></span></span></span><span style="color: rgb(23, 43, 77); font-family: -apple-system, system-ui, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: -0.07px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"></span>`;

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p(emoji({ shortName: ':yellow_star:', text: '' })())),
      );
    });
  });

  describe('paste link copied from iphone "share" button', () => {
    /**
     * We need to define an attachTo here, as of PM-View 1.14.10 when a paste event
     * contains no html and no text data hes added a 'kludge' which requires the editor
     * to have a parent element to aid in the pasting non traditional data.
     */
    let attachTo = document.createElement('div');

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should paste link', () => {
      const { editorView } = editor(doc(p('{<>}')), undefined, attachTo);
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, { 'uri-list': uriList });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(p(link({ href: uriList })(uriList))),
      );
    });

    it('should paste link inline', () => {
      const { editorView } = editor(doc(p('hello {<>}')), undefined, attachTo);
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, { 'uri-list': uriList });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello ', link({ href: uriList })(uriList))),
      );
    });

    it('should paste link inside action', () => {
      const { editorView } = editor(
        doc(
          taskList({ localId: 'task-list-id' })(
            taskItem({ localId: 'task-item-id' })('{<>}'),
          ),
        ),
        undefined,
        attachTo,
      );
      const uriList = 'https://google.com.au';
      dispatchPasteEvent(editorView, { 'uri-list': uriList });

      jest.runAllTimers();

      expect(editorView.state.doc).toEqualDocument(
        doc(
          taskList({ localId: 'task-list-id' })(
            taskItem({ localId: 'task-item-id' })(
              link({ href: uriList })(uriList),
            ),
          ),
        ),
      );
    });
  });

  describe('splitting paragraphs', () => {
    it('should split simple text-based paragraphs into real paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const plain = 'text 1\n\ntext 2\r\n\r\ntext 3';

      dispatchPasteEvent(editorView, { plain });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('text 1'), p('text 2'), p('text 3')),
      );
    });

    it('should split multi-line text-based paragraphs into real paragraphs', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const plain =
        'text 1\nsecond line\nthird line\n\nsecond paragraph\nit good\r\nlast line';

      dispatchPasteEvent(editorView, { plain });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text 1', hardBreak(), 'second line', hardBreak(), 'third line'),
          p(
            'second paragraph',
            hardBreak(),
            'it good',
            hardBreak(),
            'last line',
          ),
        ),
      );
    });
  });

  describe('converting text to list', () => {
    it('works for a simple list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>* line 1<br />* line 2<br />* line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('maintains empty list items', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>* line 1<br />* <br />* line 3<br />* line 4';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p()), li(p('line 3')), li(p('line 4')))),
      );
    });

    it('converts hyphen bullets', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>- line 1<br />- line 2<br />- line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts unicode bullets', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>• line 1<br />• line 2<br />• line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts mixed bulleted list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>• line 1<br />- line 2<br />* line 3';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts numbered list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1. line 1<br />2. line 2<br />3. line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('doesnt convert `-` into a list when at start of an existing list item', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<p>A</p><ul><li><p>-</p></li><li><p>C</p></li></ul>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('A'), ul(li(p('-')), li(p('C')))),
      );
    });

    it('doesnt convert `*` into a list when at start of an existing list item', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<p>A</p><ul><li><p>*</p></li><li><p>C</p></li></ul>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('A'), ul(li(p('*')), li(p('C')))),
      );
    });

    it('only converts numbered list when followed by spaces', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1.line 1<br />2.line 2<br />3.line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('1.line 1', hardBreak(), '2.line 2', hardBreak(), '3.line 3')),
      );
    });

    it('only converts bullet list when followed by spaces', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>-13<br />-14<br />-15<br>- 16</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(p('-13', hardBreak(), '-14', hardBreak(), '-15'), ul(li(p('16')))),
      );
    });

    it('converts markdown-style numbered list (one without ordering)', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>1. line 1<br />1. line 2<br />1. line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ol(li(p('line 1')), li(p('line 2')), li(p('line 3')))),
      );
    });

    it('converts mixed numbered and bulleted list', () => {
      const { editorView } = editor(doc(p('{<>}')));
      const html = '<span>- line 1<br />1. line 2<br />* line 3</span>';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('line 1'))), ol(li(p('line 2'))), ul(li(p('line 3')))),
      );
    });

    it('converts a list with trailing text', () => {
      const { editorView } = editor(doc(p('{<>}')));

      const html =
        '<span>* line 1<br />* line 2<br />* line 3<br /><br />outside the list<br />line 2';

      dispatchPasteEvent(editorView, { html });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('line 1')), li(p('line 2')), li(p('line 3'))),
          p('outside the list', hardBreak(), 'line 2'),
        ),
      );
    });
  });

  describe('analytics V3', () => {
    const paragraphDoc = doc(p('Five{<>}'));
    const orderedListDoc = doc(ol(li(p('Five{<>}'))));
    const bulletListDoc = doc(ul(li(p('Five{<>}'))));
    const headingDoc = doc(h1('Five{<>}'));
    const panelDoc = doc(panel()(p('Five{<>}')));
    const blockQuoteDoc = doc(blockquote(p('Five{<>}')));
    const tableCellDoc = doc(
      table({ isNumberColumnEnabled: true })(
        tr(th()(p('One')), th()(p('Two'))),
        tr(td()(p('Th{<>}ree')), td()(p('Four'))),
        tr(td()(p('Five')), td()(p('Six'))),
      ),
    );

    describe('paste', () => {
      describe('layoutSection', () => {
        beforeEach(() => {
          (measureRenderMocked as jest.Mock).mockClear();
        });

        it('should create analytics event for pasting a layoutSection', () => {
          const { editorView } = editor(doc(p()));
          const html = `
          <meta charset='utf-8'><div data-layout-section="true" data-pm-slice="0 0 []"><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"><p>foo</p></div></div><div data-layout-column="true" style="flex-basis: 50%" data-column-width="50"><div data-layout-content="true"></div></div></div>
          `;
          const linkDomain: string[] = [];

          dispatchPasteEvent(editorView, { html, plain: '' });
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'pasted',
            actionSubject: 'document',
            actionSubjectId: ACTION_SUBJECT_ID.PASTE_PARAGRAPH,
            eventType: 'track',
            attributes: expect.objectContaining({
              content: 'layoutSection',
              inputMethod: 'keyboard',
              source: 'fabric-editor',
              type: 'richText',
            }),
            ...(linkDomain && linkDomain.length > 0
              ? { nonPrivacySafeAttributes: { linkDomain } }
              : {}),
          });
          expect(measureRenderMocked).toHaveBeenCalledTimes(1);
          const expectedContent = [
            'text',
            'paragraph',
            'layoutColumn',
            'layoutSection',
          ];
          expect(createPasteMeasurePayloadMocked).toHaveBeenLastCalledWith(
            expect.anything(),
            5000,
            expectedContent,
          );
        });
      });
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.each([
      ['paragraph', paragraphDoc, ACTION_SUBJECT_ID.PASTE_PARAGRAPH],
      ['ordered list', orderedListDoc, ACTION_SUBJECT_ID.PASTE_ORDERED_LIST],
      ['bullet list', bulletListDoc, ACTION_SUBJECT_ID.PASTE_BULLET_LIST],
      ['heading', headingDoc, ACTION_SUBJECT_ID.PASTE_HEADING],
      ['panel', panelDoc, ACTION_SUBJECT_ID.PASTE_PANEL],
      ['blockquote', blockQuoteDoc, ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE],
      ['table cell', tableCellDoc, ACTION_SUBJECT_ID.PASTE_TABLE_CELL],
    ])('paste inside %s', (_, doc, actionSubjectId) => {
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      const testCases: [string, string, string, string, string[]][] = [
        [
          'a paragraph',
          'text',
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'>hello world</p>",
          'www.google.com',
          [],
        ],
        [
          'an url',
          'url',
          "<meta charset='utf-8'><p data-pm-slice='1 1 []'><a href='http://www.google.com'>www.google.com</a></p>",
          'www.google.com',
          ['google.com'],
        ],
        [
          'only an url',
          'url',
          "<meta charset='utf-8'><a href='http://www.google.com'>www.google.com</a>",
          'www.google.com',
          ['google.com'],
        ],
        [
          'a mixed event',
          'mixed',
          "<meta charset='utf-8'><ul><li>Hello World</li></ul><p>Hello World</p>",
          'Hello World',
          [],
        ],
        [
          'a mixed event with a link',
          'mixed',
          "<meta charset='utf-8'><ul><li><a href='http://atlassian.com/foo'>Hello World</a></li></ul><p>Hello World</p>",
          'Hello World',
          ['atlassian.com'],
        ],
        [
          'a mixed event with multiple links',
          'mixed',
          "<meta charset='utf-8'><ul><li><a href='http://atlassian.com:443?foo'>Hello World</a></li><li><a href='http://foo.bar.net/bar/baz'>Hello World</a></li></ul><p>Hello World</p>",
          'Hello World',
          ['atlassian.com', 'foo.bar.net'],
        ],
        [
          'a bullet list',
          'bulletList',
          "<meta charset='utf-8'><ul><li>Hello World</li></ul>",
          'Hello World',
          [],
        ],
        [
          'an ordered list',
          'orderedList',
          "<meta charset='utf-8'><ol><li>Hello World</li></ol>",
          'Hello World',
          [],
        ],
        [
          'a heading',
          'heading',
          "<meta charset='utf-8'><h1>Hello World</h1>",
          '',
          [],
        ],
        [
          'a blockquote',
          'blockquote',
          "<meta charset='utf-8'><blockquote><p>Hello World</p></blockquote>",
          'Hello World',
          [],
        ],
        [
          'a code',
          'codeBlock',
          '<pre>code line 1\ncode line 2</pre>',
          'code line 1\ncode line 2',
          [],
        ],
        [
          'a table',
          'table',
          `<meta charset='utf-8'><table><tbody><tr><td><p>foo</p></td></tr></tbody></table>`,
          'foo',
          [],
        ],
        [
          'a decision list',
          'decisionList',
          `<meta charset='utf-8'><ol data-node-type="decisionList" data-decision-list-local-id="2b1a545e-a76d-4b9a-b0a8-c5996e51e32f" style="list-style: none; padding-left: 0"><li data-decision-local-id="f9ad0cf0-42e6-4c62-8076-7981b3fab3f7" data-decision-state="DECIDED">foo</li></ol>`,
          'foo',
          [],
        ],
        [
          'a task item',
          'taskItem',
          `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="c0060bd1-ee91-47e7-b55e-4f45bd2e0b0b" style="list-style: none; padding-left: 0"><div data-task-local-id="1803f18d-1fad-4998-81e4-644ed22f3929" data-task-state="TODO"> foo</div></div>`,
          'foo',
          [],
        ],
      ];

      test.each(testCases)(
        'should create analytics event for paste %s',
        (_, content, html, plain = '', linkDomain = []) => {
          dispatchPasteEvent(editorView, { html, plain });

          expect(createAnalyticsEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              action: 'pasted',
              actionSubject: 'document',
              actionSubjectId,
              eventType: 'track',
              attributes: expect.objectContaining({
                content,
                inputMethod: 'keyboard',
                source: 'uncategorized',
                type: 'richText',
                hyperlinkPasteOnText: false,
              }),
              ...(linkDomain && linkDomain.length > 0
                ? {
                    nonPrivacySafeAttributes: {
                      linkDomain: expect.arrayContaining(linkDomain),
                    },
                  }
                : {}),
            }),
          );
        },
      );
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.each([
      ['paragraph', paragraphDoc, ACTION_SUBJECT_ID.PASTE_PARAGRAPH],
      ['ordered list', orderedListDoc, ACTION_SUBJECT_ID.PASTE_ORDERED_LIST],
      ['bullet list', bulletListDoc, ACTION_SUBJECT_ID.PASTE_BULLET_LIST],
      ['heading', headingDoc, ACTION_SUBJECT_ID.PASTE_HEADING],
      ['table cell', tableCellDoc, ACTION_SUBJECT_ID.PASTE_TABLE_CELL],
    ])('paste inside %s', (_, doc, actionSubjectId) => {
      const testCase: [string, string, string, string, string[]] = [
        'a media single',
        'mediaSingle',
        `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
        '',
        [],
      ];
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      test('should create analytics event for paste a media single', () => {
        const [, content, html, plain = '', linkDomain = []] = testCase;
        dispatchPasteEvent(editorView, { html, plain });

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'pasted',
          actionSubject: 'document',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            content,
            inputMethod: 'keyboard',
            source: 'uncategorized',
            type: 'richText',
            hyperlinkPasteOnText: false,
          }),
          ...(linkDomain && linkDomain.length > 0
            ? { nonPrivacySafeAttributes: { linkDomain } }
            : {}),
        });
      });
    });

    /**
     * Table with this format
     * | description | document | actionSubjectId
     */
    describe.skip.each([
      ['panel', panelDoc, ACTION_SUBJECT_ID.PASTE_PANEL],
      ['blockquote', blockQuoteDoc, ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE],
    ])('paste inside %s', (_, doc, actionSubjectId) => {
      const testCase: [string, string, string, string, string[]] = [
        'a media single',
        'mediaSingle',
        `<meta charset='utf-8'><div data-node-type="mediaSingle" data-layout="center" data-width=""><div data-id="9b5c6412-6de0-42cb-837f-bc08c24b4383" data-node-type="media" data-type="file" data-collection="MediaServicesSample" data-width="490" data-height="288" title="Attachment" style="display: inline-block; border-radius: 3px; background: #EBECF0; box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);" data-file-name="image-20190325-222039.png" data-file-size="29502" data-file-mime-type="image/png"></div></div>`,
        '',
        [],
      ];
      let editorView: EditorView;

      beforeEach(() => {
        ({ editorView } = editor(doc));
      });

      /**
       * Table with the given format
       * | description | contentType | html paste event | plain paste event | link domain (if any) |
       */
      test('should create analytics event for paste a media single', () => {
        const [, content, html, plain = '', linkDomain = []] = testCase;
        dispatchPasteEvent(editorView, { html, plain });

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'pasted',
          actionSubject: 'document',
          actionSubjectId,
          eventType: 'track',
          attributes: expect.objectContaining({
            content,
            inputMethod: 'keyboard',
            source: 'uncategorized',
            type: 'richText',
            hyperlinkPasteOnText: false,
          }),
          ...(linkDomain && linkDomain.length > 0
            ? { nonPrivacySafeAttributes: { linkDomain } }
            : {}),
        });
      });
    });
  });
});
