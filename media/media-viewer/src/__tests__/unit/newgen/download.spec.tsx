import { mount } from 'enzyme';
import { ErrorFileState, ProcessingFailedState } from '@atlaskit/media-client';
import {
  createItemDownloader,
  ToolbarDownloadButton,
  ErrorViewDownloadButton,
  DownloadButton,
} from '../../../newgen/download';
import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MediaViewerError } from '../../../newgen/error';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

describe('download', () => {
  const processingFailedState: ProcessingFailedState = {
    status: 'failed-processing',
    id: 'some-id',
    name: 'some-name',
    size: 42,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'some-mime-type',
    representations: {},
  };

  const errorState: ErrorFileState = {
    status: 'error',
    id: 'some-id',
  };

  describe('createItemDownloader', () => {
    it('should take name from file provided', () => {
      const mediaClient = fakeMediaClient();
      createItemDownloader(processingFailedState, mediaClient)();
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
        'some-id',
        'some-name',
        undefined,
      );
    });

    it('should not try to take name from errored file provided', () => {
      const mediaClient = fakeMediaClient();
      createItemDownloader(errorState, mediaClient)();
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
        'some-id',
        undefined,
        undefined,
      );
    });

    it('should pass collection name', () => {
      const mediaClient = fakeMediaClient();
      createItemDownloader(
        processingFailedState,
        mediaClient,
        'some-collection-name',
      )();
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
        'some-id',
        'some-name',
        'some-collection-name',
      );
    });
  });

  describe('ErrorViewDownloadButton', () => {
    it('should trigger an analytics event in the media channel', () => {
      const mediaClient = fakeMediaClient();
      const spy = jest.fn();
      const err = new MediaViewerError('metadataFailed');
      const component = mount(
        <AnalyticsListener channel="media" onEvent={spy}>
          <ErrorViewDownloadButton
            state={processingFailedState}
            err={err}
            mediaClient={mediaClient}
          />
        </AnalyticsListener>,
      );
      component.find(DownloadButton).simulate('click');
      const [[{ payload }]] = spy.mock.calls;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(payload).toEqual({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'failedPreviewDownloadButton',
        attributes: {
          componentName: 'media-viewer',
          fileId: 'some-id',
          failReason: 'metadataFailed',
          fileMediatype: 'image',
          fileMimetype: 'some-mime-type',
          fileProcessingStatus: 'failed-processing',
          fileSize: 42,
          fileSupported: true,
          packageName,
          packageVersion,
        },
        eventType: 'ui',
      });
    });
  });

  describe('ToolbarDownloadButton', () => {
    it('should download binary when toolbar button is clicked', () => {
      const mediaClient = fakeMediaClient();
      const component = mount(
        <ToolbarDownloadButton
          state={processingFailedState}
          identifier={{
            id: 'my-id',
            mediaItemType: 'file',
            occurrenceKey: 'my-occurrenceKey',
            collectionName: 'some-collection-name',
          }}
          mediaClient={mediaClient}
        />,
      );
      component.find(DownloadButton).simulate('click');
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledWith(
        'some-id',
        'some-name',
        'some-collection-name',
      );
    });
  });

  it('should trigger an analytics event in the media channel', () => {
    const mediaClient = fakeMediaClient();
    const spy = jest.fn();
    const component = mount(
      <AnalyticsListener channel="media" onEvent={spy}>
        <ToolbarDownloadButton
          state={processingFailedState}
          identifier={{
            id: 'my-id',
            mediaItemType: 'file',
            occurrenceKey: 'my-occurrenceKey',
            collectionName: 'some-collection-name',
          }}
          mediaClient={mediaClient}
        />
      </AnalyticsListener>,
    );
    component.find(DownloadButton).simulate('click');
    const [[{ payload }]] = spy.mock.calls;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(payload).toEqual({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'downloadButton',
      attributes: {
        componentName: 'media-viewer',
        fileId: 'some-id',
        fileMediatype: 'image',
        fileMimetype: 'some-mime-type',
        fileProcessingStatus: 'failed-processing',
        fileSize: 42,
        fileSupported: true,
        packageName,
        packageVersion,
      },
      eventType: 'ui',
    });
  });
});
