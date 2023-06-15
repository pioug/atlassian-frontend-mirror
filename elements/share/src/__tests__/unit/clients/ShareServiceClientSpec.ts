import { utils } from '@atlaskit/util-service-support';

import {
  DEFAULT_SHARE_PATH,
  DEFAULT_SHARE_SERVICE_URL,
  SHARE_CONFIG_PATH,
  ShareClient,
  ShareServiceClient,
} from '../../../clients/ShareServiceClient';
import { Comment, Content, MetaData, User } from '../../../types';

describe('ShareServiceClientImpl', () => {
  let requestSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;
  let shareServiceClient: ShareClient;
  let mockContent: Content = {
    link: 'link',
    ari: 'ari',
    title: 'title',
    type: 'type',
  };
  let mockRecipients: User[] = [
    { type: 'user', id: 'id' },
    { type: 'user', email: 'email' },
  ];
  let mockMetaData: MetaData = {
    productId: 'confluence',
    atlOriginId: 'atlOriginId',
  };
  let mockComment: Comment = {
    format: 'plain_text',
    value: 'mock comment',
  };

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService').mockResolvedValue({});
    fetchSpy = jest.spyOn(window, 'fetch');
    shareServiceClient = new ShareServiceClient();
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  describe('share', () => {
    it('should work in successful fetch path', async () => {
      fetchSpy.mockResolvedValue({
        status: 202,
        ok: true,
        json: () => Promise.resolve('body response'),
      });

      const fetchResult = await shareServiceClient.share(
        mockContent,
        mockRecipients,
        mockMetaData,
        mockComment,
      );
      expect(fetchSpy).toBeCalledTimes(1);
      const callArgs = fetchSpy.mock.calls[0];
      expect(callArgs[0]).toEqual(
        `${DEFAULT_SHARE_SERVICE_URL}/${DEFAULT_SHARE_PATH}`,
      );
      expect(callArgs[1]).toMatchObject({
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: mockContent,
          recipients: mockRecipients,
          metadata: mockMetaData,
          comment: mockComment,
        }),
      });

      expect(fetchResult).toEqual('body response');
    });

    it('should work in unsuccessful fetch path', async () => {
      fetchSpy.mockResolvedValue({
        status: 400,
        statusText: 'Bad request',
        ok: false,
        json: () => Promise.resolve('body response'),
      });

      const fetchPromise = shareServiceClient.share(
        mockContent,
        mockRecipients,
        mockMetaData,
        mockComment,
      );

      await expect(fetchPromise).rejects.toMatchObject({
        code: 400,
        reason: 'Bad request',
      });
      const fetchError = await fetchPromise.catch((x) => x);
      await expect(fetchError.body).resolves.toEqual('body response');
    });
  });

  describe('getConfig', () => {
    it('should call requestService', async () => {
      await shareServiceClient.getConfig('some-cloud-id');
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject({
        url: DEFAULT_SHARE_SERVICE_URL,
      });
      expect(callArgs[1]).toMatchObject({
        path: SHARE_CONFIG_PATH,
        queryParams: { cloudId: 'some-cloud-id' },
        requestInit: {
          method: 'get',
        },
      });
    });
  });
});
