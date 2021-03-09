import React from 'react';

jest.mock('../../../service/uploadServiceImpl');

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MEDIA_CONTEXT } from '@atlaskit/analytics-namespaced-context/MediaAnalyticsContext';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import {
  ClipboardMockFile,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { LocalFileSource } from '../../../service/types';
import { Clipboard, ClipboardBase } from '../../clipboard/clipboard';
import { ClipboardConfig } from '../../../types';
import { mount } from 'enzyme';

describe('Clipboard', () => {
  const mediaClient = fakeMediaClient();
  let eventsMap: Record<string, Function>;

  const someFeatureFlags: MediaFeatureFlags = {
    folderUploads: true,
    newCardExperience: false,
  };

  const config: ClipboardConfig = {
    uploadParams: {},
    featureFlags: someFeatureFlags,
  };

  beforeEach(() => {
    eventsMap = {};

    jest
      .spyOn(document, 'addEventListener')
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      .mockImplementation((event, cb) => (eventsMap[event] = cb));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with a single file', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const event: any = {
      clipboardData: {
        files: [new ClipboardMockFile()],
        types: [],
      },
    };

    // simulate paste event on document object
    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT call this.uploadService.addFilesWithSource() when a paste event is dispatched without a file', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const event: any = {
      clipboardData: {
        files: [],
        types: [],
      },
    };

    // simulate paste event on document object
    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).not.toHaveBeenCalled();
  });

  it('should call this.uploadService.addFilesWithSource() when a paste event is dispatched with multiple files', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const mockFile1 = new ClipboardMockFile();
    const mockFile2 = new ClipboardMockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile1, mockFile2],
        types: [],
      },
    };

    // simulate paste event on document object
    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].file,
    ).toEqual(mockFile1);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*2nd item*/[1].file,
    ).toEqual(mockFile2);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].source,
    ).toEqual(LocalFileSource.PastedFile);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*2nd item*/[1].source,
    ).toEqual(LocalFileSource.PastedFile);
  });

  it('should not trigger errors when event.clipboardData is undefined', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const event: any = {};
    // simulate paste event on document object
    eventsMap.paste(event);
    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(0);
  });

  it('should detect pasted screenshots from clipboard event data', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const mockFile = new ClipboardMockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile],
        types: ['some-type'],
      },
    };
    // simulate paste event on document object
    eventsMap.paste(event);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].file,
    ).toEqual(mockFile);
    expect(
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      addFilesWithSourceSpy.mock
        .calls /*1st call*/[0] /*1st arg*/[0] /*1st item*/[0].source,
    ).toEqual(LocalFileSource.PastedScreenshot);
  });

  it('should remove event handler only when there are no more clipboard instances left', () => {
    const clipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );
    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const mockFile = new ClipboardMockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile],
        types: [],
      },
    };

    const anotherClipboard = mount(
      <Clipboard mediaClient={mediaClient} config={config} />,
    );

    const anotherClipboardInstance = anotherClipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const anotherAddFilesWithSourceSpy = jest.spyOn(
      (anotherClipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    // simulate paste event on document object
    eventsMap.paste(event);

    // first clipboard event handler is not called because we only call the last subscriber
    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(0);
    // second clipboard event handler is called as expected
    expect(anotherAddFilesWithSourceSpy).toHaveBeenCalledTimes(1);

    // we unmount second clipboard in order to make the first one "active"
    anotherClipboard.unmount();

    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
  });

  it('should fire Analytics Event on files picked', () => {
    const analyticsHandler = jest.fn();

    const clipboard = mount(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsHandler}
      >
        <Clipboard
          mediaClient={mediaClient}
          config={config}
          featureFlags={someFeatureFlags}
        />
      </AnalyticsListener>,
    );

    const clipboardInstance = clipboard
      .find(ClipboardBase)
      .instance() as ClipboardBase;

    const addFilesWithSourceSpy = jest.spyOn(
      (clipboardInstance as any).uploadService,
      'addFilesWithSource',
    );

    const mockFile1 = new ClipboardMockFile();
    const mockFile2 = new ClipboardMockFile();

    const event: any = {
      clipboardData: {
        files: [mockFile1, mockFile2],
        types: [],
      },
    };

    // simulate paste event on document object
    eventsMap.paste(event);

    expect(addFilesWithSourceSpy).toHaveBeenCalledTimes(1);
    expect(analyticsHandler).toHaveBeenCalledTimes(1);
    expect(analyticsHandler).toBeCalledWith(
      expect.objectContaining({
        context: [
          {
            packageName: '@atlaskit/media-picker',
            packageVersion: '999.9.9',
            componentName: 'clipboard',
            component: 'clipboard',
            [MEDIA_CONTEXT]: {
              featureFlags: someFeatureFlags,
            },
          },
        ],
        payload: {
          eventType: 'ui',
          action: 'pasted',
          actionSubject: 'clipboard',
          attributes: {
            fileCount: 2,
            fileAttributes: expect.arrayContaining([
              {
                fileMimetype: '',
                fileSize: 0,
                fileSource: 'pastedFile',
              },
              {
                fileMimetype: '',
                fileSize: 0,
                fileSource: 'pastedFile',
              },
            ]),
          },
        },
      }),
      FabricChannel.media,
    );
  });
});
