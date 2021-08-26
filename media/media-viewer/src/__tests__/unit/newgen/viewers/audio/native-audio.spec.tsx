jest.mock('../../../../../utils/isIE', () => ({
  isIE: () => true,
}));

import React from 'react';
import { ProcessedFileState } from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  nextTick,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { AudioViewer } from '../../../../../viewers/audio';
import Spinner from '@atlaskit/spinner';
import { DefaultCoverWrapper, AudioCover } from '../../../../../styled';
import { ErrorMessage } from '../../../../../errorMessage';
import Button from '@atlaskit/button/custom-theme-button';
import { Auth } from '@atlaskit/media-core';

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
      previewCount={0}
    />,
  );
  return { mediaClient, el };
}

describe('Audio viewer', () => {
  afterEach(() => {
    jest.clearAllMocks();
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

  it('shows error message with a download button if there is an error displaying the preview', async () => {
    const mockGetArtifactUrlReturn = Promise.resolve('');

    const { el } = createFixture(
      new Promise(() => {}),
      undefined,
      undefined,
      mockGetArtifactUrlReturn,
    );

    await mockGetArtifactUrlReturn;

    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );

    // download button
    expect(errorMessage.text()).toContain(
      'Try downloading the file to view it',
    );
    expect(errorMessage.find(Button)).toHaveLength(1);
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
      const { el, mediaClient } = createFixture(authPromise, collectionName);
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
        expect(el.find('audio').prop('autoPlay')).toBeTruthy();
      });

      it('should not auto play when it is not the first preview', async () => {
        const el = await createAutoPlayFixture(1);
        expect(el.find('audio').prop('autoPlay')).toBeFalsy();
      });
    });
  });
});
