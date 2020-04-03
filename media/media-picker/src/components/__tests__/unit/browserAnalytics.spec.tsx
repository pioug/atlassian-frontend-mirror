import React from 'react';
import { mount } from 'enzyme';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FileState, TouchFileDescriptor } from '@atlaskit/media-client';

import { Browser } from '../../browser/browser';
import { BrowserConfig } from '../../../../src/types';
import { ANALYTICS_MEDIA_CHANNEL } from '../../../../src/components/media-picker-analytics-error-boundary';
import { LocalUploadConfig } from '../../../../src/components/types';

describe('Browser analytics instrumentation', () => {
  const browseConfig: BrowserConfig & LocalUploadConfig = {
    uploadParams: {},
  };
  const uploadId = 'upload id';
  let oldDateNow: () => number;
  beforeEach(() => {
    oldDateNow = Date.now;
    Date.now = () => 111;
  });

  afterEach(() => {
    Date.now = oldDateNow;
  });

  it('should fire a commenced event on uploadsStart', () => {
    const mediaClient = fakeMediaClient();
    mediaClient.file.upload = jest.fn().mockReturnValue(new ReplaySubject(1));
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser mediaClient={mediaClient} config={browseConfig} />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          {
            attributes: {
              componentName: 'browser',
              packageName: '@atlaskit/media-picker',
              packageVersion: '999.9.9',
            },
          },
        ],
        payload: {
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            packageName: '@atlaskit/media-picker',
          },
          eventType: 'operational',
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it('should fire an uploaded success event on end', () => {
    const mediaClient = fakeMediaClient();
    const fileStateObservable = new ReplaySubject<FileState>(1);
    fileStateObservable.next({
      id: 'file id',
      mediaType: 'doc',
      name: '',
      mimeType: 'text/plain',
      size: 13,
      status: 'processing',
    });
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser mediaClient={mediaClient} config={browseConfig} />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          {
            attributes: {
              componentName: 'browser',
              packageName: '@atlaskit/media-picker',
              packageVersion: '999.9.9',
            },
          },
        ],
        payload: {
          action: 'uploaded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            packageName: '@atlaskit/media-picker',
            status: 'success',
            uploadDurationMsec: -1,
          },
          eventType: 'track',
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it('should fire an uploaded fail event on end', () => {
    const mediaClient = fakeMediaClient();
    const fileStateObservable = new ReplaySubject<FileState>(1);
    fileStateObservable.error(new Error('oops'));
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser mediaClient={mediaClient} config={browseConfig} />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          {
            attributes: {
              componentName: 'browser',
              packageName: '@atlaskit/media-picker',
              packageVersion: '999.9.9',
            },
          },
        ],
        payload: {
          action: 'uploaded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            packageName: '@atlaskit/media-picker',
            status: 'fail',
            failReason: 'oops',
            uploadDurationMsec: -1,
          },
          eventType: 'track',
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });

  it('should populate upload duration time', async () => {
    const mediaClient = fakeMediaClient();

    const fileStateObservable = new ReplaySubject<FileState>(1);
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      async (descriptors: TouchFileDescriptor[], collection?: string) => {
        await nextTick(); // wait here so upload-start emitted before we go into upload
        fileStateObservable.next({
          id: descriptors[0].fileId,
          mediaType: 'doc',
          name: '',
          mimeType: 'text/plain',
          size: 13,
          status: 'processing',
        });
        return Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
        });
      },
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser mediaClient={mediaClient} config={browseConfig} />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await nextTick(); // waiting here for whole upload logic to finish and fire upload-end

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            attributes: {
              componentName: 'browser',
              packageName: '@atlaskit/media-picker',
              packageVersion: '999.9.9',
            },
          },
        ],
        payload: {
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            packageName: '@atlaskit/media-picker',
          },
          eventType: 'operational',
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    expect(onEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        context: [
          {
            attributes: {
              componentName: 'browser',
              packageName: '@atlaskit/media-picker',
              packageVersion: '999.9.9',
            },
          },
        ],
        payload: {
          action: 'uploaded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            packageName: '@atlaskit/media-picker',
            status: 'success',
            uploadDurationMsec: 0,
          },
          eventType: 'track',
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
  });
});
