import React from 'react';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  FileState,
  ProcessedFileState,
  ProcessingFileState,
  PreviewableFileState,
} from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  fakeMediaClient,
  expectFunctionToHaveBeenCalledWith,
  nextTick,
} from '@atlaskit/media-test-helpers';
import { Spinner } from '../../../../../loading';
import { MediaViewerError } from '../../../../../errors';
import { DocViewer, Props } from '../../../../../viewers/doc/index';
import { BaseState } from '../../../../../viewers/base-viewer';
import { Content } from '../../../../../content';
import { getObjectUrlFromFileState } from '../../../../../utils/getObjectUrlFromFileState';

jest.mock('../../../../../utils/getObjectUrlFromFileState', () => ({
  __esModule: true,
  getObjectUrlFromFileState: jest
    .fn()
    .mockResolvedValue('object-url-from-filestate'),
}));

function createFixture(
  fetchPromise: Promise<any>,
  item: FileState,
  collectionName?: string,
  mockReturnGetArtifactURL?: Promise<string>,
) {
  const mediaClient = fakeMediaClient();
  const onClose = jest.fn(() => fetchPromise);
  const onError = jest.fn();

  jest
    .spyOn(mediaClient.file, 'getArtifactURL')
    .mockReturnValue(
      mockReturnGetArtifactURL ||
        Promise.resolve(
          'some-base-url/document?client=some-client-id&token=some-token',
        ),
    );

  const el = mountWithIntlContext<Props, BaseState<Content>>(
    <DocViewer
      item={item}
      mediaClient={mediaClient}
      collectionName={collectionName}
      onSuccess={() => {}}
      onError={onError}
    />,
  );
  (el as any).instance()['fetch'] = jest.fn();
  return { mediaClient, el, onClose, onError };
}

const item: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my pdf',
  size: 11222,
  mediaType: 'doc',
  mimeType: 'application/pdf',
  artifacts: {
    'document.pdf': {
      url: '/pdf',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

const previewableItem: ProcessingFileState & PreviewableFileState = {
  id: 'some-id',
  status: 'processing',
  name: 'my pdf',
  size: 11222,
  mediaType: 'doc',
  mimeType: 'application/pdf',
  preview: {
    value: new Blob([], { type: 'application/pdf' }),
    origin: 'local',
  },
};

describe('DocViewer', () => {
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const getSuccessDocument = async () => {
    const fetchPromise = Promise.resolve();
    const { el } = createFixture(fetchPromise, item);
    await nextTick();
    await nextTick();
    await nextTick();
    return el;
  };

  const getPreviewableDocument = async () => {
    const fetchPromise = Promise.resolve();
    const { el, mediaClient } = createFixture(fetchPromise, previewableItem);
    await nextTick();
    await nextTick();
    await nextTick();
    return { el, mediaClient };
  };

  it('assigns a document content when successful', async () => {
    const el = await getSuccessDocument();
    await nextTick();
    expect(el.state().content.status).toEqual('SUCCESSFUL');
  });

  it('triggers media-viewed when successful', async () => {
    await getSuccessDocument();
    expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
      'media-viewed',
      {
        fileId: 'some-id',
        viewingLevel: 'full',
      } as MediaViewedEventPayload,
    ]);
  });

  it('shows an indicator while loading', async () => {
    const fetchPromise = new Promise(() => {});
    const { el } = createFixture(fetchPromise, item);
    await (el as any).instance()['init']();

    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('MSW-720: passes collectionName to getArtifactURL', async () => {
    const collectionName = 'some-collection';
    const fetchPromise = Promise.resolve();
    const { el, mediaClient } = createFixture(
      fetchPromise,
      item,
      collectionName,
    );
    await (el as any).instance()['init']();
    expect(
      (mediaClient.file.getArtifactURL as jest.Mock).mock.calls[0][2],
    ).toEqual(collectionName);
  });

  it('should call onError when an error happens', async () => {
    const error = new MediaViewerError('docviewer-fetch-url');
    const fetchPromise = Promise.resolve();
    const { el, onError } = createFixture(
      fetchPromise,
      item,
      undefined,
      Promise.reject(new MediaViewerError('docviewer-fetch-url')),
    );
    await (el as any).instance()['init']();
    expect(onError).toBeCalledWith(error);
  });

  it('should use local preview when available', async () => {
    const { el, mediaClient } = await getPreviewableDocument();
    await (el as any).instance()['init']();
    expect(getObjectUrlFromFileState).toHaveBeenCalledWith(previewableItem);
    expect(mediaClient.file.getArtifactURL as jest.Mock).toHaveBeenCalledTimes(
      0,
    );
  });
});
