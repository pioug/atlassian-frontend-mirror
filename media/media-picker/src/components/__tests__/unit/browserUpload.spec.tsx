import React from 'react';
import { mount } from 'enzyme';

import {
  expectFunctionToHaveBeenCalledWith,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { Browser } from '../../browser/browser';
import { TouchFileDescriptor, FileState } from '@atlaskit/media-client';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LocalUploadConfig } from '../../types';
import { BrowserConfig, UploadErrorEventPayload } from '../../../types';

describe('Browser upload phases', () => {
  const browseConfig: BrowserConfig & LocalUploadConfig = {
    uploadParams: {},
  };
  const uploadId = 'upload id';
  const uuidRegexMatcher = expect.stringMatching(
    /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/,
  );
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
    const onUploadsStart = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onUploadsStart={onUploadsStart}
      />,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onUploadsStart).toHaveBeenCalledWith({
      files: [
        {
          creationDate: Date.now(),
          id: uuidRegexMatcher,
          name: undefined,
          occurrenceKey: uuidRegexMatcher,
          size: 13,
          type: 'text/plain',
        },
      ],
    });
  });

  it('should fire an uploaded success event on end', () => {
    const mediaClient = fakeMediaClient();
    const fileStateObservable = new ReplaySubject<FileState>(1);
    mediaClient.file.upload = jest.fn().mockReturnValue(fileStateObservable);
    mediaClient.file.touchFiles = jest.fn(
      (descriptors: TouchFileDescriptor[], collection?: string) => {
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
    const onEnd = jest.fn();
    const browser = mount(
      <Browser mediaClient={mediaClient} config={browseConfig} onEnd={onEnd} />,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expect(onEnd).toHaveBeenCalledWith({
      file: {
        creationDate: Date.now(),
        id: uuidRegexMatcher,
        name: undefined,
        occurrenceKey: uuidRegexMatcher,
        size: 13,
        type: 'text/plain',
      },
    });
  });

  it('should fire an uploaded fail event on end', () => {
    const mediaClient = fakeMediaClient();
    const error = new Error('oops');
    const fileStateObservable = new ReplaySubject<FileState>(1);
    fileStateObservable.error(error);
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
    const onError: jest.MockedFunction<(
      payload: UploadErrorEventPayload,
    ) => void> = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onError={onError}
      />,
    );
    const fileContents = 'file contents';
    const file = new Blob([fileContents], { type: 'text/plain' });

    browser.find('input').simulate('change', { target: { files: [file] } });

    expectFunctionToHaveBeenCalledWith(onError, [
      {
        error: {
          description: 'oops',
          fileId: uuidRegexMatcher,
          name: 'upload_fail',
          rawError: error,
        },
        fileId: uuidRegexMatcher,
      },
    ]);
  });
});
