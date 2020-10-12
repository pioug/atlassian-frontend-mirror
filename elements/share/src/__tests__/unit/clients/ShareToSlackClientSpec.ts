import { ServiceConfig, utils } from '@atlaskit/util-service-support';
import {
  ShareToSlackClient,
  ShareToSlackServiceClient,
  getTeamsPath,
  getConversationsPath,
  getSharePath,
  DEFAULT_SHARE_TO_SLACK_SERVICE_URL,
} from '../../../clients/ShareToSlackClient';
// import { Comment, Content, MetaData, User } from '../../../types';

describe('ShareServiceClientImpl', () => {
  let requestSpy: jest.SpyInstance;
  let shareToSlackServiceClient: ShareToSlackClient;
  const mockTeamId = '1';
  const mockConversationId = '123';
  const mockConversationType = 'directMessage';
  const mockLink = 'http://abc';
  const mockProduct = 'confluence';
  const mockCloudId = '1a2b3c';
  const mockMessage = 'Hello!';

  beforeEach(() => {
    requestSpy = jest.spyOn(utils, 'requestService').mockResolvedValue({});
    shareToSlackServiceClient = new ShareToSlackServiceClient();
  });

  afterEach(() => {
    requestSpy.mockRestore();
  });

  describe('ShareToSlack', () => {
    it('should get the correct Path for teams, conversations and share link', () => {
      const teamsPath = getTeamsPath('confluence');
      const conversationPath = getConversationsPath('confluence');
      const sharePath = getSharePath('confluence');

      expect(teamsPath).toEqual('confluence-workspaces');
      expect(conversationPath).toEqual('confluence-conversations');
      expect(sharePath).toEqual('confluence-share-link');
    });

    it('should call requestService with default serviceConfig and options object', async () => {
      await shareToSlackServiceClient.share(
        mockTeamId,
        mockConversationId,
        mockConversationType,
        mockLink,
        mockProduct,
        mockCloudId,
        mockMessage,
      );
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject({
        url: DEFAULT_SHARE_TO_SLACK_SERVICE_URL,
      });
    });

    it('should call requestService with configurable serviceConfig', async () => {
      const mockServiceConfig: ServiceConfig = {
        url: 'customurl',
      };
      shareToSlackServiceClient = new ShareToSlackServiceClient(
        mockServiceConfig,
      );
      await shareToSlackServiceClient.share(
        mockTeamId,
        mockConversationId,
        mockConversationType,
        mockLink,
        mockProduct,
        mockCloudId,
        mockMessage,
      );
      expect(requestSpy).toBeCalledTimes(1);
      const callArgs = requestSpy.mock.calls[0];
      expect(callArgs[0]).toMatchObject(mockServiceConfig);
      expect(callArgs[1]).toMatchObject({
        path: getSharePath(mockProduct),
        requestInit: {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamId: mockTeamId,
            conversation: {
              id: mockConversationId,
              type: mockConversationType,
            },
            message: mockMessage,
            link: mockLink,
            cloudId: mockCloudId,
          }),
        },
      });
    });

    describe('getTeams', () => {
      it('should add the correct query params for confluence', async () => {
        await shareToSlackServiceClient.getTeams(mockProduct, mockCloudId);

        expect(requestSpy).toBeCalledTimes(1);
        const callArgs = requestSpy.mock.calls[0];
        expect(callArgs[1]).toMatchObject({
          path: getTeamsPath('confluence'),
          queryParams: {
            cloudId: mockCloudId,
          },
          requestInit: { method: 'get' },
        });
      });

      it('should add the correct query params for other products', async () => {
        await shareToSlackServiceClient.getTeams('jira', mockCloudId);

        expect(requestSpy).toBeCalledTimes(1);
        const callArgs = requestSpy.mock.calls[0];
        expect(callArgs[1]).toMatchObject({
          path: getTeamsPath('jira'),
          queryParams: {},
          requestInit: { method: 'get' },
        });
      });
    });

    describe('getConversations', () => {
      it('should add the correct query params for confluence', async () => {
        await shareToSlackServiceClient.getConversations(
          mockTeamId,
          mockProduct,
          mockCloudId,
        );

        expect(requestSpy).toBeCalledTimes(1);
        const callArgs = requestSpy.mock.calls[0];
        expect(callArgs[1]).toMatchObject({
          path: getConversationsPath('confluence'),
          queryParams: {
            teamId: mockTeamId,
            cloudId: mockCloudId,
          },
          requestInit: { method: 'get' },
        });
      });

      it('should add the correct query params for other products', async () => {
        await shareToSlackServiceClient.getConversations(
          mockTeamId,
          'jira',
          mockCloudId,
        );

        expect(requestSpy).toBeCalledTimes(1);
        const callArgs = requestSpy.mock.calls[0];
        expect(callArgs[1]).toMatchObject({
          path: getConversationsPath('jira'),
          queryParams: {
            teamId: mockTeamId,
          },
          requestInit: { method: 'get' },
        });
      });
    });
  });
});
