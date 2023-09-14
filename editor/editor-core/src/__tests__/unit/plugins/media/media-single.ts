// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import createEvent from '@atlaskit/editor-test-helpers/create-event';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  caption,
  doc,
  p,
  mediaSingle,
  media,
  a,
  extension,
  unsupportedBlock,
  code_block,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
  insertMediaSingleNode,
  insertMediaAsMediaSingle,
} from '../../../../plugins/media/utils/media-single';
import type { MediaState } from '../../../../plugins/media/pm-plugins/main';
import {
  temporaryFileId,
  testCollectionName,
  temporaryMediaWithDimensions,
  temporaryMediaWithoutDimensions,
  temporaryMedia,
} from './_utils';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { richMediaClassName } from '@atlaskit/editor-common/styles';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { processRawValue } from '@atlaskit/editor-common/utils';
import {
  createSchema,
  mediaSingleWithCaption,
} from '@atlaskit/adf-schema/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import schema from '@atlaskit/editor-test-helpers/schema';

const createMediaState = (
  id: string,
  width = 256,
  height = 128,
  customFields?: Partial<MediaState>,
): MediaState => ({
  id,
  status: 'preview',
  dimensions: { width, height },
  ...customFields,
});

describe('media-single', () => {
  const fakeEditorAnalyticsAPI: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(jest.fn()),
  };
  const createEditor = createEditorFactory();
  const editor = (doc: DocBuilder) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
    });
    return createEditor({
      doc,
      editorProps: {
        allowExtension: true,
        media: {
          allowMediaSingle: true,
        },
        contextIdentifierProvider,
      },
      providerFactory,
    });
  };

  describe('insertMediaAsMediaSingle', () => {
    describe('when inserting node that is not a media node', () => {
      it('does not insert mediaSingle', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        insertMediaAsMediaSingle(
          editorView,
          p('world')(editorView.state.schema),
          INPUT_METHOD.PICKER_CLOUD,
          fakeEditorAnalyticsAPI,
        );

        expect(editorView.state.doc).toEqualDocument(doc(p('text')));
      });
    });

    describe('when inserting node is a media node', () => {
      describe('when media node is not an image', () => {
        it('does not insert mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'pdf',
            })()(editorView.state.schema),
            INPUT_METHOD.PICKER_CLOUD,
            fakeEditorAnalyticsAPI,
          );

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });

      describe('when media node is an image', () => {
        it('inserts mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
            INPUT_METHOD.PICKER_CLOUD,
            fakeEditorAnalyticsAPI,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  __fileMimeType: 'image/png',
                })(),
              ),
            ),
          );
        });
      });
    });
  });

  describe('insertMediaSingleNode', () => {
    describe('when there is only one image data', () => {
      it('inserts one mediaSingle node into the document', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertMediaSingleNode(
          editorView,
          createMediaState(temporaryFileId),
          INPUT_METHOD.PICKER_CLOUD,
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
          ),
        );
      });
    });

    describe('When alignment is set to left by default', () => {
      it('inserts media with layout: align-start', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertMediaSingleNode(
          editorView,
          createMediaState(temporaryFileId),
          INPUT_METHOD.PICKER_CLOUD,
          testCollectionName,
          true,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'align-start' })(
              temporaryMediaWithDimensions(),
            ),
          ),
        );
      });
    });

    describe("when there are multiple images' data", () => {
      it('inserts multiple mediaSingle nodes into the document', () => {
        const { editorView } = editor(doc(p('text{<>}hello')));

        (
          [
            createMediaState(temporaryFileId),
            createMediaState(temporaryFileId + '1'),
            createMediaState(temporaryFileId + '2'),
          ] as Array<MediaState>
        ).forEach((state) =>
          insertMediaSingleNode(
            editorView,
            state,
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          ),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '1',
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '2',
                type: 'file',
                collection: testCollectionName,
                width: 256,
                height: 128,
              })(),
            ),
            p('hello'),
          ),
        );
      });
    });

    describe('when current selection not empty', () => {
      describe('at the beginning of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('{<}text{>}')));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(),
            ),
          );
        });
      });

      describe('at the middle of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('hello'), p('{<}text{>}'), p()));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(''),
            ),
          );
        });
      });

      describe('at the end of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(
            doc(p('hello'), p('world'), p('{<}text{>}')),
          );

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              p('world'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(''),
            ),
          );
        });
      });

      describe('is NodeSelection', () => {
        it('replaces the selected node', () => {
          const { editorView } = editor(
            doc(
              p('hello'),
              '{<node>}',
              extension({ extensionKey: 'extKey', extensionType: 'extType' })(),
            ),
          );

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            INPUT_METHOD.PICKER_CLOUD,
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
              p(),
            ),
          );
        });
      });
    });

    describe('when current selection the middle of a code block', () => {
      it('does not split the code block', () => {
        const { editorView } = editor(
          doc(code_block({})('This is a {<>}code block')),
        );

        insertMediaSingleNode(
          editorView,
          createMediaState(temporaryFileId),
          INPUT_METHOD.PICKER_CLOUD,
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            code_block({})('This is a code block'),
            mediaSingle({ layout: 'center' })(temporaryMediaWithDimensions()),
          ),
        );
      });
    });

    it('should respect scaleFactor', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        { ...createMediaState(temporaryFileId), scaleFactor: 2 },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            temporaryMediaWithDimensions(128, 64),
          ),
        ),
      );
    });

    it('should create a media node with integer dimensions after scaleFactor', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        { ...createMediaState(temporaryFileId), scaleFactor: 2.2 },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            temporaryMediaWithDimensions(116, 58),
          ),
        ),
      );
    });

    it('should not set dimensions on media node if none defined', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        {
          id: temporaryFileId,
          status: 'preview',
        },
        INPUT_METHOD.PICKER_CLOUD,
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
    });
  });

  // ED-14263: previously we were outputting an illegal width attribute to a div. This attribute has been removed.
  it.skip('should be able to show mediaSingle without width', () => {
    const { editorView } = editor(
      doc(p('text'), mediaSingle()(temporaryMedia), p()),
    );

    const mediaSingleDom = editorView.dom.querySelector(
      `.${richMediaClassName}`,
    );
    expect(mediaSingleDom).toBeInstanceOf(HTMLElement);
    expect(mediaSingleDom!.getAttribute('width')).toBe('250');
  });

  it('Does not call stop propagation when single image is pasted', async () => {
    const { editorView } = editor(doc(p('')));
    const event = createEvent('paste');
    const eventSpy = jest.spyOn(event, 'stopPropagation');
    dispatchPasteEvent(
      editorView,
      {
        html: `<meta charset='utf-8'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Domestic_Cat_Face_Shot.jpg/220px-Domestic_Cat_Face_Shot.jpg"/>`,
        types: ['Files', 'text/html'],
      },
      undefined,
      event,
    );
    expect(eventSpy).toHaveBeenCalledTimes(0);
  });

  it('Make sure external is true if the copied is a media blob url', async () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: `<meta charset='utf-8'><img src="blob:http://localhost:9000/cd1d250b-3436-4e88-895d-01f712146540#media-blob-url=true&amp;id=6cb9b2e5-108f-4adc-bade-8d862f9aa2de&amp;collection=MediaServicesSample&amp;contextId=DUMMY-OBJECT-ID&amp;mimeType=image%2Fpng&amp;name=image-20200205-235344.png&amp;size=119473"/>`,
      types: ['Files', 'text/html'],
    });
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'center' })(
          media({
            type: 'external',
            url: 'blob:http://localhost:9000/cd1d250b-3436-4e88-895d-01f712146540#media-blob-url=true&id=6cb9b2e5-108f-4adc-bade-8d862f9aa2de&collection=MediaServicesSample&contextId=DUMMY-OBJECT-ID&mimeType=image%2Fpng&name=image-20200205-235344.png&size=119473',
            alt: '',
            __external: true,
          })(),
        ),
      ),
    );
  });

  it('Make sure media links are preserved when pasted', async () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      // media with link
      html: `<meta http-equiv="content-type" content="text/html; charset=utf-8"><div class="media-single image-center sc-jRuhRL ljqReD sc-fjdhpX dsDffE" width="211" data-node-type="mediaSingle" data-layout="center" data-width="33" data-block-link="https://product-fabric.atlassian.net/browse/FAB-1520" style="margin: 24px auto; padding: 0px; width: 211px; max-width: 100%; float: none; position: relative; transition: width 100ms ease-in 0s; clear: both; color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;"><span class="sc-jzJRlG cACmLx" style="position: absolute; top: 8px; right: 8px; z-index: 1;"><a class="sc-cSHVUG idrpXi" href="https://product-fabric.atlassian.net/browse/FAB-1520" target="_blank" rel="noreferrer noopener" style="color: rgb(66, 82, 110); text-decoration: none; display: flex; background: rgb(235, 236, 240); padding: 4px; width: 16px; height: 16px; border-radius: 4px; border: 2px solid rgb(255, 255, 255); transition: opacity 0.3s cubic-bezier(0.15, 1, 0.3, 1) 0s; box-sizing: initial !important; opacity: 0;"><span class="sc-jTzLTM guSXWZ" role="img" aria-label="https://product-fabric.atlassian.net/browse/FAB-1520" style="height: 16px; width: 16px; color: currentcolor; display: inline-block; fill: rgb(255, 255, 255); flex-shrink: 0; line-height: 1;"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor"><path d="M19.005 19c-.003 0-.005.002-.005.002l.005-.002zM5 19.006c0-.004-.002-.006-.005-.006H5v.006zM5 4.994V5v-.006zM19 19v-6h2v6.002A1.996 1.996 0 0 1 19.005 21H4.995A1.996 1.996 0 0 1 3 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2H5v14h14zM5 4.994V5v-.006zm0 14.012c0-.004-.002-.006-.005-.006H5v.006zM11 5H5v14h14v-6h2v6.002A1.996 1.996 0 0 1 19.005 21H4.995A1.996 1.996 0 0 1 3 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2zm8 0v3a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0 0 2h3z"></path><path d="M12.707 12.707l8-8a1 1 0 1 0-1.414-1.414l-8 8a1 1 0 0 0 1.414 1.414z"></path></g></svg></span></a></span><div class="sc-eQGPmX fLrJDt" data-context-id="DUMMY-OBJECT-ID" data-type="file" data-node-type="media" data-width="750" data-height="1000" data-id="37afeb9e-dec2-4e3e-9b55-4c61dfe4e070" data-collection="MediaServicesSample" data-file-name="hollow knight.png" data-file-size="263056" data-file-mime-type="image/png" style="margin: 0px; padding: 0px; position: static !important; height: 0px;"><div class="sc-fCPvlr fzVecg" style="margin: 0px; padding: 0px; width: 211px; height: 281.328px; position: absolute;"><div class="sc-epGmkI diUsiz" data-testid="media-card-view" style="margin: 0px; padding: 0px; border-radius: 2px; height: 1260px; max-height: 100%; width: 945px; max-width: 100%; cursor: pointer;"><div class="sc-hizQCF dtCEvd sc-ekkqgF glhAvB" data-testid="media-file-card-view" data-test-status="complete" style="margin: 0px; padding: 0px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; border-radius: 3px; background: transparent; line-height: normal; position: relative; width: 211px; height: 281.328px;"><div class="wrapper" style="margin: 0px; padding: 0px; box-sizing: border-box; border-radius: 2px; display: block; height: inherit; position: relative;"><div class="img-wrapper" style="margin: 0px; padding: 0px; box-sizing: border-box; border-radius: 3px; position: relative; width: inherit; height: inherit; display: block; overflow: hidden;"><img class="sc-eerKOB eXfNIv" data-testid="media-image" draggable="false" src="blob:http://localhost:9000/a2abda27-97be-4f1a-9004-4ebde3d349c6#media-blob-url=true&amp;id=37afeb9e-dec2-4e3e-9b55-4c61dfe4e070&amp;collection=MediaServicesSample&amp;contextId=DUMMY-OBJECT-ID&amp;mimeType=image%2Fpng&amp;name=hollow%20knight.png&amp;size=263056&amp;width=750&amp;height=1000" style="margin: 0px; padding: 0px; border: 0px; position: absolute; left: 105.5px; top: 140.656px; box-sizing: border-box; transform: translate(-50%, -50%); height: 281.328px;"></div></div></div></div></div></div></div>`,
      types: ['Files', 'text/html'],
    });
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'center', width: 33 })(
          a({ href: 'https://product-fabric.atlassian.net/browse/FAB-1520' })(
            media({
              type: 'file',
              id: '37afeb9e-dec2-4e3e-9b55-4c61dfe4e070',
              collection: 'MediaServicesSample',
              height: 1000,
              width: 750,

              __contextId: 'DUMMY-OBJECT-ID',
              __fileMimeType: 'image/png',
              __fileName: 'hollow knight.png',
              __fileSize: 263056,
              __mediaTraceId: expect.any(String),
            })(),
          ),
        ),
      ),
    );
  });

  describe('unsupportedBlock', () => {
    describe('mediaSingle', () => {
      it('should not wrap media in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                type: 'file',
                id: '1234',
                collection: 'SampleCollection',
              })(),
            ),
          ),
        );
      });

      it('should wrap unknown in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'unknown',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              unsupportedBlock({
                originalValue: {
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                  type: 'unknown',
                },
              })(),
            ),
          ),
        );
      });

      it('should wrap all unknown nodes in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'unknown',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
                {
                  type: 'unknown2',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              unsupportedBlock({
                originalValue: {
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                  type: 'unknown',
                },
              })(),
              unsupportedBlock({
                originalValue: {
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                  type: 'unknown2',
                },
              })(),
            ),
          ),
        );
      });

      it('should wrap caption in mediaSingle as unsupportedBlock', () => {
        const nodesConfig = [
          'doc',
          'mediaSingle',
          'media',
          'text',
          'unsupportedBlock',
        ];
        const schema = createSchema({
          nodes: nodesConfig,
        });
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
                {
                  type: 'caption',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                id: '1234',
                type: 'file',
                collection: 'SampleCollection',
              })(),
              unsupportedBlock({
                originalValue: {
                  content: [
                    {
                      text: 'Hello World!',
                      type: 'text',
                    },
                  ],
                  type: 'caption',
                },
              })(),
            ),
          ),
        );
      });

      it('should wrap all unknown nodes in unsupportedBlock and should allow media', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
                {
                  type: 'unknown',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                id: '1234',
                type: 'file',
                collection: 'SampleCollection',
              })(),
              unsupportedBlock({
                originalValue: {
                  content: [
                    {
                      text: 'Hello World!',
                      type: 'text',
                    },
                  ],
                  type: 'unknown',
                },
              })(),
            ),
          ),
        );
      });
    });

    describe('mediaSingle with captions', () => {
      const nodesConfig = [
        'doc',
        'mediaSingle',
        'media',
        'caption',
        'text',
        'unsupportedBlock',
      ];
      const schema = createSchema({
        nodes: nodesConfig,
        customNodeSpecs: { mediaSingle: mediaSingleWithCaption },
      });
      it('should not wrap media in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'media',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                type: 'file',
                id: '1234',
                collection: 'SampleCollection',
              })(),
            ),
          ),
        );
      });

      it('should wrap unknown in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'unknown',
                  attrs: {
                    id: '1234',
                    collection: 'SampleCollection',
                    type: 'file',
                  },
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              unsupportedBlock({
                originalValue: {
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                  type: 'unknown',
                },
              })(),
            ),
          ),
        );
      });

      it('should wrap unknown node in unsupportedBlock and not media', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: '1234',
                    collection: 'SampleCollection',
                    type: 'file',
                  },
                },
                {
                  type: 'unknown',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                id: '1234',
                collection: 'SampleCollection',
                type: 'file',
              })(),
              unsupportedBlock({
                originalValue: {
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                  type: 'unknown',
                },
              })(),
            ),
          ),
        );
      });

      it('should wrap unknown nodes in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              content: [
                {
                  type: 'unknown',
                  attrs: {
                    type: 'file',
                    id: '1234',
                    collection: 'SampleCollection',
                  },
                },
                {
                  type: 'unknown',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              unsupportedBlock({
                originalValue: {
                  attrs: {
                    id: '1234',
                    collection: 'SampleCollection',
                    type: 'file',
                  },
                  type: 'unknown',
                },
              })(),
              unsupportedBlock({
                originalValue: {
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                  type: 'unknown',
                },
              })(),
            ),
          ),
        );
      });

      it('should not wrap media and caption nodes in unsupportedBlock', () => {
        const result = processRawValue(schema, {
          version: 1,
          type: 'doc',
          content: [
            {
              type: 'mediaSingle',
              attrs: {
                layout: 'center',
              },
              content: [
                {
                  type: 'media',
                  attrs: {
                    id: '1234',
                    collection: 'SampleCollection',
                    type: 'file',
                  },
                },
                {
                  type: 'caption',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello World!',
                    },
                  ],
                },
              ],
            },
          ],
        });

        expect(result).toEqualDocument(
          doc(
            mediaSingle({ layout: 'center' })(
              media({
                id: '1234',
                collection: 'SampleCollection',
                type: 'file',
              })(),
              caption('Hello World!'),
            ),
          ),
        );
      });
    });
  });

  describe('Media single insertion with extended resize experience', () => {
    const widthPluginState = (
      lineLength: number = 760,
      width: number = 1800,
    ) => ({ lineLength, width });

    describe('it should have width and widthType correctly defined', () => {
      describe('when all widths are defined and media width is smaller than 24px', () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 15, 15),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 24,
                  widthType: 'pixel',
                })(temporaryMediaWithDimensions(15, 15)),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 15, 15),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions(15, 15)),
                p(),
              ),
            );
          },
        );
      });

      describe('when all widths are defined and media width is small', () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 256,
                  widthType: 'pixel',
                })(temporaryMediaWithDimensions()),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions()),
                p(),
              ),
            );
          },
        );
      });

      describe('when all widths are defined and media width is big', () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 2000, 2100),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 760,
                  widthType: 'pixel',
                })(temporaryMediaWithDimensions(2000, 2100)),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 2000, 2100),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions(2000, 2100)),
                p(),
              ),
            );
          },
        );
      });

      describe('when media dimension is undefined', () => {
        const mediState: MediaState = {
          id: temporaryFileId,
          status: 'preview',
        };
        describe('and editor widths are defined', () => {
          ffTest(
            'platform.editor.media.extended-resize-experience',
            () => {
              const { editorView } = editor(doc(p('')));

              insertMediaSingleNode(
                editorView,
                mediState,
                INPUT_METHOD.PICKER_CLOUD,
                testCollectionName,
                false,
                false,
                widthPluginState(),
              );
              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaSingle({
                    layout: 'center',
                    width: 250,
                    widthType: 'pixel',
                  })(temporaryMediaWithoutDimensions()),
                  p(),
                ),
              );
            },
            () => {
              const { editorView } = editor(doc(p('')));

              insertMediaSingleNode(
                editorView,
                mediState,
                INPUT_METHOD.PICKER_CLOUD,
                testCollectionName,
                false,
                false,
                widthPluginState(),
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaSingle({
                    layout: 'center',
                  })(temporaryMediaWithoutDimensions()),
                  p(),
                ),
              );
            },
          );
        });

        describe('and editor content width is undefined', () => {
          ffTest(
            'platform.editor.media.extended-resize-experience',
            () => {
              const { editorView } = editor(doc(p('')));

              insertMediaSingleNode(
                editorView,
                mediState,
                INPUT_METHOD.PICKER_CLOUD,
                testCollectionName,
                false,
                false,
                { lineLength: undefined, width: 900 },
              );
              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaSingle({
                    layout: 'center',
                    width: 250,
                    widthType: 'pixel',
                  })(temporaryMediaWithoutDimensions()),
                  p(),
                ),
              );
            },
            () => {
              const { editorView } = editor(doc(p('')));

              insertMediaSingleNode(
                editorView,
                mediState,
                INPUT_METHOD.PICKER_CLOUD,
                testCollectionName,
                false,
                false,
                { lineLength: undefined, width: 900 },
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaSingle({
                    layout: 'center',
                  })(temporaryMediaWithoutDimensions()),
                  p(),
                ),
              );
            },
          );
        });
      });

      describe('when width plugin is not available', () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 256,
                  widthType: 'pixel',
                })(temporaryMediaWithDimensions()),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithDimensions()),
                p(),
              ),
            );
          },
        );
      });

      describe('when both media dimension and editor width are unavailable', () => {
        const mediState: MediaState = {
          id: temporaryFileId,
          status: 'preview',
        };
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              mediState,
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(0, 0),
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 250,
                  widthType: 'pixel',
                })(temporaryMediaWithoutDimensions()),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              mediState,
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(0, 0),
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(temporaryMediaWithoutDimensions()),
                p(),
              ),
            );
          },
        );
      });

      describe('when all widths are defined and video media width is smaller than 320 (min width)', () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 100, 100, {
                fileMimeType: 'video/quicktime',
              }),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                  width: 320,
                  widthType: 'pixel',
                })(
                  temporaryMediaWithDimensions(100, 100, {
                    __fileMimeType: 'video/quicktime',
                  }),
                ),
                p(),
              ),
            );
          },
          () => {
            const { editorView } = editor(doc(p('')));

            insertMediaSingleNode(
              editorView,
              createMediaState(temporaryFileId, 100, 100, {
                fileMimeType: 'video/quicktime',
              }),
              INPUT_METHOD.PICKER_CLOUD,
              testCollectionName,
              false,
              false,
              widthPluginState(),
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaSingle({
                  layout: 'center',
                })(
                  temporaryMediaWithDimensions(100, 100, {
                    __fileMimeType: 'video/quicktime',
                  }),
                ),
                p(),
              ),
            );
          },
        );
      });
    });
  });

  describe('paste mediaSingle with widthType', () => {
    const createClipboardContent = (
      width?: number,
      widthType?: string,
      layout?: string,
    ) => {
      return {
        html: `<meta charset='utf-8'>
              <div data-node-type="mediaSingle"
                   data-layout="${layout}"
                   data-width="${width}"
                   data-width-type="${widthType}"
                   data-pm-slice="0 0 []">
                <div data-id="test_id"
                  data-node-type="media"
                  data-type="file"
                  data-collection="MediaServicesSample"
                  data-width="179"
                  data-height="390"
                  data-alt=""
                  title="Attachment"
                  data-file-name="image-test.png"
                  data-file-size="31700"
                  data-file-mime-type="image/png"
                  data-context-id="DUMMY-OBJECT-ID">
                </div>
              </div>`,
        types: ['text/html'],
      };
    };

    describe('paste pixel widthType', () => {
      ffTest(
        'platform.editor.media.extended-resize-experience',
        () => {
          const { editorView } = editor(doc(p('')));
          const event = createEvent('paste');

          const clipboardData = createClipboardContent(120, 'pixel', 'center');

          dispatchPasteEvent(editorView, clipboardData, undefined, event);
          expect(editorView.state.doc.firstChild?.attrs).toMatchObject({
            width: 120,
            layout: 'center',
            widthType: 'pixel',
          });
        },
        () => {
          const { editorView } = editor(doc(p('')));
          const event = createEvent('paste');

          const clipboardData = createClipboardContent(120, 'pixel', 'center');

          dispatchPasteEvent(editorView, clipboardData, undefined, event);
          expect(editorView.state.doc.firstChild?.attrs).toMatchObject({
            layout: 'center',
          });
        },
      );
    });

    describe('paste percentage widthType', () => {
      ffTest(
        'platform.editor.media.extended-resize-experience',
        () => {
          const { editorView } = editor(doc(p('')));
          const event = createEvent('paste');

          const clipboardData = createClipboardContent(
            80,
            'percentage',
            'center',
          );

          dispatchPasteEvent(editorView, clipboardData, undefined, event);
          expect(editorView.state.doc.firstChild?.attrs).toMatchObject({
            width: 80,
            layout: 'center',
            widthType: 'percentage',
          });
        },
        () => {
          const { editorView } = editor(doc(p('')));
          const event = createEvent('paste');

          const clipboardData = createClipboardContent(
            80,
            'percentage',
            'center',
          );

          dispatchPasteEvent(editorView, clipboardData, undefined, event);
          expect(editorView.state.doc.firstChild?.attrs).toEqual({
            width: 80,
            layout: 'center',
          });
        },
      );
    });
  });
});
