import {
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { defaultSchema, MediaADFAttrs } from '@atlaskit/adf-schema';

import { getDefaultMediaClientConfig } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { MediaClient, FileState } from '@atlaskit/media-client';
import { fakeMediaClient, asMockFunction } from '@atlaskit/media-test-helpers';
import { Node as PMNode } from 'prosemirror-model';

jest.mock('../../../pm-plugins/plugin-key', () => ({
  ...jest.requireActual('../../../pm-plugins/plugin-key'),
  stateKey: {
    getState: jest.fn(() => ({
      mediaClientConfig: getDefaultMediaClientConfig(),
    })),
  },
}));

import { checkMediaType } from '../../../utils/check-media-type';

const defaultFileState: FileState = {
  id: 'testID',
  mediaType: 'image',
  status: 'processed',
  mimeType: 'image/png',
  name: 'file-name',
  size: 10,
  artifacts: {},
};

const mediaClient = fakeMediaClient();

let mediaClientMock: MediaClient = mediaClient;

jest.mock('@atlaskit/media-client', () => ({
  ...jest.requireActual('@atlaskit/media-client'),
  getMediaClient: jest.fn(() => mediaClientMock),
}));

const createMediaNode = (mediaAttrs: MediaADFAttrs): PMNode => {
  const mediaSingleNode = mediaSingle({ layout: 'center' })(
    media({
      ...mediaAttrs,
    })(),
  )(defaultSchema);

  return mediaSingleNode.firstChild!;
};

const mediaClientConfig = getDefaultMediaClientConfig();

describe('checkMediaType', () => {
  beforeEach(() => {
    (mediaClient.file.getCurrentState as jest.Mock).mockClear();
  });

  it('returns external when media is external', async () => {
    const mediaType = await checkMediaType(
      createMediaNode({ type: 'external' } as MediaADFAttrs),
      mediaClientConfig,
    );

    expect(mediaType).toEqual('external');
    expect(mediaClient.file.getCurrentState).not.toHaveBeenCalled();
  });

  it('returns undefined if media id is missing ', async () => {
    const mediaType = await checkMediaType(
      createMediaNode({ type: 'file', id: '' } as MediaADFAttrs),
      mediaClientConfig,
    );

    expect(mediaType).toBeUndefined();
    expect(mediaClient.file.getCurrentState).not.toHaveBeenCalled();
  });

  it('returns correct mediaType if fileState is not error', async () => {
    asMockFunction(mediaClient.file.getCurrentState).mockReturnValue(
      Promise.resolve(defaultFileState),
    );

    const mediaType = await checkMediaType(
      createMediaNode({
        type: 'file',
        id: 'test-id',
        collection: 'test-collection',
      } as MediaADFAttrs),
      mediaClientConfig,
    );

    expect(mediaType).toEqual('image');
    expect(mediaClient.file.getCurrentState).toHaveBeenLastCalledWith(
      'test-id',
      {
        collectionName: 'test-collection',
      },
    );
  });

  it('returns correct mediaType if fileState is not error', async () => {
    asMockFunction(mediaClient.file.getCurrentState).mockReturnValue(
      Promise.resolve({ status: 'error' } as FileState),
    );

    const mediaType = await checkMediaType(
      createMediaNode({
        type: 'file',
        id: 'test-id',
        collection: 'test-collection',
      } as MediaADFAttrs),
      mediaClientConfig,
    );

    expect(mediaType).toBeUndefined();
    expect(mediaClient.file.getCurrentState).toHaveBeenLastCalledWith(
      'test-id',
      {
        collectionName: 'test-collection',
      },
    );
  });
});
