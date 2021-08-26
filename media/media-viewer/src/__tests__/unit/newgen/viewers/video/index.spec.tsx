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
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  ProcessedFileState,
} from '@atlaskit/media-client';
import Spinner from '@atlaskit/spinner';
import {
  mountWithIntlContext,
  fakeMediaClient,
  expectFunctionToHaveBeenCalledWith,
  expectToEqual,
  asMockFunction,
} from '@atlaskit/media-test-helpers';
import { CustomMediaPlayer } from '@atlaskit/media-ui';
import { VideoViewer, Props } from '../../../../../viewers/video';
import { ErrorMessage } from '../../../../../errorMessage';

const token = 'some-token';
const clientId = 'some-client-id';
const baseUrl = 'some-base-url';

const videoItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my video',
  size: 11222,
  mediaType: 'video',
  mimeType: 'mp4',
  artifacts: {
    'video_640.mp4': {
      url: '/video',
      processingStatus: 'succeeded',
    },
    'video_1280.mp4': {
      url: '/video_hd',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};
const sdVideoItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my video',
  size: 11222,
  mediaType: 'video',
  mimeType: 'mp4',
  artifacts: {
    'video_640.mp4': {
      url: '/video',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

interface SetupOptions {
  props?: Partial<Props>;
  item?: ProcessedFileState;
  mockReturnGetArtifactURL?: Promise<string>;
  shouldInit?: boolean;
}

const defaultOptions: SetupOptions = { shouldInit: true };
async function setup(options: SetupOptions = {}) {
  const { props, item, mockReturnGetArtifactURL, shouldInit } = {
    ...defaultOptions,
    ...options,
  };
  const authPromise = Promise.resolve({ token, clientId, baseUrl });
  const mediaClient = fakeMediaClient({
    authProvider: () => authPromise,
  });

  const getArtifactURLResult: ReturnType<typeof mediaClient.file.getArtifactURL> =
    mockReturnGetArtifactURL ||
    Promise.resolve(
      'some-base-url/video_hd?client=some-client-id&token=some-token',
    );

  jest
    .spyOn(mediaClient.file, 'getArtifactURL')
    .mockReturnValue(getArtifactURLResult);

  const el = mountWithIntlContext(
    <VideoViewer
      onCanPlay={() => {}}
      onError={() => {}}
      mediaClient={mediaClient}
      item={item || videoItem}
      {...props}
      previewCount={(props && props.previewCount) || 0}
    />,
  );

  if (shouldInit) {
    await getArtifactURLResult;
    el.update();
  }

  const customMediaPlayer = el.find(CustomMediaPlayer);
  return { mediaClient, el, item: item || videoItem, customMediaPlayer };
}

describe('Video viewer', () => {
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    localStorage.clear();
    (localStorage.setItem as jest.Mock).mockClear();
  });

  it('assigns a src for videos when successful', async () => {
    const { customMediaPlayer } = await setup();

    expect(customMediaPlayer.props().src).toEqual(
      'some-base-url/video_hd?client=some-client-id&token=some-token',
    );
  });

  it('shows spinner when pending', async () => {
    const { el } = await setup({
      shouldInit: false,
      mockReturnGetArtifactURL: new Promise(() => {}),
    });
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error message when there are not video artifacts in the media item', async () => {
    const { el } = await setup({
      mockReturnGetArtifactURL: Promise.resolve(''),
    });

    const errorMessage = el.find(ErrorMessage);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );
  });

  it('MSW-720: passes collectionName to getArtifactURL', async () => {
    const collectionName = 'some-collection';
    const { mediaClient } = await setup({
      props: { collectionName },
    });

    expectToEqual(
      asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][2],
      collectionName,
    );
  });

  it('should render a custom video player if the feature flag is active', async () => {
    const { customMediaPlayer } = await setup();

    expect(customMediaPlayer).toHaveLength(1);
    expect(customMediaPlayer.props().src).toEqual(
      'some-base-url/video_hd?client=some-client-id&token=some-token',
    );
  });

  it('should toggle hd when button is clicked', async () => {
    const { el, customMediaPlayer } = await setup();

    expect(customMediaPlayer.props().isHDActive).toBeTruthy();
    const { onHDToggleClick } = customMediaPlayer.props();
    if (!onHDToggleClick) {
      return expect(onHDToggleClick).toBeDefined();
    }
    onHDToggleClick();

    el.update();

    expect(el.find(CustomMediaPlayer).props().isHDActive).toBeFalsy();
  });

  it('should default to hd if available', async () => {
    const { customMediaPlayer } = await setup();

    expect(customMediaPlayer.props().isHDActive).toBeTruthy();
  });

  it('should default to sd if hd is not available', async () => {
    const { customMediaPlayer } = await setup({
      item: sdVideoItem,
    });

    expect(customMediaPlayer.props().isHDActive).toBeFalsy();
  });

  it('should save video quality when changes', async () => {
    const { customMediaPlayer } = await setup();

    const { onHDToggleClick } = customMediaPlayer.props();
    if (!onHDToggleClick) {
      return expect(onHDToggleClick).toBeDefined();
    }
    onHDToggleClick();

    expect(localStorage.setItem).toBeCalledWith(
      'mv_video_player_quality',
      'sd',
    );
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should default to sd if previous quality was sd', async () => {
    localStorage.setItem('mv_video_player_quality', 'sd');
    const { customMediaPlayer } = await setup();

    expect(customMediaPlayer.props().isHDActive).toBeFalsy();
  });

  describe('AutoPlay', () => {
    it('should auto play video viewer when it is the first preview', async () => {
      const { customMediaPlayer } = await setup({
        props: {
          previewCount: 0,
          item: videoItem,
        },
      });
      expect(customMediaPlayer).toHaveLength(1);
      expect(customMediaPlayer.props().isAutoPlay).toBe(true);
    });

    it('should not auto play video viewer when it is not the first preview', async () => {
      const { customMediaPlayer } = await setup({
        props: {
          previewCount: 1,
          item: videoItem,
        },
      });
      expect(customMediaPlayer).toHaveLength(1);
      expect(customMediaPlayer.props().isAutoPlay).toBe(false);
    });
  });

  it('should trigger media-viewed when video is first played', async () => {
    localStorage.setItem('mv_video_player_quality', 'sd');
    const { customMediaPlayer } = await setup({
      props: {
        previewCount: 1,
      },
    });

    const { onFirstPlay } = customMediaPlayer.props();
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
    const { item, customMediaPlayer } = await setup();

    expectToEqual(customMediaPlayer.props().lastWatchTimeConfig, {
      contentId: item.id,
    });
  });
});
