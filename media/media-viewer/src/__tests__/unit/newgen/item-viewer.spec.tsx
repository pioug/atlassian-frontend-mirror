import * as mocks from './item-viewer.mock';

import React from 'react';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button/custom-theme-button';
import {
  ProcessedFileState,
  FileIdentifier,
  FileState,
  Identifier,
  MediaClient,
  MediaType,
  createFileStateSubject,
} from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  fakeMediaClient,
  asMock,
  nextTick,
} from '@atlaskit/media-test-helpers';
import {
  ItemViewer,
  ItemViewerBase,
  Props as ItemViewerBaseProps,
  State as ItemViewerBaseState,
} from '../../../newgen/item-viewer';
import { ErrorMessage } from '../../../newgen/error';
import { ImageViewer } from '../../../newgen/viewers/image';
import {
  VideoViewer,
  Props as VideoViewerProps,
} from '../../../newgen/viewers/video';
import {
  AudioViewer,
  Props as AudioViewerProps,
} from '../../../newgen/viewers/audio';
import { DocViewer } from '../../../newgen/viewers/doc';
import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { InteractiveImg } from '../../../newgen/viewers/image/interactive-img';
import ArchiveViewerLoader from '../../../newgen/viewers/archiveSidebar/archiveViewerLoader';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import { CodeViewer } from '../../../newgen/viewers/codeViewer';

const identifier: Identifier = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
  collectionName: 'some-collection',
};
const externalImageIdentifier: Identifier = {
  mediaItemType: 'external-image',
  dataURI: 'some-src',
  name: 'some-name',
};

const makeFakeMediaClient = (observable: ReplaySubject<any>) => {
  const mediaClient = fakeMediaClient();

  asMock(mediaClient.file.getFileState).mockReturnValue(observable);
  return mediaClient;
};

function mountComponent(
  mediaClient: MediaClient,
  identifier: Identifier,
  featureFlags?: MediaFeatureFlags,
) {
  const el = mountWithIntlContext(
    <ItemViewer
      previewCount={0}
      mediaClient={mediaClient}
      identifier={identifier}
      featureFlags={featureFlags}
    />,
  );
  const instance = el.find(ItemViewerBase).instance() as any;
  return { el, instance };
}

function mountBaseComponent(
  mediaClient: MediaClient,
  identifier: FileIdentifier,
  props?: Partial<AudioViewerProps | VideoViewerProps>,
) {
  const createAnalyticsEventSpy = jest.fn();
  createAnalyticsEventSpy.mockReturnValue({ fire: jest.fn() });
  const el = mountWithIntlContext<ItemViewerBaseProps, ItemViewerBaseState>(
    <ItemViewerBase
      createAnalyticsEvent={createAnalyticsEventSpy}
      previewCount={0}
      mediaClient={mediaClient}
      identifier={identifier}
      {...props}
    />,
  );
  const instance = el.instance() as ItemViewerBase;
  return { el, instance, createAnalyticsEventSpy };
}

describe('<ItemViewer />', () => {
  beforeEach(() => {
    mocks.setViewerPayload({ status: 'success' });
  });

  it('shows an indicator while loading', () => {
    const mediaClient = makeFakeMediaClient(createFileStateSubject());
    const { el } = mountComponent(mediaClient, identifier);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows a generic error on unkown error', () => {
    const subject = createFileStateSubject();
    subject.error('something bad happened!');
    const mediaClient = makeFakeMediaClient(subject);
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain('Something went wrong');
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('should show the image viewer if media type is image', () => {
    const defaultFileState: FileState = {
      status: 'processed',
      id: identifier.id,
      name: 'file-name',
      size: 10,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'image/png',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(
      createFileStateSubject(defaultFileState),
    );
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(ImageViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(ImageViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should should error and download button if processing Status failed', () => {
    const subject = createFileStateSubject({ status: 'error', id: 'some-id' });
    const mediaClient = makeFakeMediaClient(subject);
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We couldn't generate a preview for this file.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should should error and download button if file is processing failed', () => {
    const defaultFileState: FileState = {
      status: 'failed-processing',
      id: '123',
      name: 'file-name',
      size: 10,
      artifacts: {},
      mediaType: 'video',
      mimeType: 'image/png',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(
      createFileStateSubject(defaultFileState),
    );
    const el = mountWithIntlContext(
      <ItemViewer
        previewCount={0}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `Something went wrong.It might just be a hiccup.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should should error and download button if file is in error state', () => {
    const defaultFileState: FileState = {
      id: '123',
      status: 'error',
    };
    const mediaClient = makeFakeMediaClient(
      createFileStateSubject(defaultFileState),
    );
    const el = mountWithIntlContext(
      <ItemViewer
        previewCount={0}
        mediaClient={mediaClient}
        identifier={identifier}
      />,
    );
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We couldn't generate a preview for this file.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('should show the video viewer if media type is video', () => {
    const state: ProcessedFileState = {
      id: identifier.id,
      mediaType: 'video',
      status: 'processed',
      mimeType: '',
      name: '',
      size: 1,
      artifacts: {},
      representations: {},
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(VideoViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(VideoViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the audio viewer if media type is audio', () => {
    const state: ProcessedFileState = {
      id: identifier.id,
      mediaType: 'audio',
      status: 'processed',
      mimeType: '',
      name: '',
      size: 1,
      artifacts: {},
      representations: {},
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(AudioViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(AudioViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should show the document viewer if media type is document', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'doc',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(el.find(DocViewer)).toHaveLength(1);
    // MSW:720 - passes the collectionName along
    expect(el.find(DocViewer).prop('collectionName')).toEqual(
      identifier.collectionName,
    );
  });

  it('should load archiveViewerLoader if media type is archive and FF is on', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'archive',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier, {
      zipPreviews: true,
    });
    el.update();
    expect(el.find(ArchiveViewerLoader)).toHaveLength(1);
  });

  it('should not load archiveViewerLoader if media type is archive but FF is off', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'archive',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier, {
      zipPreviews: false,
    });
    el.update();
    expect(el.find(ArchiveViewerLoader)).toHaveLength(0);
  });

  it('should should error and download button if file is unsupported', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'unknown',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      `We can't preview this file type.Try downloading the file to view it.Download`,
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
  });

  it('MSW-720: passes the collectionName to getFileState', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'image',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, identifier);
    el.update();
    expect(mediaClient.file.getFileState).toHaveBeenCalledWith('some-id', {
      collectionName: 'some-collection',
    });
  });

  it('should render InteractiveImg for external image identifier', () => {
    const state: FileState = {
      id: identifier.id,
      mediaType: 'image',
      status: 'processed',
      artifacts: {},
      name: '',
      size: 10,
      mimeType: '',
      representations: { image: {} },
    };
    const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
    const { el } = mountComponent(mediaClient, externalImageIdentifier);
    el.update();

    expect(el.find(InteractiveImg)).toHaveLength(1);
    expect(el.find(InteractiveImg).prop('src')).toEqual('some-src');
  });

  describe('Subscription', () => {
    it('unsubscribes from the provider when unmounted', () => {
      const state: FileState = {
        id: '123',
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 10,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
      const release = jest.fn();
      const { el, instance } = mountComponent(mediaClient, identifier);
      instance.release = release;
      expect(instance.release).toHaveBeenCalledTimes(0);
      el.unmount();
      expect(instance.release).toHaveBeenCalledTimes(1);
    });

    it('resubscribes to the provider when the data property value is changed', () => {
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const identifierCopy = { ...identifier };
      const { el } = mountComponent(mediaClient, identifier);
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

      // if the values stay the same, we will not resubscribe
      el.setProps({ mediaClient, identifier: identifierCopy });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(1);

      // ... but if the identifier change we will resubscribe
      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };
      el.setProps({ mediaClient, identifier: identifier2 });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);

      // if the mediaClient changes, we will also resubscribe
      const newMediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );

      el.setProps({ mediaClient: newMediaClient, identifier: identifier2 });
      expect(mediaClient.file.getFileState).toHaveBeenCalledTimes(2);
      expect(newMediaClient.file.getFileState).toHaveBeenCalledTimes(1);
    });

    it('should return to PENDING state when resets', () => {
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: '123',
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { el, instance } = mountBaseComponent(mediaClient, identifier);
      expect(instance.state.item.status).toEqual('SUCCESSFUL');

      const identifier2 = {
        ...identifier,
        id: 'some-other-id',
      };

      // since the test is executed synchronously
      // let's prevent the second call to getFile from immediately resolving and
      // updating the state to SUCCESSFUL before we run the assertion.
      mediaClient.file.getFileState = () => createFileStateSubject();
      el.setProps({ mediaClient, identifier: identifier2 });
      el.update();

      expect(instance.state.item.status).toEqual('PENDING');
    });
  });

  describe('Analytics', () => {
    const analyticsBaseAttributes = {
      componentName: 'media-viewer',
      packageName,
      packageVersion,
    };

    it('should trigger analytics when the preview commences', () => {
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: identifier.id,
          mediaType: 'unknown',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        mediaClient,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'commenced',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          fileId: 'some-id',
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when metadata fetching ended with an error', () => {
      const subject = createFileStateSubject();
      subject.error('something bad happened!');
      const mediaClient = makeFakeMediaClient(subject);
      const { createAnalyticsEventSpy } = mountBaseComponent(
        mediaClient,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledTimes(2);
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'commenced',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          fileId: 'some-id',
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'loadFailed',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          failReason: 'Metadata fetching failed',
          fileId: 'some-id',
          status: 'fail',
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when viewer returned an error', () => {
      mocks.setViewerPayload({
        status: 'error',
        errorMessage: 'Image viewer failed :(',
      });
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: identifier.id,
          mediaType: 'image',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        mediaClient,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'loadFailed',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          failReason: 'Image viewer failed :(',
          fileId: 'some-id',
          fileMediatype: 'image',
          fileSize: 10,
          fileMimetype: '',
          status: 'fail',
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when viewer is successful', () => {
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: identifier.id,
          mediaType: 'image',
          status: 'processed',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { createAnalyticsEventSpy } = mountBaseComponent(
        mediaClient,
        identifier,
      );
      expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
        action: 'loadSucceeded',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          fileId: 'some-id',
          fileMediatype: 'image',
          fileSize: 10,
          fileMimetype: '',
          status: 'success',
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
    });

    it('should trigger analytics when file failed processing', () => {
      const mediaClient = makeFakeMediaClient(
        createFileStateSubject({
          id: identifier.id,
          mediaType: 'image',
          status: 'failed-processing',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        }),
      );
      const { el } = mountBaseComponent(mediaClient, identifier);

      expect(el.find('ErrorMessage').prop('error')).toEqual({
        errorName: 'failedProcessing',
        fileState: {
          id: 'some-id',
          mediaType: 'image',
          status: 'failed-processing',
          artifacts: {},
          name: '',
          size: 10,
          mimeType: '',
          representations: { image: {} },
        },
        innerError: undefined,
      });
    });

    it('should trigger error analytics if DocumentViewer fails', async () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'doc',
        status: 'processed',
        artifacts: {},
        name: '',
        size: 0,
        mimeType: '',
        representations: { image: {} },
      };
      const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
      const { el, createAnalyticsEventSpy } = mountBaseComponent(
        mediaClient,
        identifier,
      );
      el.update();
      expect(el.find(DocViewer)).toHaveLength(1);

      el.find(DocViewer).simulate('error');
      await nextTick();
      expect(createAnalyticsEventSpy).toHaveBeenCalledTimes(2);
      expect(createAnalyticsEventSpy).toHaveBeenLastCalledWith({
        action: 'loadFailed',
        actionSubject: 'mediaFile',
        actionSubjectId: 'some-id',
        attributes: {
          fileId: 'some-id',
          fileMediatype: 'doc',
          fileMimetype: '',
          fileSize: 0,
          status: 'fail',
          failReason: expect.any(String),
          ...analyticsBaseAttributes,
        },
        eventType: 'operational',
      });
    });

    test.each(['audio', 'video'])(
      'should trigger analytics when %s can play',
      type => {
        const state: ProcessedFileState = {
          id: identifier.id,
          // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
          //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
          mediaType: type,
          status: 'processed',
          mimeType: '',
          name: '',
          size: 1,
          artifacts: {},
          representations: {},
        };
        const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
        const onCanPlaySpy = jest.fn();
        const { el, createAnalyticsEventSpy } = mountBaseComponent(
          mediaClient,
          identifier,
          { onCanPlay: onCanPlaySpy },
        );
        const Viewer = el.find(type === 'audio' ? AudioViewer : VideoViewer);
        const onCanPlay: () => void = Viewer.prop('onCanPlay')!;
        onCanPlay();
        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          action: 'loadSucceeded',
          actionSubject: 'mediaFile',
          actionSubjectId: 'some-id',
          attributes: {
            fileId: 'some-id',
            fileMediatype: type,
            fileMimetype: '',
            fileSize: 1,
            status: 'success',
            ...analyticsBaseAttributes,
          },
          eventType: 'operational',
        });
      },
    );

    test.each<[MediaType, MediaType]>([['audio', 'video']])(
      'should trigger analytics when %s errors',
      type => {
        const state: ProcessedFileState = {
          id: identifier.id,
          mediaType: type,
          status: 'processed',
          mimeType: '',
          name: '',
          size: 1,
          artifacts: {},
          representations: {},
        };
        const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
        const onErrorSpy = jest.fn();
        const { el, createAnalyticsEventSpy } = mountBaseComponent(
          mediaClient,
          identifier,
          { onError: onErrorSpy },
        );
        const Viewer = el.find(type === 'audio' ? AudioViewer : VideoViewer);
        const onError: () => void = Viewer.prop('onError')!;
        onError();
        expect(createAnalyticsEventSpy).toHaveBeenCalledWith({
          action: 'loadFailed',
          actionSubject: 'mediaFile',
          actionSubjectId: 'some-id',
          attributes: {
            failReason: 'Playback failed',
            fileId: 'some-id',
            fileMediatype: type,
            fileMimetype: '',
            fileSize: 1,
            status: 'fail',
            ...analyticsBaseAttributes,
          },
          eventType: 'operational',
        });
      },
    );
  });

  describe('CodeViewer', () => {
    // should only show codeviewer if (1) FF for codeviewer is on (2) It's a code-viewable item
    it('should load codeViewer if the file is code type AND the FF for codeViewer is on', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.c',
        size: 10,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
      const { el } = mountComponent(mediaClient, identifier, {
        codeViewer: true,
      });
      el.update();
      expect(el.find(CodeViewer)).toHaveLength(1);
    });

    it('should not load codeViewer if codeViewer FF is off even IF the file is a code type', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.c',
        size: 10,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
      const { el } = mountComponent(mediaClient, identifier, {
        codeViewer: false,
      });
      el.update();
      expect(el.find(CodeViewer)).toHaveLength(0);
    });

    it('should not load codeViewer if the file is not a code type and the FF for codeViewer is on', () => {
      const state: FileState = {
        id: identifier.id,
        mediaType: 'unknown',
        status: 'processed',
        artifacts: {},
        name: 'file.pdf',
        size: 10,
        mimeType: '',
      };
      const mediaClient = makeFakeMediaClient(createFileStateSubject(state));
      const { el } = mountComponent(mediaClient, identifier, {
        codeViewer: true,
      });
      el.update();
      expect(el.find(CodeViewer)).toHaveLength(0);
    });
  });
});
