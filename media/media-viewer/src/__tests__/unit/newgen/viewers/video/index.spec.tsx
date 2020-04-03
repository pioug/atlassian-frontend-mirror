import React from 'react';
import Button from '@atlaskit/button';
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
} from '@atlaskit/media-test-helpers';
import { CustomMediaPlayer } from '@atlaskit/media-ui';
import { VideoViewer, Props } from '../../../../../newgen/viewers/video';
import { ErrorMessage } from '../../../../../newgen/error';
import { Auth } from '@atlaskit/media-core';

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

function createFixture(
  authPromise: Promise<Auth>,
  props?: Partial<Props>,
  item?: ProcessedFileState,
  mockReturnGetArtifactURL?: Promise<string>,
) {
  const mediaClient = fakeMediaClient({
    authProvider: () => authPromise,
  });

  jest
    .spyOn(mediaClient.file, 'getArtifactURL')
    .mockReturnValue(
      mockReturnGetArtifactURL ||
        Promise.resolve(
          'some-base-url/video_hd?client=some-client-id&token=some-token',
        ),
    );

  const el = mountWithIntlContext(
    <VideoViewer
      mediaClient={mediaClient}
      item={item || videoItem}
      {...props}
      previewCount={(props && props.previewCount) || 0}
    />,
  );
  return { mediaClient, el };
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
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise);
    await (el as any).instance()['init']();
    el.update();
    expect(el.find(CustomMediaPlayer).prop('src')).toEqual(
      'some-base-url/video_hd?client=some-client-id&token=some-token',
    );
  });

  it('shows spinner when pending', async () => {
    const authPromise: any = new Promise(() => {});
    const { el } = createFixture(authPromise);
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error message when there are not video artifacts in the media item', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(
      authPromise,
      undefined,
      undefined,
      Promise.resolve(''),
    );

    await (el as any).instance()['init']();
    el.update();

    const errorMessage = el.find(ErrorMessage);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );
  });

  it('MSW-720: passes collectionName to getArtifactURL', async () => {
    const collectionName = 'some-collection';
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el, mediaClient } = createFixture(authPromise, { collectionName });
    await (el as any).instance()['init']();
    el.update();
    expect(
      (mediaClient.file.getArtifactURL as jest.Mock).mock.calls[0][2],
    ).toEqual(collectionName);
  });

  it('should render a custom video player if the feature flag is active', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise);

    await (el as any).instance()['init']();
    el.update();

    expect(el.find(CustomMediaPlayer)).toHaveLength(1);
    expect(el.find(CustomMediaPlayer).prop('src')).toEqual(
      'some-base-url/video_hd?client=some-client-id&token=some-token',
    );
  });

  it('should toggle hd when button is clicked', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise);

    await (el as any).instance()['init']();
    el.update();
    expect(el.state('isHDActive')).toBeTruthy();
    el.find(Button)
      .at(2)
      .simulate('click');
    expect(el.state('isHDActive')).toBeFalsy();
  });

  it('should default to hd if available', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise);

    await (el as any).instance()['init']();
    el.update();
    expect(el.state('isHDActive')).toBeTruthy();
  });

  it('should default to sd if hd is not available', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise, {}, sdVideoItem);

    await (el as any).instance()['init']();
    el.update();
    expect(el.state('isHDActive')).toBeFalsy();
  });

  it('should save video quality when changes', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise, {});

    await (el as any).instance()['init']();
    el.update();
    el.find(Button)
      .at(2)
      .simulate('click');
    expect(localStorage.setItem).toBeCalledWith(
      'mv_video_player_quality',
      'sd',
    );
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should default to sd if previous quality was sd', async () => {
    localStorage.setItem('mv_video_player_quality', 'sd');
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise, {});

    await (el as any).instance()['init']();
    el.update();
    expect(el.state('isHDActive')).toBeFalsy();
  });

  describe('AutoPlay', () => {
    async function createAutoPlayFixture(previewCount: number) {
      const authPromise = Promise.resolve({ token, clientId, baseUrl });
      const { mediaClient } = createFixture(authPromise);
      const el = mountWithIntlContext(
        <VideoViewer
          mediaClient={mediaClient}
          previewCount={previewCount}
          item={videoItem}
        />,
      );
      await (el as any).instance()['init']();
      el.update();
      return el;
    }

    it('should auto play video viewer when it is the first preview', async () => {
      const el = await createAutoPlayFixture(0);
      expect(el.find(CustomMediaPlayer)).toHaveLength(1);
      expect(el.find({ autoPlay: true })).toHaveLength(2);
    });

    it('should not auto play video viewer when it is not the first preview', async () => {
      const el = await createAutoPlayFixture(1);
      expect(el.find(CustomMediaPlayer)).toHaveLength(1);
      expect(el.find({ autoPlay: true })).toHaveLength(0);
    });
  });

  it('should trigger media-viewed when video is first played', async () => {
    localStorage.setItem('mv_video_player_quality', 'sd');
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise, { previewCount: 1 });
    await (el as any).instance()['init']();
    el.update();
    const { onFirstPlay } = el.find(CustomMediaPlayer).props();
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
});
