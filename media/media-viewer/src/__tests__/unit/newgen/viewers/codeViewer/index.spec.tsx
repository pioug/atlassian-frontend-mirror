jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');
  return {
    ...actualModule,
    request: jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue('some-src'),
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    }),
  };
});
import React from 'react';
import {
  globalMediaEventEmitter,
  MediaViewedEventPayload,
  FileState,
  ProcessedFileState,
} from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  fakeMediaClient,
  expectFunctionToHaveBeenCalledWith,
  nextTick,
  sleep,
  asMockFunction,
} from '@atlaskit/media-test-helpers';
import { Spinner } from '../../../../../loading';
import { MediaViewerError } from '../../../../../errors';
import { BaseState } from '../../../../../viewers/base-viewer';
import { Content } from '../../../../../content';
import { CodeViewer, Props } from '../../../../../viewers/codeViewer/index';
import { msgToText } from '../../../../../viewers/codeViewer/msg-parser';

jest.mock('../../../../../viewers/codeViewer/msg-parser', () => ({
  __esModule: true,
  msgToText: jest.fn(),
}));

function createFixture(
  fetchPromise: Promise<any>,
  codeItem: FileState,
  collectionName?: string,
  mockReturnGetFileBinaryURL?: Promise<string>,
  props: Partial<Props> = {},
) {
  const mediaClient = fakeMediaClient();
  const onClose = jest.fn(() => fetchPromise);
  const onSuccess = jest.fn();
  const onError = jest.fn();

  jest
    .spyOn(mediaClient.file, 'getFileBinaryURL')
    .mockReturnValue(
      mockReturnGetFileBinaryURL ||
        Promise.resolve(
          'some-base-url/document?client=some-client-id&token=some-token',
        ),
    );

  const el = mountWithIntlContext<Props, BaseState<Content>>(
    <CodeViewer
      item={codeItem}
      mediaClient={mediaClient}
      collectionName={collectionName}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />,
  );
  (el as any).instance()['fetch'] = jest.fn();
  return { mediaClient, el, onClose, onSuccess, onError };
}

const codeItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'code.py',
  size: 11222,
  mediaType: 'unknown',
  mimeType: 'unknown',
  artifacts: {
    'document.pdf': {
      url: '/pdf',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

const emailItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'emailItem.msg',
  size: 11222,
  mediaType: 'unknown',
  mimeType: 'unknown',
  artifacts: {
    'document.pdf': {
      url: '/pdf',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

const getSuccessDocument = async (item: ProcessedFileState) => {
  const fetchPromise = Promise.resolve();
  const { el } = createFixture(fetchPromise, item);
  await nextTick();
  await nextTick();
  await nextTick();
  return el;
};

describe('CodeViewer', () => {
  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('assigns a document content when successful', async () => {
    const el = await getSuccessDocument(codeItem);
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    expect(el.state().content.status).toEqual('SUCCESSFUL');
  });

  it('triggers media-viewed when successful', async () => {
    await getSuccessDocument(codeItem);
    // TODO: clean up these awaits, figure out how to express better...
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
    await nextTick();
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

  it('shows an indicator while loading', async () => {
    const fetchPromise = new Promise(() => {});
    const { el } = createFixture(fetchPromise, codeItem);
    await (el as any).instance()['init']();

    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('MSW-720: passes collectionName to getFileBinaryURL', async () => {
    const collectionName = 'some-collection';
    const fetchPromise = Promise.resolve();
    const { el, mediaClient } = createFixture(
      fetchPromise,
      codeItem,
      collectionName,
    );
    await (el as any).instance()['init']();
    expect(
      (mediaClient.file.getFileBinaryURL as jest.Mock).mock.calls[0][1],
    ).toEqual(collectionName);
  });

  it('should call onError when an error happens', async () => {
    const error = new MediaViewerError('codeviewer-fetch-src');
    const fetchPromise = Promise.resolve();
    const { el, onError } = createFixture(
      fetchPromise,
      codeItem,
      undefined,
      Promise.reject(error),
    );
    await (el as any).instance()['init']();
    expect(onError).toBeCalledWith(error);
  });
});

describe('EmailViewer', () => {
  const getDocument = async (item: ProcessedFileState) => {
    const fetchPromise = Promise.resolve();
    const { el } = createFixture(fetchPromise, item);
    await nextTick();
    await nextTick();
    await nextTick();
    await sleep(50);
    return el;
  };

  beforeEach(() => {
    jest.spyOn(globalMediaEventEmitter, 'emit');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when email contents have FAILED to parse', () => {
    it('should not emit media-viewed', async () => {
      asMockFunction(msgToText).mockImplementation(() => {
        return { error: 'error message here' };
      });
      await getDocument(emailItem);
      expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(0);
    });

    it('assign preview failed content', async () => {
      const el = await getDocument(emailItem);
      expect(el.state().content.status).toEqual('FAILED');
    });
  });

  describe('when email contents have SUCCESSFULLY parsed', () => {
    it('should email media-viewed', async () => {
      asMockFunction(msgToText).mockImplementation(() => {
        return 'sample email message here';
      });
      await getDocument(emailItem);
      expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
    });

    it('assign successful content', async () => {
      const el = await getDocument(emailItem);
      expect(el.state().content.status).toEqual('SUCCESSFUL');
    });
  });

  //TODO, test error handling (i.e when email cannot be parsed)
});
