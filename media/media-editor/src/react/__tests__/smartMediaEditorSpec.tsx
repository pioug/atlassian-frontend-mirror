import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper } from 'enzyme';
import {
  asMock,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
  fakeMediaClient,
  mountWithIntlContext,
  getDefaultMediaClientConfig,
  nextTick,
  sleep,
} from '@atlaskit/media-test-helpers';
import { Shortcut } from '@atlaskit/media-ui';
import ModalDialog from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import {
  MediaClient,
  FileState,
  FileIdentifier,
  TouchedFiles,
  UploadableFileUpfrontIds,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import {
  SmartMediaEditor,
  SmartMediaEditorProps,
  SmartMediaEditorState,
  convertFileNameToPng,
} from '../smartMediaEditor';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { EditorView, EditorViewProps } from '../editorView/editorView';
import ErrorView, { ErrorViewProps } from '../editorView/errorView/errorView';
import { ANALYTICS_MEDIA_CHANNEL } from '../../common';
import { Blanket } from '../styled';

describe('Smart Media Editor', () => {
  let fileIdPromise: Promise<string>;
  let fileId: string;
  let fileIdentifier: FileIdentifier;
  let onFinish: SmartMediaEditorProps['onFinish'];
  let onUploadStart: SmartMediaEditorProps['onUploadStart'];
  let onClose: SmartMediaEditorProps['onClose'];
  let mediaClient: MediaClient;
  let component: ReactWrapper<SmartMediaEditorProps, SmartMediaEditorState>;
  let givenFileStateObservable: ReplaySubject<FileState>;
  let formatMessage: jest.Mock<any>;
  let fakeCreateAnalyticsEvent: jest.Mock<any>;
  let fakeAnalyticsEventFire: jest.Mock<any>;

  beforeEach(() => {
    formatMessage = jest
      .fn()
      .mockImplementation((message: any) => message.defaultMessage);
    const fakeIntl: any = { formatMessage };
    fileId = 'some-file-id';
    fileIdPromise = Promise.resolve(fileId);
    fileIdentifier = {
      id: fileIdPromise,
      mediaItemType: 'file',
      collectionName: 'some-collection-name',
      occurrenceKey: 'some-occurrence-key',
    };
    onFinish = jest.fn();
    onClose = jest.fn();
    onUploadStart = jest.fn();
    mediaClient = fakeMediaClient();
    fakeAnalyticsEventFire = jest.fn();
    fakeCreateAnalyticsEvent = jest
      .fn()
      .mockImplementation(() => ({ fire: fakeAnalyticsEventFire }));
    givenFileStateObservable = new ReplaySubject<FileState>(1);
    asMock(mediaClient.file.getFileState).mockReturnValue(
      givenFileStateObservable,
    );

    component = mountWithIntlContext<
      SmartMediaEditorProps,
      SmartMediaEditorState
    >(
      <SmartMediaEditor
        mediaClient={mediaClient}
        identifier={fileIdentifier}
        onFinish={onFinish}
        onClose={onClose}
        onUploadStart={onUploadStart}
        intl={fakeIntl}
        createAnalyticsEvent={fakeCreateAnalyticsEvent}
      />,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call onClose when escape pressed', () => {
    const shortcut = component.find(Shortcut);
    const { keyCode, handler } = shortcut.props();
    expectToEqual(keyCode, 27);
    handler();
    expect(onClose).toHaveBeenCalled();
  });
  it('should display spinner on initial render', () => {
    expect(component.find(Spinner)).toHaveLength(1);
  });

  it('should pass click even through Blanket', () => {
    const stopPropagation = jest.fn();
    component.find(Blanket).simulate('click', { stopPropagation });
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should call getFileState for given file', async () => {
    const { collectionName, occurrenceKey } = fileIdentifier;
    await fileIdPromise;
    expectFunctionToHaveBeenCalledWith(mediaClient.file.getFileState, [
      fileId,
      {
        collectionName,
        occurrenceKey,
      },
    ]);
  });

  const forFileToBeProcessed = async () => {
    const imageUrlPromise = Promise.resolve('https://some-image-url');
    asMock(mediaClient.getImageUrl).mockReturnValue(imageUrlPromise);
    givenFileStateObservable.next({
      status: 'processed',
      id: fileId,
      occurrenceKey: 'some-occurrence-key',
      mediaType: 'image',
      mimeType: 'image/gif',
      name: 'some-name',
      size: 42,
      artifacts: {},
      representations: {},
    });
    await fileIdPromise;
    await imageUrlPromise;
    component.update();
    await nextTick();
  };

  describe('when incoming file is processed', () => {
    beforeEach(async () => {
      await forFileToBeProcessed();
    });

    it('should render EditorView', async () => {
      const editorView = component.find<EditorViewProps & InjectedIntlProps>(
        EditorView,
      );
      expect(editorView).toHaveLength(1);
      const { imageUrl } = editorView.props();
      expectToEqual(imageUrl, 'https://some-image-url');
    });

    it('should call mediaClient.getImageUrl', () => {
      expectFunctionToHaveBeenCalledWith(mediaClient.getImageUrl, [
        fileId,
        {
          collection: fileIdentifier.collectionName,
          mode: 'full-fit',
        },
      ]);
    });

    it('should not listen for farther file states', async () => {
      // Wait for observable unsubscription
      await sleep();
      givenFileStateObservable.next({
        status: 'error',
        id: fileId,
        occurrenceKey: 'some-occurrence-key',
      });
      component.update();
      expect(component.find('ErrorView')).toHaveLength(0);
      expect(component.find(EditorView)).toHaveLength(1);
    });
  });

  describe('onSave callback', () => {
    let resultingFileStateObservable: ReplaySubject<FileState>;
    const callEditorViewOnSaveWithCustomMediaClient = (
      customMediaClient: MediaClient,
    ) => {
      resultingFileStateObservable = new ReplaySubject<FileState>(1);
      const touchedFiles: TouchedFiles = {
        created: [
          {
            fileId: 'some-file-id',
            uploadId: 'some-upload-id',
          },
        ],
      };
      asMock(customMediaClient.file.touchFiles).mockResolvedValue(touchedFiles);
      asMock(customMediaClient.file.upload).mockReturnValue(
        resultingFileStateObservable,
      );
      const editorView = component.find<EditorViewProps & InjectedIntlProps>(
        EditorView,
      );
      const { onSave } = editorView.props();
      onSave('some-image-content', { width: 200, height: 100 });
    };

    describe('when EditorView calls onSave with userAuthProvider', () => {
      let userAuthProvider: any;
      beforeEach(async () => {
        await forFileToBeProcessed();
        const defaultConfig = getDefaultMediaClientConfig();
        userAuthProvider = jest.fn() as any;
        const config = {
          ...defaultConfig,
          userAuthProvider,
        };
        mediaClient = fakeMediaClient(config);
        component.setProps({
          mediaClient,
        });
        callEditorViewOnSaveWithCustomMediaClient(mediaClient);
      });

      it('should call mediaClient.file.copyFile', async () => {
        resultingFileStateObservable.next({
          status: 'processing',
          id: 'uuid1',
          mediaType: 'image',
          mimeType: 'image/gif',
          name: 'some-name',
          size: 42,
          representations: {},
        });
        await nextTick();
        expect(mediaClient.file.copyFile).toHaveBeenCalledTimes(1);
        expectFunctionToHaveBeenCalledWith(mediaClient.file.copyFile, [
          {
            id: 'uuid1',
            collection: fileIdentifier.collectionName,
            authProvider: mediaClient.config.authProvider,
          },
          {
            collection: RECENTS_COLLECTION,
            authProvider: userAuthProvider,
            occurrenceKey: expect.any(String),
          },
        ]);
      });

      it('should call onFinish after context.file.copyFile', async () => {
        resultingFileStateObservable.next({
          status: 'processing',
          id: 'uuid1',
          mediaType: 'image',
          mimeType: 'image/gif',
          name: 'some-name',
          size: 42,
          representations: {},
        });

        expect(onFinish).toHaveBeenCalledTimes(0);
        await nextTick();
        expect(mediaClient.file.copyFile).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledTimes(1);
      });
    });

    describe('when EditorView calls onSave without userAuthProvider', () => {
      beforeEach(async () => {
        await forFileToBeProcessed();
        callEditorViewOnSaveWithCustomMediaClient(mediaClient);
      });

      it('should upload a file', async () => {
        // First we touch files with client generated id
        expectFunctionToHaveBeenCalledWith(mediaClient.file.touchFiles, [
          [
            {
              fileId: expect.any(String),
              collection: fileIdentifier.collectionName,
              occurrenceKey: expect.any(String),
            },
          ],
          fileIdentifier.collectionName,
        ]);

        // Then we call upload
        expectFunctionToHaveBeenCalledWith(mediaClient.file.upload, [
          {
            content: 'some-image-content',
            name: 'some-name.png',
            collection: fileIdentifier.collectionName,
          },
          undefined,
          {
            id: expect.any(String),
            deferredUploadId: expect.anything(),
            occurrenceKey: expect.any(String),
          },
        ]);
        const actualUploadableFileUpfrontIds: UploadableFileUpfrontIds = asMock(
          mediaClient.file.upload,
        ).mock.calls[0][2];
        const actualUploadId = await actualUploadableFileUpfrontIds.deferredUploadId;
        expectToEqual(actualUploadId, 'some-upload-id');

        // In the end we exit synchronously with new identifier
        expectFunctionToHaveBeenCalledWith(onUploadStart!, [
          {
            mediaItemType: 'file',
            id: expect.any(String),
            collectionName: fileIdentifier.collectionName,
            occurrenceKey: expect.any(String),
          },
          {
            width: 200,
            height: 100,
          },
        ]);
      });

      describe('when new file is fully uploaded (processing)', () => {
        it('should call onFinish', async () => {
          resultingFileStateObservable.next({
            status: 'processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            representations: {},
          });
          await nextTick();
          expect(onFinish).toHaveBeenCalledTimes(1);
        });

        it('should emit analytics ui + track events if observable returns "processing" file state', async () => {
          resultingFileStateObservable.next({
            status: 'processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            representations: {},
          });
          await nextTick();
          expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(2);

          expect(fakeCreateAnalyticsEvent).toBeCalledWith(
            expect.objectContaining({
              eventType: 'ui',
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'saveButton',
              attributes: { annotated: false },
            }),
          );
          expect(fakeCreateAnalyticsEvent).toBeCalledWith(
            expect.objectContaining({
              eventType: 'track',
              action: 'uploaded',
              actionSubject: 'media',
              actionSubjectId: expect.any(String),
              attributes: {
                status: 'success',
                fileStatus: 'processing',
                fileMediatype: 'image',
                fileMimetype: 'image/gif',
                fileSize: 42,
                uploadDurationMsec: expect.any(Number),
                annotated: false,
              },
            }),
          );
          expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
            ANALYTICS_MEDIA_CHANNEL,
          );
        });
      });

      describe('when new file processing fails (failed-processing)', () => {
        it('should show error screen when processing-failed', async () => {
          asMock(formatMessage).mockReturnValue('Error message');
          resultingFileStateObservable.next({
            status: 'failed-processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            artifacts: [],
            representations: {},
          });
          await nextTick();
          component.update();
          expect(component.find(EditorView)).toHaveLength(0);
          expect(component.find(ErrorView)).toHaveLength(1);
          const errorViewProps = component
            .find<ErrorViewProps>(ErrorView)
            .props();
          expectToEqual(errorViewProps.message, 'Error message');
        });

        it('should show error screen when error', async () => {
          asMock(formatMessage).mockReturnValue('Error message');
          resultingFileStateObservable.next({
            status: 'error',
            id: 'uuid1',
          });
          await nextTick();
          component.update();
          expect(component.find(EditorView)).toHaveLength(0);
          expect(component.find(ErrorView)).toHaveLength(1);
          const errorViewProps = component
            .find<ErrorViewProps>(ErrorView)
            .props();
          expectToEqual(errorViewProps.message, 'Error message');
        });

        it('should close editor when error is dismissed', async () => {
          resultingFileStateObservable.next({
            status: 'failed-processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            artifacts: [],
            representations: {},
          });
          await nextTick();
          component.update();
          const errorViewProps = component
            .find<ErrorViewProps>(ErrorView)
            .props();
          errorViewProps.onCancel();
          expect(onClose).toHaveBeenCalled();
        });

        it('should emit analytics ui + track events if observable returns "failed-processing" file state', async () => {
          resultingFileStateObservable.next({
            status: 'failed-processing',
            id: 'uuid1',
            mediaType: 'image',
            mimeType: 'image/gif',
            name: 'some-name',
            size: 42,
            artifacts: [],
            representations: {},
          });
          await nextTick();
          expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(2);

          expect(fakeCreateAnalyticsEvent).toBeCalledWith(
            expect.objectContaining({
              eventType: 'ui',
              action: 'clicked',
              actionSubject: 'button',
              actionSubjectId: 'saveButton',
              attributes: { annotated: false },
            }),
          );
          expect(fakeCreateAnalyticsEvent).toBeCalledWith(
            expect.objectContaining({
              eventType: 'track',
              action: 'uploaded',
              actionSubject: 'media',
              actionSubjectId: expect.any(String),
              attributes: {
                status: 'fail',
                failReason: 'Ouch! We could not save the image',
                fileStatus: 'failed-processing',
                uploadDurationMsec: expect.any(Number),
                annotated: false,
              },
            }),
          );
          expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
            ANALYTICS_MEDIA_CHANNEL,
          );
        });
      });
    });
  });

  describe('when changes have been made and cancel is pressed', () => {
    let modalDialog: ReactWrapper<React.ComponentProps<typeof ModalDialog>>;

    beforeEach(async () => {
      await forFileToBeProcessed();
      const editorView = component.find<EditorViewProps & InjectedIntlProps>(
        EditorView,
      );
      const { onAnyEdit, onCancel } = editorView.props();
      onAnyEdit!('arrow', { lineWidth: 1, addShadow: true, color: '#ccc' });
      onCancel('button');
      component.update();
      modalDialog = component.find(ModalDialog);
    });

    it('should show confirmation dialog when user cancels', () => {
      expect(modalDialog).toHaveLength(1);
      expect(modalDialog.prop('heading')).toEqual('Unsaved changes');
    });

    it('should call onClose when first action is chosen', () => {
      const firstAction = (modalDialog.prop('actions') as any)[0];
      expect(firstAction.text).toEqual('Close anyway');
      firstAction.onClick();
      expect(onClose).toHaveBeenCalled();
    });

    it('should just close confirmation dialog and not call onClose when second action is chosen', () => {
      const secondAction = (modalDialog.prop('actions') as any)[1];
      expect(secondAction.text).toEqual('Cancel');
      secondAction.onClick();
      expect(onClose).not.toHaveBeenCalled();
      component.update();
      modalDialog = component.find(ModalDialog);
      expect(modalDialog).toHaveLength(0);
    });

    it('should emit analytics ui clicked+annotated events', async () => {
      expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(fakeCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'cancelButton',
          attributes: { annotated: true, input: 'button' },
        }),
      );
      expect(fakeCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          eventType: 'ui',
          action: 'annotated',
          actionSubject: 'annotation',
          actionSubjectId: 'arrow',
          attributes: { lineWidth: 1, addShadow: true, color: '#ccc' },
        }),
      );
      expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
        ANALYTICS_MEDIA_CHANNEL,
      );
    });
  });

  describe('when changes have been made and esc is pressed', () => {
    beforeEach(async () => {
      await forFileToBeProcessed();
      const editorView = component.find<EditorViewProps & InjectedIntlProps>(
        EditorView,
      );
      const { onAnyEdit, onCancel } = editorView.props();
      onAnyEdit!('arrow', { lineWidth: 1, addShadow: true, color: '#ccc' });
      onCancel('esc');
      component.update();
    });

    it('should emit analytics ui annotated event', async () => {
      expect(fakeCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
      expect(fakeCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'cancelButton',
          attributes: { annotated: true, input: 'esc' },
        }),
      );
      expect(fakeCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          eventType: 'ui',
          action: 'annotated',
          actionSubject: 'annotation',
          actionSubjectId: 'arrow',
          attributes: { lineWidth: 1, addShadow: true, color: '#ccc' },
        }),
      );
      expect(fakeAnalyticsEventFire).toHaveBeenLastCalledWith(
        ANALYTICS_MEDIA_CHANNEL,
      );
    });
  });

  describe('#convertFileNameToPng()', () => {
    it('should return default value if undefined', () => {
      expect(convertFileNameToPng(undefined)).toEqual('annotated-image.png');
    });

    it('should return default value if empty', () => {
      expect(convertFileNameToPng('')).toEqual('annotated-image.png');
    });

    it('should replace anything that looks like an extension with .png', () => {
      expect(convertFileNameToPng('some.image')).toEqual('some.png');
    });

    it('should replace anything that looks like an extension with .png if starts with a dot', () => {
      expect(convertFileNameToPng('.some.other.image')).toEqual(
        '.some.other.png',
      );
    });

    it('should append .png if nothing looks like an extension', () => {
      expect(convertFileNameToPng('somethingElse')).toEqual(
        'somethingElse.png',
      );
    });

    it('should append .png if nothing looks like an extension if starts with a dot', () => {
      expect(convertFileNameToPng('.some')).toEqual('.some.png');
    });

    it('should append .png if nothing looks like an extension if ends with a dot', () => {
      expect(convertFileNameToPng('.some.stuff.')).toEqual('.some.stuff.png');
    });
  });
});
