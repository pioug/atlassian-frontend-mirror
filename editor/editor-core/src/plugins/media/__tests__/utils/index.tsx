import React from 'react';
import assert from 'assert';
import { EditorView } from 'prosemirror-view';

import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import randomId from '@atlaskit/editor-test-helpers/random-id';

import {
  doc,
  h1,
  mediaGroup,
  mediaSingle,
  media,
  p,
  ol,
  ul,
  li,
  hr,
  table,
  tr,
  td,
  tdCursor,
  tdEmpty,
  code_block,
  Refs,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';

import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import sleep from '@atlaskit/editor-test-helpers/sleep';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { stateKey as mediaPluginKey } from '../../../../plugins/media/pm-plugins/plugin-key';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import { AnalyticsHandler, analyticsService } from '../../../../analytics';
import {
  insertMediaAsMediaSingle,
  alignAttributes,
} from '../../../../plugins/media/utils/media-single';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Clipboard } from '@atlaskit/media-picker';
import { UploadPreviewUpdateEventPayload } from '@atlaskit/media-picker/types';
import { waitUntil } from '@atlaskit/media-test-helpers';
import {
  temporaryMedia,
  temporaryMediaGroup,
  getFreshMediaProvider,
  waitForAllPickersInitialised,
  testCollectionName,
  temporaryFileId,
} from '../../../../__tests__/unit/plugins/media/_utils';
import {
  MediaAttributes,
  MediaSingleAttributes,
  defaultSchema,
  MediaADFAttrs,
} from '@atlaskit/adf-schema';
import { ReactWrapper, mount } from 'enzyme';
import { ClipboardWrapper } from '../../../../plugins/media/ui/MediaPicker/ClipboardWrapper';
import { INPUT_METHOD } from '../../../../plugins/analytics';
import MediaSingleNode from '../../nodeviews/mediaSingle';
import MediaItem, { MediaNodeProps } from '../../nodeviews/media';
import {
  CardEvent,
  CardOnClickCallback,
} from '../../../../../../../media/media-card/src';
import { FileDetails } from '../../../../../../../media/media-client/src';
import { Schema } from '../../../../../../editor-test-helpers/src/schema';
import { CellSelection } from 'prosemirror-tables';
import { TextSelection } from 'prosemirror-state';
import { EditorInstanceWithPlugin } from '../../../../../../editor-test-helpers/src/create-editor';
import { MediaPluginState } from '../../pm-plugins/types';

const pdfFile = {
  id: `${randomId()}`,
  fileName: 'lala.pdf',
  fileSize: 200,
  fileMimeType: 'pdf',
  dimensions: { width: 200, height: 200 },
  fileId: Promise.resolve('pdf'),
};

describe('Media plugin', () => {
  const createEditor = createEditorFactory<MediaPluginState>();

  const contextIdentifierProvider = storyContextIdentifierProviderFactory();
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({
    mediaProvider,
    contextIdentifierProvider,
  });

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const mediaPluginOptions = (dropzoneContainer: HTMLElement) => ({
    provider: mediaProvider,
    allowMediaSingle: true,
    customDropzoneContainer: dropzoneContainer,
  });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({
      fire() {},
    });
    return createEditor({
      doc,
      editorProps: {
        ...editorProps,
        media: mediaPluginOptions(dropzoneContainer),
        allowRule: true,
        allowTables: true,
        allowAnalyticsGASV3: true,
        contextIdentifierProvider,
        quickInsert: true,
      },
      providerFactory,
      pluginKey: mediaPluginKey,
      createAnalyticsEvent,
    });
  };

  const getNodePos = (
    pluginState: MediaPluginState,
    id: string,
    isMediaSingle: boolean,
  ) => {
    const mediaNodeWithPos = isMediaSingle
      ? pluginState.findMediaNode(id)
      : pluginState.mediaGroupNodes[id];

    assert(
      mediaNodeWithPos,
      `Media node with id "${id}" has not been mounted yet`,
    );

    return mediaNodeWithPos!.getPos();
  };

  afterAll(() => {
    providerFactory.destroy();
  });

  describe('editor', () => {
    describe('All uploads finished', () => {
      let mediaPluginState: MediaPluginState;
      const foo = {
        id: '1',
        fileMimeType: 'image/jpeg',
        fileName: 'foo.jpg',
        fileSize: 100,
        dimensions: {
          height: 100,
          width: 100,
        },
      };
      beforeEach(() => {
        ({ pluginState: mediaPluginState } = editor(doc(p(''))));
      });

      it('should be false when an image is inserted', function() {
        mediaPluginState.insertFile(foo, () => {});
        expect(mediaPluginState.allUploadsFinished).toBe(false);
      });

      it('should be true when an inserted file is ready', async () => {
        mediaPluginState.insertFile(foo, listener => {
          listener({ status: 'ready', id: 'dummy-id' });
        });

        await mediaPluginState.waitForPendingTasks();

        expect(mediaPluginState.allUploadsFinished).toBe(true);
      });

      describe('update and dispatch', () => {
        let updateAndDispatchSpy: jest.SpyInstance;
        beforeEach(() => {
          updateAndDispatchSpy = jest.spyOn(
            mediaPluginState,
            'updateAndDispatch',
          );
        });

        afterEach(() => {
          updateAndDispatchSpy.mockRestore();
        });

        it('should invoke it with allUploadsFinished false when an image is inserted', function() {
          mediaPluginState.insertFile(foo, () => {});

          expect(updateAndDispatchSpy).toHaveBeenLastCalledWith({
            allUploadsFinished: false,
          });
        });

        it('should invoke it with allUploadsFinished true when an inserted image is ready', async () => {
          mediaPluginState.insertFile(foo, listener => {
            listener({ status: 'ready', id: 'dummy-id' });
          });

          await mediaPluginState.waitForPendingTasks();

          expect(updateAndDispatchSpy).toHaveBeenLastCalledWith({
            allUploadsFinished: true,
          });
        });
      });
    });
    describe('when all of the files are images', () => {
      it('inserts single medias', async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await mediaProvider;

        const foo = {
          id: '1',
          fileMimeType: 'image/jpeg',
          fileName: 'foo.jpg',
          fileSize: 100,
          dimensions: {
            height: 100,
            width: 100,
          },
        };

        const bar = {
          id: '2',
          fileMimeType: 'image/png',
          fileName: 'bar.png',
          fileSize: 200,
          dimensions: {
            height: 200,
            width: 200,
          },
        };

        pluginState.insertFile(foo, () => {});
        pluginState.insertFile(bar, () => {});

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'center',
            })(
              media({
                id: '1',
                type: 'file',
                collection: testCollectionName,
                __fileName: 'foo.jpg',
                __fileSize: 100,
                __fileMimeType: 'image/jpeg',
                __contextId: 'DUMMY-OBJECT-ID',
                height: 100,
                width: 100,
              })(),
            ),
            mediaSingle({
              layout: 'center',
            })(
              media({
                id: '2',
                type: 'file',
                collection: testCollectionName,
                __fileName: 'bar.png',
                __fileSize: 200,
                __fileMimeType: 'image/png',
                __contextId: 'DUMMY-OBJECT-ID',
                height: 200,
                width: 200,
              })(),
            ),
            p(),
          ),
        );
      });

      describe('when inserting inside table cell', () => {
        it('does not add add a dummy mediaSingle node', () => {
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
          );

          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
            INPUT_METHOD.CLIPBOARD,
          );

          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
            INPUT_METHOD.CLIPBOARD,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              table()(
                tr(
                  td({})(
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: temporaryFileId,
                        type: 'file',
                        collection: testCollectionName,
                        __fileMimeType: 'image/png',
                      })(),
                    ),
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: temporaryFileId,
                        type: 'file',
                        collection: testCollectionName,
                        __fileMimeType: 'image/png',
                      })(),
                    ),
                    p(),
                  ),
                  tdEmpty,
                  tdEmpty,
                ),
              ),
            ),
          );
        });

        it('inserts media single', async () => {
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
          );

          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
            INPUT_METHOD.CLIPBOARD,
          );

          // Different from media single that those optional properties are copied over only when the thumbnail is ready in media group.
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table()(
                tr(
                  td({})(
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: temporaryFileId,
                        type: 'file',
                        collection: testCollectionName,
                        __fileMimeType: 'image/png',
                      })(),
                    ),
                    p(),
                  ),
                  tdEmpty,
                  tdEmpty,
                ),
              ),
            ),
          );
        });
      });
    });

    describe('when it is a mix of pdf and image', () => {
      it('inserts pdf as a media group and images as single', async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await mediaProvider;
        const lala = {
          id: 'lala',
          fileName: 'lala.pdf',
          fileSize: 200,
          fileMimeType: 'pdf',
          dimensions: { width: 200, height: 200 },
        };

        const bar = {
          id: 'bar',
          fileName: 'bar.png',
          fileSize: 200,
          fileMimeType: 'image/png',
          dimensions: { width: 200, height: 200 },
        };

        pluginState.insertFile(lala, () => {});
        pluginState.insertFile(bar, () => {});

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaGroup(
              media({
                id: 'lala',
                type: 'file',
                __fileMimeType: 'pdf',
                __fileSize: 200,
                __fileName: 'lala.pdf',
                __contextId: 'DUMMY-OBJECT-ID',
                collection: testCollectionName,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: 'bar',
                __fileName: 'bar.png',
                __fileSize: 200,
                height: 200,
                width: 200,
                __fileMimeType: 'image/png',
                __contextId: 'DUMMY-OBJECT-ID',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p(),
          ),
        );
      });
    });
  });

  it('should set new pickers exactly when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    await getFreshMediaProvider();
    await getFreshMediaProvider();

    await waitForAllPickersInitialised(pluginState);

    expect(pluginState.pickers.length).toBe(1);
  });

  it('should re-use old pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    await getFreshMediaProvider();

    await waitForAllPickersInitialised(pluginState);

    const pickersAfterMediaProvider1 = pluginState.pickers;
    expect(pickersAfterMediaProvider1.length).toBe(1);

    await getFreshMediaProvider();

    await waitForAllPickersInitialised(pluginState);

    const pickersAfterMediaProvider2 = pluginState.pickers;

    expect(pickersAfterMediaProvider1).toHaveLength(
      pickersAfterMediaProvider2.length,
    );
    for (let i = 0; i < pickersAfterMediaProvider1.length; i++) {
      expect(pickersAfterMediaProvider1[i]).toEqual(
        pickersAfterMediaProvider2[i],
      );
    }
  });

  it('should set new upload params for existing pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    const mediaProvider1 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider1);
    await mediaProvider1;

    pluginState.pickers.forEach(picker => {
      picker.setUploadParams = jest.fn();
    });

    const mediaProvider2 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider2);
    await mediaProvider2;

    pluginState.pickers.forEach(picker => {
      expect(picker.setUploadParams as any).toHaveBeenCalledTimes(1);
    });
  });

  it.skip('should trigger analytics events for picking and dropzone', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    await mediaProvider;
    await waitForAllPickersInitialised(pluginState);

    const testFileData = {
      file: {
        id: 'test',
        name: 'test.png',
        size: 1,
        type: 'file/test',
      },
      preview: {
        dimensions: {
          height: 200,
          width: 200,
        },
      },
    };

    (pluginState as any).dropzonePicker!.handleUploadPreviewUpdate(
      testFileData,
    );
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.dropzone', {
      fileMimeType: 'file/test',
    });
  });

  it('should trigger analytics events for picking and popup', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    await mediaProvider;
    await waitForAllPickersInitialised(pluginState);

    const testFileData = {
      file: {
        id: 'test',
        name: 'test.png',
        size: 1,
        type: 'file/test',
      },
      preview: {
        dimensions: {
          height: 200,
          width: 200,
        },
      },
    };

    (pluginState as any).popupPicker!.handleUploadPreviewUpdate(testFileData);
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.popup', {
      fileMimeType: 'file/test',
    });
  });

  describe('handleMediaNodeRemove', () => {
    it('removes media node', () => {
      const deletingMediaNodeId = 'foo';
      const deletingMediaNode = media({
        id: deletingMediaNodeId,
        type: 'file',
        __fileMimeType: 'pdf',
        collection: testCollectionName,
      })();
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(deletingMediaNode),
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      const pos = getNodePos(pluginState, deletingMediaNodeId, false);
      pluginState.handleMediaNodeRemoval(
        deletingMediaNode(editorView.state.schema),
        () => pos,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      pluginState.destroy();
    });
  });

  describe('removeSelectedMediaContainer', () => {
    describe('when selection is a mediaSingle node', () => {
      it('removes node', () => {
        const { editorView, pluginState } = editor(
          doc(mediaSingle()(temporaryMedia)),
        );
        setNodeSelection(editorView, 0);

        pluginState.removeSelectedMediaContainer();

        expect(editorView.state.doc).toEqualDocument(doc(p()));

        pluginState.destroy();
      });

      it('returns true', () => {
        const { editorView, pluginState } = editor(
          doc(mediaSingle()(temporaryMedia)),
        );
        setNodeSelection(editorView, 0);

        expect(pluginState.removeSelectedMediaContainer()).toBe(true);

        pluginState.destroy();
      });
    });

    describe('when selection is a non media node', () => {
      it('does not remove media node', () => {
        const { editorView, pluginState } = editor(
          doc(hr(), mediaGroup(temporaryMedia)),
        );
        setNodeSelection(editorView, 0);

        pluginState.removeSelectedMediaContainer();

        expect(editorView.state.doc).toEqualDocument(
          doc(hr(), mediaGroup(temporaryMedia)),
        );

        pluginState.destroy();
      });

      it('returns false', () => {
        const { editorView, pluginState } = editor(
          doc(hr(), mediaGroup(temporaryMedia)),
        );
        setNodeSelection(editorView, 0);

        expect(pluginState.removeSelectedMediaContainer()).toBe(false);

        pluginState.destroy();
      });
    });

    describe('when selection is text', () => {
      it('does not remove media node', () => {
        const { editorView, pluginState } = editor(
          doc(p('hello{<>}'), mediaGroup(temporaryMedia)),
        );

        pluginState.removeSelectedMediaContainer();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello'), mediaGroup(temporaryMedia)),
        );

        pluginState.destroy();
      });

      it('returns false', () => {
        const { pluginState } = editor(
          doc(p('hello{<>}'), mediaGroup(temporaryMedia)),
        );

        expect(pluginState.removeSelectedMediaContainer()).toBe(false);
        pluginState.destroy();
      });
    });
  });

  it('should focus the editor after files are added to the document', async () => {
    const { editorView, pluginState } = editor(doc(p('')));
    await mediaProvider;

    const spy = jest.spyOn(editorView, 'focus');

    pluginState.insertFile({ id: 'foo' }, () => {});
    expect(spy).toHaveBeenCalled();

    pluginState.insertFile({ id: 'bar' }, () => {});
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaGroup(
          media({
            id: 'bar',
            type: 'file',
            collection: testCollectionName,
            __contextId: 'DUMMY-OBJECT-ID',
          })(),
          media({
            id: 'foo',
            type: 'file',
            collection: testCollectionName,
            __contextId: 'DUMMY-OBJECT-ID',
          })(),
        ),
        p(),
      ),
    );
    spy.mockRestore();

    pluginState.destroy();
  });

  it('should copy optional attributes from MediaState to Node attrs', () => {
    const { editorView, pluginState } = editor(doc(p('{<>}')));
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);

    pluginState.insertFile(
      {
        id: temporaryFileId,
        status: 'preview',
        fileName: 'foo.png',
        fileSize: 1234,
        fileMimeType: 'pdf',
      },
      () => {},
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaGroup(
          media({
            id: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileName: 'foo.png',
            __fileSize: 1234,
            __fileMimeType: 'pdf',
          })(),
        ),
        p(),
      ),
    );
    collectionFromProvider.mockRestore();

    pluginState.destroy();
  });

  describe('splitMediaGroup', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
      const positionOfFirstMediaNode = 2;
      setNodeSelection(editorView, positionOfFirstMediaNode);

      pluginState.splitMediaGroup();

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p(),
        ),
      );

      pluginState.destroy();
    });

    describe('when insert text in the middle of media group', () => {
      it('splits media group', () => {
        const { editorView, pluginState } = editor(
          doc(
            mediaGroup(
              media({
                id: 'media1',
                type: 'file',
                collection: testCollectionName,
              })(),
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        const positionOfFirstMediaNode = 1;
        setNodeSelection(editorView, positionOfFirstMediaNode);

        insertText(editorView, 'hello', 1);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('hello'),
            mediaGroup(
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
          ),
        );

        pluginState.destroy();
      });
    });
  });

  describe('Drop Placeholder', () => {
    // Copied from MediaPicker DropZone test spec
    const createDragOverOrLeaveEvent = (
      eventName: 'dragover' | 'dragleave',
      type?: string,
    ) => {
      const event = document.createEvent('Event') as any;
      event.initEvent(eventName, true, true);
      event.preventDefault = () => {};

      event.dataTransfer = {
        types: [type || 'Files'],
        files: [],
        effectAllowed: 'move',
      };

      return event;
    };

    const getWidgetDom = (editorView: EditorView): Node | null =>
      (editorView as any).docView.dom.querySelector('.ProseMirror-widget');

    let dropzoneContainer: HTMLElement | undefined;

    beforeEach(() => {
      dropzoneContainer = document.createElement('div');
    });

    afterEach(() => {
      dropzoneContainer = undefined;
    });

    it.skip('should show the placeholder at the current position inside paragraph', async () => {
      const { editorView } = editor(
        doc(p('hello{<>} world')),
        {},
        dropzoneContainer,
      );

      await mediaProvider;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).toBeNull();

      dropzoneContainer!.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).toBeDefined();
      expect(dragZoneDom!.previousSibling!.textContent).toEqual('hello');
      expect(dragZoneDom!.nextSibling!.textContent).toEqual(' world');

      dropzoneContainer!.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).toBeNull();
    });

    it.skip('should show the placeholder for code block', async () => {
      const { editorView } = editor(
        doc(code_block()('const foo = undefined;{<>}')),
        {},
        dropzoneContainer,
      );

      await mediaProvider;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).toBeNull();

      dropzoneContainer!.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).toBeDefined();
      expect(dragZoneDom!.previousSibling!.textContent).toEqual(
        'const foo = undefined;',
      );
      expect(dragZoneDom!.nextSibling!.textContent).toEqual('');

      dropzoneContainer!.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).toBeNull();
    });
  });

  describe('element', () => {
    describe('when mediaSingle node is selected', () => {
      it('returns dom', () => {
        const { editorView, pluginState } = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                width: 100,
                height: 100,
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        setNodeSelection(editorView, 0);

        expect(pluginState.element).not.toBeUndefined();
        expect(pluginState.element!.className).toBe(
          'mediaSingleView-content-wrap ProseMirror-selectednode',
        );
      });

      describe('while holding the shift key', () => {
        let mediaSingleNode: (schema: Schema<any, any>) => RefsNode,
          shiftClickEvent: CardEvent,
          wrapper: ReactWrapper;
        const mediaData: MediaADFAttrs = {
          id: 'media_test',
          type: 'file',
          width: 100,
          height: 100,
          collection: testCollectionName,
        };
        beforeEach(() => {
          mediaSingleNode = mediaSingle({ layout: 'wrap-left' })(
            media(mediaData)(),
          );
          shiftClickEvent = {
            event: ({
              shiftKey: true,
              stopPropagation: jest.fn(),
            } as unknown) as React.MouseEvent<HTMLElement>,
            mediaItemDetails: {} as FileDetails,
          };
        });

        afterEach(() => {
          if (wrapper) {
            wrapper.unmount();
          }
        });

        function setupWrapper(
          editorInstance: EditorInstanceWithPlugin<MediaPluginState>,
        ): {
          mediaItem: ReactWrapper<MediaNodeProps>;
          onClickHandler: CardOnClickCallback;
        } {
          wrapper = mount(
            <MediaSingleNode
              view={editorInstance.editorView}
              eventDispatcher={editorInstance.eventDispatcher}
              node={mediaSingleNode(defaultSchema)}
              lineLength={680}
              getPos={() => editorInstance.refs['startMediaSingle']}
              width={123}
              selected={() => 1}
              mediaOptions={{ allowResizing: false }}
              contextIdentifierProvider={contextIdentifierProvider}
              mediaPluginState={editorInstance.pluginState}
            />,
          );

          const mediaItem = wrapper.find(MediaItem);
          const onClickHandler = mediaItem.prop(
            'onClick',
          ) as CardOnClickCallback;

          return { mediaItem, onClickHandler };
        }

        describe('should include media into text selection', () => {
          [
            {
              name: 'when text selection is before media',
              doc: doc(
                p('{<}test{>}'),
                '{startMediaSingle}',
                mediaSingle()(media(mediaData)()),
                '{endMediaSingle}',
                p('test'),
              ),
              expectedFromRef: '<',
              expectedToRef: 'endMediaSingle',
            },
            {
              name: 'when text selection is after media',
              doc: doc(
                p('test'),
                '{startMediaSingle}',
                mediaSingle()(media(mediaData)()),
                '{endMediaSingle}',
                p('{<}test{>}'),
              ),
              expectedFromRef: 'startMediaSingle',
              expectedToRef: '>',
            },
            {
              name: 'when text selection is around media',
              doc: doc(
                p('{<}test'),
                '{startMediaSingle}',
                mediaSingle()(media(mediaData)()),
                '{endMediaSingle}',
                p('test{>}'),
              ),
              expectedFromRef: '<',
              expectedToRef: '>',
            },
          ].forEach(testCase => {
            it(testCase.name, () => {
              const editorInstance = editor(testCase.doc);
              const { onClickHandler } = setupWrapper(editorInstance);

              onClickHandler(shiftClickEvent);

              expect(shiftClickEvent.event.stopPropagation).toHaveBeenCalled();
              expect(
                editorInstance.editorView.state.selection instanceof
                  TextSelection,
              ).toBe(true);

              const selectedRange =
                editorInstance.editorView.state.selection.ranges[0];
              expect(selectedRange.$from.pos).toBe(
                editorInstance.refs[testCase.expectedFromRef],
              );
              expect(selectedRange.$to.pos).toBe(
                editorInstance.refs[testCase.expectedToRef],
              );
            });
          });
        });

        it('should not select if media is within a table and cells are selected', () => {
          const editorInstance = editor(
            doc(
              table()(
                tr(
                  td({})(p('{<cell}text1')),
                  td({})(
                    '{startMediaSingle}',
                    mediaSingleNode,
                    p('{cell>}text2'),
                  ),
                ),
              ),
            ),
          );

          setupWrapper(editorInstance);

          expect(
            editorInstance.editorView.state.selection instanceof CellSelection,
          ).toBe(true);
        });
      });
    });

    describe('when cursor is on one of the media nodes inside media group', () => {
      it('returns dom', () => {
        const { editorView, pluginState } = editor(doc(temporaryMediaGroup));
        setNodeSelection(editorView, 1);

        expect(pluginState.element).toBeUndefined();
      });
    });

    describe('when cursor is not on a media node', () => {
      it('returns undefined', () => {
        const { pluginState } = editor(
          doc(mediaSingle({ layout: 'wrap-left' })(temporaryMedia), p('{<>}')),
        );

        expect(pluginState.element).toBeUndefined();
      });
    });

    describe('when cursor move from a mediaSingle node to another mediaSingle node', () => {
      let pluginState: MediaPluginState;
      let editorView: EditorView;

      beforeEach(() => {
        const createdEditor = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media1',
                type: 'file',
                collection: testCollectionName,
                width: 100,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 100,
              })(),
            ),
            p(''),
          ),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;

        setNodeSelection(editorView, 0);
      });

      it('returns dom', () => {
        setNodeSelection(editorView, 3);

        expect(pluginState.element).not.toBeUndefined();
      });
    });

    describe('when cursor move to a mediaSingle node', () => {
      let pluginState: MediaPluginState;
      let editorView: EditorView;

      beforeEach(() => {
        const createdEditor = editor(
          doc(mediaSingle({ layout: 'wrap-left' })(temporaryMedia), p('{<>}')),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;
      });

      it('returns dom', () => {
        setNodeSelection(editorView, 0);

        expect(pluginState.element).not.toBeUndefined();
      });
    });

    describe('when cursor move away from a mediaSingle node', () => {
      let pluginState: MediaPluginState;
      let editorView: EditorView;
      let refs: Refs;

      beforeEach(() => {
        const createdEditor = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(temporaryMedia),
            p('{nextPos}'),
          ),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;
        refs = createdEditor.refs;

        setNodeSelection(editorView, 0);
      });

      it('returns undefined', () => {
        const { nextPos } = refs;

        setTextSelection(editorView, nextPos);

        expect(pluginState.element).toBeUndefined();
      });
    });
  });

  describe('when inserting into a list', () => {
    it('should insert media group after orderer list', async () => {
      const listDoc = doc(ol(li(p('text'))));
      const { pluginState, editorView } = editor(listDoc);
      await mediaProvider;

      pluginState.insertFile(pdfFile, () => {});

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ol(li(p('text'))),
          mediaGroup(
            media({
              id: pdfFile.id,
              type: 'file',
              __fileMimeType: pdfFile.fileMimeType,
              __fileName: pdfFile.fileName,
              __fileSize: pdfFile.fileSize,
              __contextId: 'DUMMY-OBJECT-ID',
              collection: testCollectionName,
            })(),
          ),
          p(''),
        ),
      );
    });

    it('should insert media group after unorderer list', async () => {
      const listDoc = doc(ul(li(p('text'))));
      const { pluginState, editorView } = editor(listDoc);
      await mediaProvider;

      pluginState.insertFile(pdfFile, () => {});

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('text'))),
          mediaGroup(
            media({
              id: pdfFile.id,
              type: 'file',
              __fileMimeType: pdfFile.fileMimeType,
              __fileName: pdfFile.fileName,
              __fileSize: pdfFile.fileSize,
              __contextId: 'DUMMY-OBJECT-ID',
              collection: testCollectionName,
            })(),
          ),
          p(''),
        ),
      );
    });

    it('should insert media in the media group that already exist', async () => {
      const listDoc = doc(
        ul(li(p('te{<>}xt'))),
        mediaGroup(
          media({
            id: pdfFile.id,
            type: 'file',
            __fileMimeType: pdfFile.fileMimeType,
            __fileName: pdfFile.fileName,
            __fileSize: pdfFile.fileSize,
            __contextId: 'DUMMY-OBJECT-ID',
            collection: testCollectionName,
          })(),
        ),
        p(''),
      );
      const { pluginState, editorView } = editor(listDoc);
      await mediaProvider;

      pluginState.insertFile(pdfFile, () => {});

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(li(p('text'))),
          mediaGroup(
            media({
              id: pdfFile.id,
              type: 'file',
              __fileMimeType: pdfFile.fileMimeType,
              __fileName: pdfFile.fileName,
              __fileSize: pdfFile.fileSize,
              __contextId: 'DUMMY-OBJECT-ID',
              collection: testCollectionName,
            })(),
            media({
              id: pdfFile.id,

              type: 'file',
              __fileMimeType: pdfFile.fileMimeType,
              __fileName: pdfFile.fileName,
              __fileSize: pdfFile.fileSize,
              __contextId: 'DUMMY-OBJECT-ID',
              collection: testCollectionName,
            })(),
          ),
          p(''),
        ),
      );
    });
  });

  describe('media clipboard wrapper', () => {
    let mediaPosition: number;
    let editorView: EditorView;
    let mediaState: MediaPluginState;
    let mediaAttributes: MediaAttributes;
    let clipboardWrapper: ReactWrapper<any, any, any>;

    beforeEach(async () => {
      mediaAttributes = {
        id: 'media',
        type: 'file',
        collection: testCollectionName,
      };

      ({ pluginState: mediaState, editorView } = editor(
        doc(
          p('hello'),
          mediaSingle({ layout: 'center' })(media(mediaAttributes)()),
        ),
      ));

      await mediaState.setMediaProvider(mediaProvider);

      mediaPosition = 7;

      setNodeSelection(editorView, mediaPosition);

      clipboardWrapper = mountWithIntl(
        <ClipboardWrapper mediaState={mediaState} />,
      );
    });

    afterEach(() => {
      if (clipboardWrapper && typeof clipboardWrapper.unmount === 'function') {
        clipboardWrapper.unmount();
      }
    });

    /**
     * Re-introduce this test when we figure out why it fails in pipelines
     * https://product-fabric.atlassian.net/browse/MS-1961
     */
    it.skip('should trigger analytics for clipboard', async () => {
      const spy = jest.fn();
      analyticsService.handler = spy as AnalyticsHandler;

      afterEach(() => {
        analyticsService.handler = null;
      });

      const testFileData: UploadPreviewUpdateEventPayload = {
        file: {
          id: 'test',
          name: 'test.png',
          size: 1,
          type: 'file/test',
          creationDate: 1,
        },
        preview: {
          dimensions: {
            height: 200,
            width: 200,
          },
          scaleFactor: 1,
        },
      };

      await waitUntil(
        () =>
          (clipboardWrapper as any).state('pickerFacadeInstance') !==
            undefined &&
          !clipboardWrapper
            .update()
            .find(Clipboard)
            .isEmpty(),
      );

      const onPreviewUpdate = clipboardWrapper
        .find(Clipboard)
        .prop('onPreviewUpdate');

      onPreviewUpdate && onPreviewUpdate(testFileData);
      expect(spy).toHaveBeenCalledWith(
        'atlassian.editor.media.file.clipboard',
        {
          fileMimeType: 'file/test',
        },
      );
    });
  });

  it('should trigger cloud picker opened analytics event when opened via quick insert', async () => {
    const { editorView, sel, pluginState } = editor(
      doc(p('{<>}')),
      {},
      undefined,
    );
    await waitForAllPickersInitialised(pluginState);
    insertText(editorView, '/Files', sel);
    sendKeyToPm(editorView, 'Enter');

    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'opened',
      actionSubject: 'picker',
      actionSubjectId: 'cloudPicker',
      attributes: { inputMethod: 'quickInsert' },
      eventType: 'ui',
    });
  });

  describe('image layout modes', () => {
    describe('alignment', () => {
      describe('100% image', () => {
        it('maintains width for center layout', () => {
          const centerNode: MediaSingleAttributes = {
            width: 100,
            layout: 'center',
          };
          expect(alignAttributes('center', centerNode)).toEqual({
            width: 100,
            layout: 'center',
          });
        });

        it('resizes to half width on align-start', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('align-start', centerNode)).toEqual({
            layout: 'align-start',
            width: 50,
          });
        });

        it('resizes to half width on align-end', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('align-end', centerNode)).toEqual({
            layout: 'align-end',
            width: 50,
          });
        });

        it('resizes to half width on wrap-left', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('wrap-left', centerNode)).toEqual({
            layout: 'wrap-left',
            width: 50,
          });
        });

        it('resizes to half width on wrap-right', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('wrap-right', centerNode)).toEqual({
            layout: 'wrap-right',
            width: 50,
          });
        });

        it('changes layout to wide', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('wide', centerNode)).toEqual({
            layout: 'wide',
          });
        });

        it('changes layout to full-width', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('full-width', centerNode)).toEqual({
            layout: 'full-width',
          });
        });
      });

      describe('50% image', () => {
        const centerNode: MediaSingleAttributes = {
          layout: 'center',
          width: 50,
        };

        it('maintains width on center', () => {
          const leftAlignedNode: MediaSingleAttributes = {
            layout: 'center',
            width: 50,
          };
          expect(alignAttributes('center', leftAlignedNode)).toEqual({
            layout: 'center',
            width: 50,
          });
        });

        it('maintains width on align-start', () => {
          expect(alignAttributes('align-start', centerNode)).toEqual({
            layout: 'align-start',
            width: 50,
          });
        });

        it('maintains width on align-end', () => {
          expect(alignAttributes('align-end', centerNode)).toEqual({
            layout: 'align-end',
            width: 50,
          });
        });

        it('maintains width on wrap-left', () => {
          expect(alignAttributes('wrap-left', centerNode)).toEqual({
            layout: 'wrap-left',
            width: 50,
          });
        });

        it('maintains width on wrap-right', () => {
          expect(alignAttributes('wrap-right', centerNode)).toEqual({
            layout: 'wrap-right',
            width: 50,
          });
        });

        it('changes layout to wide', () => {
          expect(alignAttributes('wide', centerNode)).toEqual({
            layout: 'wide',
            width: 50,
          });
        });

        it('changes layout to full-width', () => {
          expect(alignAttributes('full-width', centerNode)).toEqual({
            layout: 'full-width',
            width: 50,
          });
        });
      });

      describe('11-column align-left image', () => {
        it('changes width to 10-column on centering', () => {
          const attrs: MediaSingleAttributes = {
            width: 91.6,
            layout: 'align-start',
          };

          expect(alignAttributes('center', attrs)).toEqual({
            layout: 'center',
            width: 83.33333333333334,
          });
        });
      });

      describe('unresized image', () => {
        it('does not apply width if already center', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('center', centerNode)).toEqual({
            layout: 'center',
          });
        });

        it('resizes to half width on align-start', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('align-start', centerNode)).toEqual({
            layout: 'align-start',
            width: 50,
          });
        });

        it('resizes to half width on align-end', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('align-end', centerNode)).toEqual({
            layout: 'align-end',
            width: 50,
          });
        });

        it('resizes to half width on wrap-left', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('wrap-left', centerNode)).toEqual({
            layout: 'wrap-left',
            width: 50,
          });
        });

        it('resizes to half width on wrap-right', () => {
          const centerNode: MediaSingleAttributes = { layout: 'center' };
          expect(alignAttributes('wrap-right', centerNode)).toEqual({
            layout: 'wrap-right',
            width: 50,
          });
        });
      });
    });
  });
});
