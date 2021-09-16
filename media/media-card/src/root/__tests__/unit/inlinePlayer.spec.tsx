jest.mock('@atlaskit/media-ui', () => {
  const actualModule = jest.requireActual('@atlaskit/media-ui');
  return {
    ...actualModule,
    CustomMediaPlayer: jest.fn<
      ReturnType<typeof actualModule.CustomMediaPlayer>,
      Parameters<typeof actualModule.CustomMediaPlayer>
    >(() => null),
  };
});
import React from 'react';
import { ReactWrapper } from 'enzyme';
import { CustomMediaPlayer, InactivityDetector } from '@atlaskit/media-ui';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  FileIdentifier,
  FileState,
  MediaFileArtifacts,
  createFileStateSubject,
} from '@atlaskit/media-client';
import {
  asMockReturnValue,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
  fakeMediaClient,
  mountWithIntlContext,
  nextTick,
} from '@atlaskit/media-test-helpers';
import {
  InlinePlayer,
  InlinePlayerProps,
  getPreferredVideoArtifact,
  InlinePlayerState,
} from '../../../root/inlinePlayer';
import { CardLoading } from '../../../utils/lightCards/cardLoading';
import { InlinePlayerWrapper } from '../../../root/styled';

const defaultFileState: FileState = {
  status: 'processed',
  id: '123',
  name: 'file-name',
  size: 10,
  artifacts: {},
  mediaType: 'image',
  mimeType: 'image/png',
  representations: { image: {} },
};

describe('<InlinePlayer />', () => {
  const defaultArtifact: MediaFileArtifacts = {
    'video_1280.mp4': { processingStatus: 'succeeded', url: '' },
  };
  const setup = (
    props?: Partial<InlinePlayerProps>,
    artifacts: MediaFileArtifacts = defaultArtifact,
    InlinePlayerComponent: typeof InlinePlayer = InlinePlayer,
    identifier?: FileIdentifier,
  ) => {
    const mediaClient = fakeMediaClient();
    asMockReturnValue(
      mediaClient.file.getFileState,
      createFileStateSubject({
        ...defaultFileState,
        artifacts,
      }),
    );
    asMockReturnValue(
      mediaClient.file.getArtifactURL,
      Promise.resolve('some-url'),
    );
    asMockReturnValue(
      mediaClient.file.getFileBinaryURL,
      Promise.resolve('binary-url'),
    );
    const defaultIdentifier: FileIdentifier = {
      id: 'some-id',
      collectionName: 'some-collection',
      mediaItemType: 'file',
    };

    const TheInlinePlayer = () => (
      <InlinePlayerComponent
        dimensions={{}}
        mediaClient={mediaClient}
        identifier={identifier || defaultIdentifier}
        {...props}
      />
    );

    const component = mountWithIntlContext<
      InlinePlayerProps,
      InlinePlayerState
    >(<TheInlinePlayer />);

    return {
      component,
      mediaClient,
      identifier: identifier || defaultIdentifier,
    };
  };
  const update = async (
    component: ReactWrapper<InlinePlayerProps, InlinePlayerState>,
  ) => {
    await new Promise((resolve) => window.setTimeout(resolve));
    component.update();
  };

  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading component when the video src is not ready', () => {
    const { component } = setup({
      dimensions: {
        width: 10,
        height: '5%',
      },
    });

    expect(component.find(CardLoading)).toHaveLength(1);
    expect(component.find(CardLoading).prop('dimensions')).toEqual({
      width: 10,
      height: '5%',
    });
  });

  it('should call getFileState with right properties', async () => {
    const { component, mediaClient } = setup();

    await update(component);
    expect(mediaClient.file.getFileState).toBeCalledTimes(1);
    expect(mediaClient.file.getFileState).toBeCalledWith('some-id', {
      collectionName: 'some-collection',
    });
  });

  describe('dimensions', () => {
    const expectToHaveWidthHeight = (
      component: any,
      width: string,
      height: string,
    ) => {
      expect(component.find(InlinePlayerWrapper)).toHaveStyleRule(
        'width',
        width,
      );
      expect(component.find(InlinePlayerWrapper)).toHaveStyleRule(
        'height',
        height,
      );
    };
    it('should set width/height according to dimensions in the wrapper element', async () => {
      const { component } = setup({
        dimensions: {
          width: '80%',
          height: '20px',
        },
      });

      await update(component);
      expectToHaveWidthHeight(component, '80%', '20px');
    });
    it('default to 100%/audo width/height if no dimensions given', async () => {
      const { component } = setup();

      await update(component);
      expectToHaveWidthHeight(component, '100%', 'auto');
    });
  });

  it('should use local preview if available', async () => {
    const blob = new Blob([], { type: 'video/mp4' });
    const mediaClient = fakeMediaClient();
    asMockReturnValue(
      mediaClient.file.getFileState,
      createFileStateSubject({
        status: 'uploading',
        preview: {
          value: blob,
        },
        id: '',
        mediaType: 'image',
        mimeType: '',
        name: '',
        progress: 0,
        size: 0,
      }),
    );
    const { component } = setup({ mediaClient });

    await update(component);

    expect(component.find(CustomMediaPlayer).prop('src')).toEqual(
      'mock result of URL.createObjectURL()',
    );
  });

  it('should keep existing local preview', async () => {
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
    let createObjectURLCallTimes = 0;
    createObjectURLSpy.mockImplementation(() => {
      createObjectURLCallTimes++;
      return `object-url-src-${createObjectURLCallTimes}`;
    });
    const blob = new Blob([], { type: 'video/mp4' });
    const mediaClient = fakeMediaClient();
    const baseState: FileState = {
      status: 'uploading',
      preview: {
        value: blob,
      },
      id: '',
      mediaType: 'image',
      mimeType: '',
      name: '',
      progress: 0,
      size: 0,
    };
    const fileStateSubject = createFileStateSubject(baseState);

    asMockReturnValue(mediaClient.file.getFileState, fileStateSubject);
    const { component } = setup({ mediaClient });

    await update(component);

    expect(component.find(CustomMediaPlayer).prop('src')).toEqual(
      'object-url-src-1',
    );

    fileStateSubject.next({
      ...baseState,
      progress: 0.5,
    });

    await update(component);

    expect(createObjectURLSpy).toBeCalledTimes(1);
    expect(component.find(CustomMediaPlayer).prop('src')).toEqual(
      'object-url-src-1',
    );
  });

  it('should use right file artifact', async () => {
    const { component, mediaClient } = setup();

    await update(component);
    expect(mediaClient.file.getArtifactURL).toBeCalledTimes(1);
    expect(mediaClient.file.getArtifactURL).toBeCalledWith(
      {
        'video_1280.mp4': {
          processingStatus: 'succeeded',
          url: '',
        },
      },
      'video_1280.mp4',
      'some-collection',
    );
    expect(component.find(CustomMediaPlayer).prop('src')).toEqual('some-url');
  });

  it('should use sd artifact if hd one is not present', async () => {
    const { component, mediaClient } = setup(undefined, {
      'video_640.mp4': {
        processingStatus: 'succeeded',
        url: '',
      },
    });

    await update(component);
    expect(mediaClient.file.getArtifactURL).toBeCalledTimes(1);
    expect(mediaClient.file.getArtifactURL).toBeCalledWith(
      {
        'video_640.mp4': {
          processingStatus: 'succeeded',
          url: '',
        },
      },
      'video_640.mp4',
      'some-collection',
    );
    expect(component.find(CustomMediaPlayer).prop('src')).toEqual('some-url');
  });

  it('should use binary artifact if file is processing and no other artifact is present', async () => {
    const { component, mediaClient } = setup(undefined, {});

    await update(component);
    expect(mediaClient.file.getFileBinaryURL).toBeCalledTimes(1);
    expect(mediaClient.file.getFileBinaryURL).toBeCalledWith(
      'some-id',
      'some-collection',
    );
    expect(component.find(CustomMediaPlayer).prop('src')).toEqual('binary-url');
  });

  it('should download video binary when download button is clicked', async () => {
    const { component, mediaClient } = setup();

    await update(component);
    const { onDownloadClick } = component.find(CustomMediaPlayer).props();
    if (!onDownloadClick) {
      return expect(onDownloadClick).toBeDefined();
    }
    onDownloadClick();
    await nextTick();
    expect(mediaClient.file.downloadBinary).toBeCalledTimes(1);
    expect(mediaClient.file.downloadBinary).toBeCalledWith(
      'some-id',
      undefined,
      'some-collection',
    );
  });

  describe('getPreferredVideoArtifact()', () => {
    it('should return hd artifact if present', () => {
      const state = {
        status: 'processed',
        artifacts: {
          'video_1280.mp4': {},
          'video_640.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_1280.mp4',
      );
    });

    it('should fallback to sd artifact if hd is not present', () => {
      const state = {
        status: 'processed',
        artifacts: {
          'audio.mp3': {},
          'video_640.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_640.mp4',
      );
    });

    it('should work with processing status', () => {
      const state = {
        status: 'processing',
        artifacts: {
          'video_1280.mp4': {},
        },
      };

      expect(getPreferredVideoArtifact(state as FileState)).toEqual(
        'video_1280.mp4',
      );
    });
  });

  it('should trigger media-viewed when video is first played', async () => {
    const { component } = setup();
    await update(component);

    const { onFirstPlay } = component.find(CustomMediaPlayer).props();
    if (!onFirstPlay) {
      return expect(onFirstPlay).toBeDefined();
    }
    onFirstPlay();

    expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
      'media-viewed',
      {
        fileId: 'some-id',
        viewingLevel: 'full',
      } as MediaViewedEventPayload,
    ]);
  });

  it('should use last watch time feature', async () => {
    const { component, identifier } = setup();
    await update(component);
    expectToEqual(
      component.find(CustomMediaPlayer).props().lastWatchTimeConfig,
      {
        contentId: identifier.id,
      },
    );
  });

  it('should provide showControls to MediaPlayer', async () => {
    const mediaClient = fakeMediaClient();
    asMockReturnValue(
      mediaClient.file.getFileState,
      createFileStateSubject({
        status: 'uploading',
        preview: {
          value: new Blob([], { type: 'video/mp4' }),
        },
        id: '',
        mediaType: 'image',
        mimeType: '',
        name: '',
        progress: 0,
        size: 0,
      }),
    );
    const { component } = setup({ mediaClient });

    await update(component);

    const inactivityDetector = component.find(InactivityDetector).instance();
    expect(component.find(CustomMediaPlayer).prop('showControls')).toBe(
      (inactivityDetector as any).checkMouseMovement,
    );
  });
});
