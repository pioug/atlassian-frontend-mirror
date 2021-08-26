import * as mocks from './analytics.mock';
import React from 'react';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  ProcessedFileState,
} from '@atlaskit/media-client';
import {
  awaitError,
  mountWithIntlContext,
  fakeMediaClient,
  asMock,
  expectFunctionToHaveBeenCalledWith,
  nextTick,
} from '@atlaskit/media-test-helpers';
import { ImageViewer } from '../../../../../viewers/image';
import { MediaViewerError } from '../../../../../errors';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my image',
  size: 11222,
  mediaType: 'image',
  mimeType: 'jpeg',
  artifacts: {},
  representations: {
    image: {},
  },
};

function createFixture(response: Promise<Blob>) {
  const mediaClient = fakeMediaClient();
  asMock(mediaClient.getImage).mockReturnValue(response);
  const onClose = jest.fn();
  const onLoad = jest.fn();
  const onError = jest.fn();
  const el = mountWithIntlContext(
    <ImageViewer
      mediaClient={mediaClient}
      item={imageItem}
      collectionName={collectionName}
      onClose={onClose}
      onLoad={onLoad}
      onError={onError}
    />,
  );

  return { mediaClient, el, onClose };
}

describe('ImageViewer analytics', () => {
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should trigger media-viewed when image is displayed', async () => {
    mocks.setInteractiveImgHasError(false);
    const response = Promise.resolve(new Blob());
    createFixture(response);

    await response;
    await nextTick();

    expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
      'media-viewed',
      {
        fileId: 'some-id',
        viewingLevel: 'full',
      } as MediaViewedEventPayload,
    ]);
  });

  it('should call onLoad with success', async () => {
    mocks.setInteractiveImgHasError(false);
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    await nextTick();
    expect(el.prop('onLoad')).toHaveBeenCalledWith();
  });

  it('should call onLoad with error if interactive-img fails', async () => {
    mocks.setInteractiveImgHasError(true);
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    await nextTick();
    expect(el.prop('onError')).toHaveBeenCalledWith(
      new MediaViewerError('imageviewer-src-onerror'),
    );
  });

  it('should call onLoad with error if there is an error fetching metadata', async () => {
    const error = new MediaViewerError('imageviewer-fetch-url');
    const response = Promise.reject(error);
    const { el } = createFixture(response);

    await awaitError(response, 'imageviewer-fetch-url');
    expect(el.prop('onError')).toHaveBeenCalledWith(error);
  });
});
