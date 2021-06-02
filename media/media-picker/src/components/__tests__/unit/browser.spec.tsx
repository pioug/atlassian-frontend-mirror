import React from 'react';
import { mount } from 'enzyme';

jest.mock('../../../service/uploadServiceImpl');
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { Browser, BrowserBase } from '../../browser/browser';
import { BrowserConfig } from '../../../types';
import Button from '@atlaskit/button';

describe('Browser', () => {
  const mediaClient = fakeMediaClient();
  const browseConfig: BrowserConfig = {
    uploadParams: { collection: 'collectionA' },
  };

  it('should add upload files when user picks some', () => {
    const browser = mount(
      <Browser mediaClient={mediaClient} config={browseConfig} />,
    );
    const instance = browser.find(BrowserBase).instance();
    const addFilesSpy = jest.spyOn((instance as any).uploadService, 'addFiles');
    browser.find('input').simulate('change');

    expect(addFilesSpy).toHaveBeenCalledTimes(1);
    expect(addFilesSpy).toBeCalledWith([]);
  });

  it('should provide a function to onBrowseFn callback property and call click function on native input element', () => {
    const onBrowseFnMock = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onBrowseFn={onBrowseFnMock}
      />,
    );
    const instance = browser.find(BrowserBase).instance();
    const clickSpy = jest.spyOn((instance as any).browserRef.current, 'click');
    expect(onBrowseFnMock).toBeCalled();
    onBrowseFnMock.mock.calls[0][0]();
    expect(clickSpy).toBeCalled();
  });

  it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
    const onCancelFnMock = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onCancelFn={onCancelFnMock}
      />,
    );
    const instance = browser.find(BrowserBase).instance();
    expect(onCancelFnMock).toBeCalled();
    onCancelFnMock.mock.calls[0][0]();
    expect((instance as any).uploadService.cancel).toBeCalled();
  });

  it('should render with children', () => {
    const browser = mount(
      <Browser mediaClient={mediaClient} config={browseConfig}>
        {(browse) => <Button onClick={browse}>Upload</Button>}
      </Browser>,
    );
    const instance = browser.find(BrowserBase).instance();
    const inputOnClick = jest.spyOn(
      (instance as any).browserRef.current,
      'click',
    );
    browser.find(Button).simulate('click');
    expect(inputOnClick).toBeCalled();
  });

  it('should call onError if invalid replaceFileId given', () => {
    const onError = jest.fn();
    mount(
      <Browser
        mediaClient={mediaClient}
        config={{
          ...browseConfig,
          replaceFileId: 'some-invalid-id',
        }}
        onError={onError}
      />,
    );
    expect(onError).toHaveBeenCalledWith({
      error: {
        description: 'Invalid replaceFileId format',
        fileId: 'some-invalid-id',
        name: 'invalid_uuid',
      },
      fileId: 'some-invalid-id',
    });
  });

  it('should emit fail event if invalid replaceFileId given', () => {
    const createAnalyticsEvent = jest.fn().mockReturnValue({ fire: jest.fn() });
    mount(
      <BrowserBase
        mediaClient={mediaClient}
        config={{
          ...browseConfig,
          replaceFileId: 'some-invalid-id',
        }}
        createAnalyticsEvent={createAnalyticsEvent}
      />,
    );
    expect(createAnalyticsEvent).toHaveBeenCalledWith({
      action: 'failed',
      actionSubject: 'mediaUpload',
      actionSubjectId: 'localMedia',
      attributes: {
        failReason: 'invalid_uuid',
        status: 'fail',
        uuid: 'some-invalid-id',
      },
      eventType: 'operational',
    });
  });

  it('should force multiple to false if replaceFileId passed', () => {
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={{
          ...browseConfig,
          multiple: true,
          replaceFileId: 'some-file-id',
        }}
      />,
    );
    expect(browser.find('input').prop('multiple')).toBeFalsy();
  });

  it('should add single upload file when user picks some passing replaceFileId', () => {
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={{
          ...browseConfig,
          replaceFileId: 'some-file-id',
        }}
      />,
    );
    const instance = browser.find(BrowserBase).instance();
    const addFileSpy = jest.spyOn((instance as any).uploadService, 'addFile');
    browser.find('input').simulate('change');

    expect(addFileSpy).toHaveBeenCalledTimes(1);
    expect(addFileSpy).toBeCalledWith(undefined, 'some-file-id');
  });

  it('should use latest UploadParams during upload', () => {
    const onBrowseFnMock = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onBrowseFn={onBrowseFnMock}
      />,
    );

    const newBrowseConfig: BrowserConfig = {
      uploadParams: { collection: 'collectionB' },
    };

    browser.setProps({ config: newBrowseConfig });

    const instance = browser.find(BrowserBase).instance();
    const setUploadParamsSpy = jest.spyOn(
      (instance as any).uploadService,
      'setUploadParams',
    );
    browser.find('input').simulate('change');

    expect(setUploadParamsSpy).toHaveBeenCalledTimes(1);
    expect(setUploadParamsSpy).toBeCalledWith(newBrowseConfig.uploadParams);
  });
});
