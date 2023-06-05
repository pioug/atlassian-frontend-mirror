import React from 'react';
import { mount } from 'enzyme';

import { fakeMediaClient, flushPromises } from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import {
  RequestError,
  TouchFileDescriptor,
  createMediaSubject,
  fromObservable,
} from '@atlaskit/media-client';
import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
} from '@atlaskit/media-common';

import { Browser } from '../../browser/browser';
import { BrowserConfig } from '../../../../src/types';
import { LocalUploadConfig } from '../../../../src/components/types';
import * as ufoWrapper from '../../../util/ufoExperiences';

describe('Browser analytics instrumentation', () => {
  const browseConfig: BrowserConfig & LocalUploadConfig = {
    uploadParams: {},
  };
  const someFeatureFlags: MediaFeatureFlags = {
    folderUploads: true,
  };
  const uploadId = 'upload id';
  let oldDateNow: () => number;

  const mockstartMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'startMediaUploadUfoExperience',
  );

  const mocksucceedMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'succeedMediaUploadUfoExperience',
  );

  const mockfailMediaUploadUfoExperience = jest.spyOn(
    ufoWrapper,
    'failMediaUploadUfoExperience',
  );

  const mediaClient = fakeMediaClient();
  let fileStateObservable = createMediaSubject();
  mediaClient.file.upload = jest.fn(() => {
    return fromObservable(fileStateObservable);
  });

  beforeEach(() => {
    oldDateNow = Date.now;
    Date.now = () => 111;
    jest.clearAllMocks();
    fileStateObservable = createMediaSubject();
  });

  afterEach(() => {
    Date.now = oldDateNow;
  });

  it('should fire a commenced event on uploadsStart', async () => {
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
          rejected: [],
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await flushPromises();

    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
    expect(mockstartMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      'browser',
    );
  });

  it('should fire an uploaded success event on end', async () => {
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
          rejected: [],
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await flushPromises();

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    fileStateObservable.next({
      id: 'file id',
      mediaType: 'doc',
      name: '',
      mimeType: 'text/plain',
      size: 13,
      status: 'processing',
    });

    expect(onEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'success',
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            uploadDurationMsec: expect.any(Number),
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        fileId: expect.any(String),
        fileSize: 13,
        fileMimetype: 'text/plain',
      },
    );
  });

  it('should fire an uploaded fail event on end', async () => {
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) =>
        Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
          rejected: [],
        }),
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await flushPromises();

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    fileStateObservable.error(
      new RequestError('serverBadGateway', {
        method: 'GET',
        endpoint: '/some-endpoint',
        mediaRegion: 'some-region',
        mediaEnv: 'some-env',
      }),
    );

    expect(onEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'failed',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'fail',
            failReason: 'upload_fail',
            error: 'serverBadGateway',
            request: {
              method: 'GET',
              endpoint: '/some-endpoint',
              mediaRegion: 'some-region',
              mediaEnv: 'some-env',
            },
            sourceType: 'local',
            serviceName: 'upload',
            fileAttributes: {
              fileId: expect.any(String),
            },
            uploadDurationMsec: expect.any(Number),
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockfailMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        failReason: 'upload_fail',
        error: 'serverBadGateway',
        request: {
          method: 'GET',
          endpoint: '/some-endpoint',
          mediaRegion: 'some-region',
          mediaEnv: 'some-env',
        },
        fileAttributes: {
          fileId: expect.any(String),
        },
        uploadDurationMsec: expect.any(Number),
      },
    );
  });

  it('should populate upload duration time', async () => {
    mediaClient.file.touchFiles = jest.fn(
      async (descriptors: TouchFileDescriptor[], collection?: string) => {
        return Promise.resolve({
          created: descriptors.map(({ fileId }) => ({
            fileId,
            uploadId,
          })),
          rejected: [],
        });
      },
    );
    const onEvent = jest.fn();
    const browser = mount(
      <AnalyticsListener onEvent={onEvent} channel={ANALYTICS_MEDIA_CHANNEL}>
        <Browser
          mediaClient={mediaClient}
          config={browseConfig}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    await flushPromises();

    expect(onEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'commenced',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );

    fileStateObservable.next({
      id: '123',
      mediaType: 'doc',
      name: '',
      mimeType: 'text/plain',
      size: 13,
      status: 'processing',
    });

    expect(onEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        context: [
          {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            componentName: 'browser',
            component: 'browser',
            [MEDIA_CONTEXT]: {
              featureFlags: expect.objectContaining(someFeatureFlags),
            },
          },
        ],
        payload: {
          eventType: 'operational',
          action: 'succeeded',
          actionSubject: 'mediaUpload',
          actionSubjectId: 'localMedia',
          attributes: {
            status: 'success',
            sourceType: 'local',
            fileAttributes: {
              fileId: expect.any(String),
              fileMimetype: 'text/plain',
              fileSize: 13,
            },
            serviceName: 'upload',
            uploadDurationMsec: expect.any(Number),
            traceContext: { traceId: expect.any(String) },
          },
        },
      }),
      ANALYTICS_MEDIA_CHANNEL,
    );
    expect(mockstartMediaUploadUfoExperience).toBeCalledTimes(1);
    expect(mocksucceedMediaUploadUfoExperience).toBeCalledWith(
      expect.any(String),
      {
        fileId: expect.any(String),
        fileSize: 13,
        fileMimetype: 'text/plain',
      },
    );
  });
});
