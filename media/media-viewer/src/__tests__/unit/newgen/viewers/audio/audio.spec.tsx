import React from 'react';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  ProcessedFileState,
} from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  nextTick,
  fakeMediaClient,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import { Auth } from '@atlaskit/media-core';
import { AudioViewer } from '../../../../../viewers/audio';
import { Props } from '../../../../../viewers/video';
import { DefaultCoverWrapper, AudioCover } from '../../../../../styled';
import { ErrorMessage } from '../../../../../errorMessage';
import { CustomMediaPlayer } from '@atlaskit/media-ui';

const token = 'some-token';
const clientId = 'some-client-id';
const baseUrl = 'some-base-url';

const audioItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my audio',
  size: 11222,
  mediaType: 'audio',
  mimeType: 'mp3',
  artifacts: {
    'audio.mp3': {
      url: '/audio',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

function createFixture(
  authPromise: Promise<Auth>,
  props?: Partial<Props>,
  collectionName?: string,
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
          'some-base-url/audio?client=some-client-id&token=some-token',
        ),
    );

  const el = mountWithIntlContext(
    <AudioViewer
      onCanPlay={() => {}}
      onError={() => {}}
      mediaClient={mediaClient}
      item={item || audioItem}
      collectionName={collectionName}
      {...props}
      previewCount={(props && props.previewCount) || 0}
    />,
  );
  return { mediaClient, el };
}

describe('Audio viewer', () => {
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('assigns a src for audio files when successful', async () => {
    const authPromise = Promise.resolve({ token, clientId, baseUrl });
    const { el } = createFixture(authPromise);
    await (el as any).instance()['init']();
    el.update();
    expect(el.find('audio').prop('src')).toEqual(
      'some-base-url/audio?client=some-client-id&token=some-token',
    );
  });

  it('shows spinner when pending', async () => {
    const authPromise: any = new Promise(() => {});
    const { el } = createFixture(authPromise);
    el.update();
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows error if no audio artifacts found', async () => {
    const authPromise: any = new Promise(() => {});
    const { el } = createFixture(
      authPromise,
      {},
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

  describe('cover', () => {
    it('it should show the default cover while the audio cover is loading', async () => {
      const authPromise = Promise.resolve({ token, clientId, baseUrl });
      const { el } = createFixture(authPromise);
      await (el as any).instance()['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it('it should show the default cover when the audio cover is errored', async () => {
      const authPromise = Promise.resolve({ token, clientId, baseUrl });
      const { el } = createFixture(authPromise);
      const instance: any = el.instance();

      instance['loadCover'] = () => Promise.reject('no cover found');
      await instance['init']();
      el.update();
      expect(el.find(DefaultCoverWrapper)).toHaveLength(1);
    });

    it('it should show the audio cover if exists', async () => {
      const authPromise = Promise.resolve({ token, clientId, baseUrl });
      const { el } = createFixture(authPromise);
      const instance: any = el.instance();
      const promiseSrc = Promise.resolve('cover-src');

      instance['loadCover'] = () => promiseSrc;
      await instance['init']();
      await promiseSrc;
      await nextTick();
      await nextTick();

      el.update();

      expect(el.find(DefaultCoverWrapper)).toHaveLength(0);
      expect(el.find(AudioCover).prop('src')).toEqual('some-image-url');
    });

    it('MSW-720: pass the collectionName to calls to getArtifactURL', async () => {
      const collectionName = 'collectionName';
      const authPromise = Promise.resolve({ token, clientId, baseUrl });
      const { el, mediaClient } = createFixture(
        authPromise,
        {},
        collectionName,
      );
      const instance: any = el.instance();
      const promiseSrc = Promise.resolve('cover-src');

      instance['loadCover'] = () => promiseSrc;
      await instance['init']();
      await promiseSrc;
      el.update();

      expect(
        (mediaClient.file.getArtifactURL as jest.Mock).mock.calls[0][2],
      ).toEqual(collectionName);
      expect(
        (mediaClient.file.getArtifactURL as jest.Mock).mock.calls[1][2],
      ).toEqual(collectionName);
    });

    describe('AutoPlay', () => {
      async function createAutoPlayFixture(previewCount: number) {
        const mediaClient = fakeMediaClient();

        jest
          .spyOn(mediaClient.file, 'getArtifactURL')
          .mockReturnValue(
            Promise.resolve(
              'some-base-url/audio?client=some-client-id&token=some-token',
            ),
          );

        const el = mountWithIntlContext(
          <AudioViewer
            onCanPlay={() => {}}
            onError={() => {}}
            mediaClient={mediaClient}
            item={audioItem}
            collectionName="collectionName"
            previewCount={previewCount}
          />,
        );
        const instance: any = el.instance();
        await instance['init']();
        el.update();
        return el;
      }

      it('should auto play when it is the first preview', async () => {
        const el = await createAutoPlayFixture(0);
        expect(el.find(CustomMediaPlayer).prop('isAutoPlay')).toBeTruthy();
      });

      it('should not auto play when it is not the first preview', async () => {
        const el = await createAutoPlayFixture(1);
        expect(el.find(CustomMediaPlayer).prop('isAutoPlay')).toBeFalsy();
      });
    });
  });

  it('should trigger media-viewed when audio is first played', async () => {
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
